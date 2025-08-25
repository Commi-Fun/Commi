import { NextResponse } from 'next/server'

// Types for SSE events
export interface WhitelistUpdateEvent {
  type: 'whitelist_update'
  twitterId: string
  data: {
    followed?: boolean
    posted?: boolean
    referred?: boolean
    claimed?: boolean
  }
}

export interface RefereeUpdateEvent {
  type: 'referee_update'
  referrerTwitterId: string
  data: {
    refereeTwitterId: string
    name: string
    handle: string
    profileImageUrl: string
  }
}

export type SSEEvent = WhitelistUpdateEvent | RefereeUpdateEvent

// Connection interface
interface SSEConnection {
  id: string
  twitterId: string
  response: NextResponse
  controller: ReadableStreamDefaultController<any>
  lastPing: number
}

class SSEManager {
  private connections: Map<string, SSEConnection> = new Map()
  private userConnections: Map<string, Set<string>> = new Map() // twitterId -> Set of connection IDs
  private pingInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start ping interval to keep connections alive
    this.pingInterval = setInterval(() => {
      this.pingConnections()
    }, 30000) // Ping every 30 seconds
  }

  // Create SSE response for a client
  createSSEResponse(twitterId: string): NextResponse {
    const connectionId = `${twitterId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const stream = new ReadableStream({
      start: controller => {
        // Send initial connection event
        this.sendEvent(controller, {
          type: 'connection',
          data: 'Connected to whitelist events',
        })

        // Store connection
        const connection: SSEConnection = {
          id: connectionId,
          twitterId,
          response: new NextResponse(),
          controller,
          lastPing: Date.now(),
        }

        this.connections.set(connectionId, connection)

        // Track user connections
        if (!this.userConnections.has(twitterId)) {
          this.userConnections.set(twitterId, new Set())
        }
        this.userConnections.get(twitterId)!.add(connectionId)

        console.log(`SSE connection established for user ${twitterId} (${connectionId})`)
      },
      cancel: () => {
        this.removeConnection(connectionId)
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Send event to a specific controller
  private sendEvent(controller: ReadableStreamDefaultController<any>, event: any) {
    try {
      const eventData = typeof event.data === 'string' ? event.data : JSON.stringify(event.data)
      const message = `event: ${event.type}\ndata: ${eventData}\n\n`
      controller.enqueue(new TextEncoder().encode(message))
    } catch (error) {
      console.error('Error sending SSE event:', error)
    }
  }

  // Broadcast event to specific user connections with security validation
  broadcastToUser(twitterId: string, event: SSEEvent) {
    const userConnectionIds = this.userConnections.get(twitterId)
    if (!userConnectionIds) {
      console.log(`No connections found for user ${twitterId}`)
      return
    }

    console.log(
      `Broadcasting ${event.type} to user ${twitterId} (${userConnectionIds.size} connections)`,
      {
        eventTwitterId: 'twitterId' in event ? event.twitterId : 'N/A',
        targetTwitterId: twitterId,
      },
    )

    // Security validation: ensure event is for the target user
    if ('twitterId' in event) {
      if (event.twitterId !== twitterId) {
        console.error('🚨 Security violation: Attempted to broadcast event to wrong user', {
          eventTwitterId: event.twitterId,
          targetTwitterId: twitterId,
          eventType: event.type,
        })
        return
      }
    }

    userConnectionIds.forEach(connectionId => {
      const connection = this.connections.get(connectionId)
      if (connection) {
        try {
          this.sendEvent(connection.controller, event)
        } catch (error) {
          console.error(`Error broadcasting to connection ${connectionId}:`, error)
          this.removeConnection(connectionId)
        }
      }
    })
  }

  // Broadcast event to all connections
  broadcastToAll(event: SSEEvent) {
    console.log(`Broadcasting ${event.type} to all connections (${this.connections.size} total)`)

    this.connections.forEach((connection, connectionId) => {
      try {
        this.sendEvent(connection.controller, event)
      } catch (error) {
        console.error(`Error broadcasting to connection ${connectionId}:`, error)
        this.removeConnection(connectionId)
      }
    })
  }

  // Remove a connection
  private removeConnection(connectionId: string) {
    const connection = this.connections.get(connectionId)
    if (connection) {
      // Remove from user connections
      const userConnectionIds = this.userConnections.get(connection.twitterId)
      if (userConnectionIds) {
        userConnectionIds.delete(connectionId)
        if (userConnectionIds.size === 0) {
          this.userConnections.delete(connection.twitterId)
        }
      }

      // Close the controller
      try {
        connection.controller.close()
      } catch (error) {
        // Controller might already be closed
      }

      // Remove from main connections map
      this.connections.delete(connectionId)
      console.log(`SSE connection removed for user ${connection.twitterId} (${connectionId})`)
    }
  }

  // Ping all connections to keep them alive
  private pingConnections() {
    const now = Date.now()
    const staleConnections: string[] = []

    this.connections.forEach((connection, connectionId) => {
      try {
        this.sendEvent(connection.controller, {
          type: 'ping',
          data: 'ping',
        })
        connection.lastPing = now
      } catch (error) {
        // Connection is stale
        staleConnections.push(connectionId)
      }
    })

    // Remove stale connections
    staleConnections.forEach(connectionId => {
      this.removeConnection(connectionId)
    })

    if (staleConnections.length > 0) {
      console.log(`Removed ${staleConnections.length} stale SSE connections`)
    }
  }

  // Get connection stats
  getStats() {
    return {
      totalConnections: this.connections.size,
      uniqueUsers: this.userConnections.size,
      userConnections: Array.from(this.userConnections.entries()).map(
        ([twitterId, connections]) => ({
          twitterId,
          connectionCount: connections.size,
        }),
      ),
    }
  }

  // Cleanup
  cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    // Close all connections
    this.connections.forEach((connection, connectionId) => {
      this.removeConnection(connectionId)
    })
  }
}

// Export singleton instance
export const sseManager = new SSEManager()

// Cleanup on process exit
process.on('SIGINT', () => {
  sseManager.cleanup()
})

process.on('SIGTERM', () => {
  sseManager.cleanup()
})
