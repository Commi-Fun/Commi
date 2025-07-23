import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { MCPMessage, MCPConnection, DataUpdate, UIStateSync, FastQueryRequest, FastQueryResponse } from './types';

export class MCPClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private connection: MCPConnection;
  private reconnectInterval: NodeJS.Timeout | null = null;
  private messageId = 0;
  private pendingRequests = new Map<string, {
    resolve: (result: any) => void;
    reject: (error: any) => void;
    timeout: NodeJS.Timeout;
  }>();

  constructor(
    private url: string,
    private options: {
      reconnectInterval?: number;
      requestTimeout?: number;
    } = {}
  ) {
    super();
    
    this.connection = {
      id: `mcp-${Date.now()}`,
      status: 'disconnected',
      lastActivity: new Date()
    };

    this.options.reconnectInterval = options.reconnectInterval ?? 5000;
    this.options.requestTimeout = options.requestTimeout ?? 30000;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.connection.status = 'connecting';
      this.emit('statusChange', this.connection.status);

      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        this.connection.status = 'connected';
        this.connection.lastActivity = new Date();
        this.emit('statusChange', this.connection.status);
        this.emit('connected');
        resolve();

        // Clear reconnect interval if it exists
        if (this.reconnectInterval) {
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
        }
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const message: MCPMessage = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse MCP message:', error);
        }
      });

      this.ws.on('close', () => {
        this.connection.status = 'disconnected';
        this.emit('statusChange', this.connection.status);
        this.emit('disconnected');
        this.startReconnect();
      });

      this.ws.on('error', (error) => {
        this.connection.status = 'error';
        this.emit('statusChange', this.connection.status);
        this.emit('error', error);
        reject(error);
      });
    });
  }

  disconnect(): void {
    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Reject all pending requests
    this.pendingRequests.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(new Error('Connection closed'));
    });
    this.pendingRequests.clear();
  }

  private startReconnect(): void {
    if (this.reconnectInterval) return;

    this.reconnectInterval = setInterval(() => {
      if (this.connection.status === 'disconnected') {
        this.connect().catch(console.error);
      }
    }, this.options.reconnectInterval!);
  }

  private handleMessage(message: MCPMessage): void {
    this.connection.lastActivity = new Date();

    if (message.type === 'response' && message.id) {
      const pending = this.pendingRequests.get(message.id);
      if (pending) {
        clearTimeout(pending.timeout);
        this.pendingRequests.delete(message.id);
        
        if (message.error) {
          pending.reject(message.error);
        } else {
          pending.resolve(message.result);
        }
      }
    } else if (message.type === 'notification') {
      this.emit('notification', message);
      
      // Handle specific notification types
      switch (message.method) {
        case 'dataUpdate':
          this.emit('dataUpdate', message.params as DataUpdate);
          break;
        case 'uiStateSync':
          this.emit('uiStateSync', message.params as UIStateSync);
          break;
        default:
          this.emit('unknownNotification', message);
      }
    }
  }

  private sendMessage(message: MCPMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('WebSocket not connected'));
        return;
      }

      if (message.type === 'request') {
        const timeout = setTimeout(() => {
          this.pendingRequests.delete(message.id);
          reject(new Error('Request timeout'));
        }, this.options.requestTimeout!);

        this.pendingRequests.set(message.id, { resolve, reject, timeout });
      }

      try {
        this.ws.send(JSON.stringify(message));
        if (message.type !== 'request') {
          resolve(undefined);
        }
      } catch (error) {
        if (message.type === 'request') {
          const pending = this.pendingRequests.get(message.id);
          if (pending) {
            clearTimeout(pending.timeout);
            this.pendingRequests.delete(message.id);
          }
        }
        reject(error);
      }
    });
  }

  // Fast query method
  async fastQuery<T = any>(request: FastQueryRequest): Promise<FastQueryResponse<T>> {
    const message: MCPMessage = {
      id: (++this.messageId).toString(),
      type: 'request',
      method: 'fastQuery',
      params: request
    };

    return this.sendMessage(message);
  }

  // Subscribe to data updates
  async subscribeToUpdates(types: string[]): Promise<void> {
    const message: MCPMessage = {
      id: (++this.messageId).toString(),
      type: 'request',
      method: 'subscribe',
      params: { types }
    };

    return this.sendMessage(message);
  }

  // Sync UI state
  async syncUIState(state: UIStateSync): Promise<void> {
    const message: MCPMessage = {
      id: (++this.messageId).toString(),
      type: 'notification',
      method: 'uiStateSync',
      params: state
    };

    return this.sendMessage(message);
  }

  getConnectionStatus(): MCPConnection {
    return { ...this.connection };
  }
}