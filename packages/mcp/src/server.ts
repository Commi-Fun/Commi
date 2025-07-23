import { EventEmitter } from 'events';
import WebSocket, { WebSocketServer } from 'ws';
import { MCPMessage, DataUpdate, UIStateSync, FastQueryRequest, FastQueryResponse } from './types';

interface ClientConnection {
  id: string;
  ws: WebSocket;
  subscriptions: Set<string>;
  lastActivity: Date;
}

export class MCPServer extends EventEmitter {
  private wss: WebSocketServer | null = null;
  private clients = new Map<string, ClientConnection>();
  private dataCache = new Map<string, any>();
  private cacheExpiry = new Map<string, number>();

  constructor(
    private options: {
      port?: number;
      cacheTimeout?: number;
    } = {}
  ) {
    super();
    this.options.port = options.port ?? 8080;
    this.options.cacheTimeout = options.cacheTimeout ?? 60000; // 1 minute
  }

  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss = new WebSocketServer({ 
        port: this.options.port,
        perMessageDeflate: false
      });

      this.wss.on('connection', (ws: WebSocket) => {
        const clientId = `client-${Date.now()}-${Math.random()}`;
        const client: ClientConnection = {
          id: clientId,
          ws,
          subscriptions: new Set(),
          lastActivity: new Date()
        };

        this.clients.set(clientId, client);
        this.emit('clientConnected', clientId);

        ws.on('message', (data: WebSocket.Data) => {
          try {
            const message: MCPMessage = JSON.parse(data.toString());
            this.handleClientMessage(clientId, message);
          } catch (error) {
            console.error(`Failed to parse message from ${clientId}:`, error);
          }
        });

        ws.on('close', () => {
          this.clients.delete(clientId);
          this.emit('clientDisconnected', clientId);
        });

        ws.on('error', (error) => {
          console.error(`WebSocket error for ${clientId}:`, error);
          this.clients.delete(clientId);
        });

        ws.on('pong', () => {
          client.lastActivity = new Date();
        });
      });

      this.wss.on('listening', () => {
        console.log(`MCP Server listening on port ${this.options.port}`);
        resolve();
      });

      this.wss.on('error', reject);

      // Start heartbeat
      this.startHeartbeat();
    });
  }

  stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.wss) {
        this.wss.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private startHeartbeat(): void {
    setInterval(() => {
      const now = Date.now();
      
      this.clients.forEach((client, clientId) => {
        const timeSinceLastActivity = now - client.lastActivity.getTime();
        
        if (timeSinceLastActivity > 30000) { // 30 seconds
          client.ws.ping();
        }
        
        if (timeSinceLastActivity > 60000) { // 1 minute - disconnect
          client.ws.terminate();
          this.clients.delete(clientId);
          this.emit('clientDisconnected', clientId);
        }
      });

      // Clean expired cache
      this.cacheExpiry.forEach((expiry, key) => {
        if (now > expiry) {
          this.dataCache.delete(key);
          this.cacheExpiry.delete(key);
        }
      });
    }, 10000); // Check every 10 seconds
  }

  private handleClientMessage(clientId: string, message: MCPMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastActivity = new Date();

    switch (message.method) {
      case 'fastQuery':
        this.handleFastQuery(client, message);
        break;
      
      case 'subscribe':
        this.handleSubscribe(client, message);
        break;
      
      case 'unsubscribe':
        this.handleUnsubscribe(client, message);
        break;
      
      case 'uiStateSync':
        this.handleUIStateSync(client, message);
        break;
      
      default:
        this.sendError(client, message.id, -32601, 'Method not found');
    }
  }

  private async handleFastQuery(client: ClientConnection, message: MCPMessage): Promise<void> {
    try {
      const request = message.params as FastQueryRequest;
      const cacheKey = JSON.stringify(request);
      
      // Check cache first
      if (this.dataCache.has(cacheKey) && this.cacheExpiry.has(cacheKey)) {
        const expiry = this.cacheExpiry.get(cacheKey)!;
        if (Date.now() < expiry) {
          const cachedResult = this.dataCache.get(cacheKey);
          this.sendResponse(client, message.id, {
            ...cachedResult,
            cached: true
          });
          return;
        }
      }

      // Emit event for external handlers to process
      const result = await new Promise<FastQueryResponse>((resolve, reject) => {
        this.emit('fastQuery', request, resolve, reject);
      });

      // Cache the result
      this.dataCache.set(cacheKey, result);
      this.cacheExpiry.set(cacheKey, Date.now() + this.options.cacheTimeout!);

      this.sendResponse(client, message.id, result);
    } catch (error) {
      this.sendError(client, message.id, -32603, 'Internal error', error);
    }
  }

  private handleSubscribe(client: ClientConnection, message: MCPMessage): void {
    try {
      const { types } = message.params as { types: string[] };
      
      types.forEach(type => {
        client.subscriptions.add(type);
      });

      this.sendResponse(client, message.id, { success: true });
      this.emit('clientSubscribed', client.id, types);
    } catch (error) {
      this.sendError(client, message.id, -32603, 'Internal error', error);
    }
  }

  private handleUnsubscribe(client: ClientConnection, message: MCPMessage): void {
    try {
      const { types } = message.params as { types: string[] };
      
      types.forEach(type => {
        client.subscriptions.delete(type);
      });

      this.sendResponse(client, message.id, { success: true });
    } catch (error) {
      this.sendError(client, message.id, -32603, 'Internal error', error);
    }
  }

  private handleUIStateSync(client: ClientConnection, message: MCPMessage): void {
    const state = message.params as UIStateSync;
    this.emit('uiStateSync', client.id, state);
  }

  private sendResponse(client: ClientConnection, messageId: string, result: any): void {
    const response: MCPMessage = {
      id: messageId,
      type: 'response',
      result
    };

    this.sendMessage(client, response);
  }

  private sendError(client: ClientConnection, messageId: string, code: number, message: string, data?: any): void {
    const response: MCPMessage = {
      id: messageId,
      type: 'response',
      error: { code, message, data }
    };

    this.sendMessage(client, response);
  }

  private sendMessage(client: ClientConnection, message: MCPMessage): void {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Failed to send message to ${client.id}:`, error);
      }
    }
  }

  // Broadcast data updates to subscribed clients
  broadcastDataUpdate(update: DataUpdate): void {
    const notification: MCPMessage = {
      id: `notification-${Date.now()}`,
      type: 'notification',
      method: 'dataUpdate',
      params: update
    };

    this.clients.forEach(client => {
      if (client.subscriptions.has(update.type) || client.subscriptions.has('all')) {
        this.sendMessage(client, notification);
      }
    });
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.clients.size;
  }

  // Get client subscriptions
  getClientSubscriptions(clientId: string): string[] {
    const client = this.clients.get(clientId);
    return client ? Array.from(client.subscriptions) : [];
  }
}