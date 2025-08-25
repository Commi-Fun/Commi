import { useEffect, useState, useRef, useCallback } from 'react'
import { WhitelistStatus } from '@/types/whitelist'
import { useSession } from 'next-auth/react'

interface RefereeData {
  refereeTwitterId: string
  name: string
  handle: string
  profileImageUrl: string
}

interface UseWhitelistSSEOptions {
  enabled?: boolean
  onStatusUpdate?: (status: Partial<WhitelistStatus>) => void
  onRefereeUpdate?: (referee: RefereeData) => void
  onError?: (error: Event) => void
  onReconnect?: () => void
  validateUserId?: boolean // Enable/disable twitterId validation for security
}

interface UseWhitelistSSEReturn {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  lastEvent: string | null
  reconnect: () => void
  disconnect: () => void
}

export function useWhitelistSSE(options: UseWhitelistSSEOptions = {}): UseWhitelistSSEReturn {
  const {
    enabled = true,
    onStatusUpdate,
    onRefereeUpdate,
    onError,
    onReconnect,
    validateUserId = true, // Enable twitterId validation by default for security
  } = options

  const { data: session } = useSession()
  const currentTwitterId = session?.user?.twitterId

  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected' | 'error'
  >('disconnected')
  const [lastEvent, setLastEvent] = useState<string | null>(null)

  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const baseReconnectDelay = 1000 // 1 second

  // Security validation function to ensure events are for the current user
  const validateEventForCurrentUser = useCallback(
    (eventData: any): boolean => {
      if (!validateUserId || !currentTwitterId) {
        // If validation is disabled or user info is not available, allow all events
        return true
      }

      // Check if the event contains twitterId for whitelist updates
      if (eventData.twitterId) {
        const isForCurrentUser = eventData.twitterId === currentTwitterId

        if (!isForCurrentUser) {
          console.warn('🚨 Security: Received SSE event for different user:', {
            eventTwitterId: eventData.twitterId,
            currentTwitterId,
          })
          return false
        }
      }

      // For referee updates, validate referrerTwitterId
      if (eventData.referrerTwitterId) {
        const isForCurrentUser = eventData.referrerTwitterId === currentTwitterId

        if (!isForCurrentUser) {
          console.warn('🚨 Security: Received referee update for different user:', {
            eventReferrerTwitterId: eventData.referrerTwitterId,
            currentTwitterId,
          })
          return false
        }
      }

      return true
    },
    [validateUserId, currentTwitterId],
  )

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    setIsConnected(false)
    setConnectionStatus('disconnected')
    setLastEvent(null)
    reconnectAttemptsRef.current = 0
  }, [])

  const connect = useCallback(() => {
    if (!enabled) {
      return
    }

    // Close existing connection
    disconnect()

    try {
      setConnectionStatus('connecting')

      const eventSource = new EventSource('/api/whitelist/events', {
        withCredentials: true,
      })

      eventSource.onopen = () => {
        console.log('✅ SSE connection opened')
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectAttemptsRef.current = 0
        setLastEvent('Connected')
      }

      eventSource.onmessage = event => {
        console.log('SSE message received:', event)
        setLastEvent(event.data)
      }

      // Handle connection events
      eventSource.addEventListener('connection', event => {
        console.log('SSE connection event:', event.data)
        setLastEvent(`Connection: ${event.data}`)
      })

      // Handle ping events to keep connection alive
      eventSource.addEventListener('ping', () => {
        // Just acknowledge the ping, don't update UI
        console.debug('SSE ping received')
      })

      // Handle whitelist status updates with user validation
      eventSource.addEventListener('whitelist_update', event => {
        try {
          const data = JSON.parse(event.data)
          console.log('Whitelist update received:', data)

          // 🔒 Security validation: ensure this event is for the current user
          if (!validateEventForCurrentUser(data)) {
            console.warn('❌ Ignoring whitelist update for different user')
            return
          }

          setLastEvent(`Status updated: ${JSON.stringify(data.data)}`)

          if (onStatusUpdate) {
            onStatusUpdate(data.data)
          }
        } catch (error) {
          console.error('Error parsing whitelist update:', error)
        }
      })

      // Handle referee updates with user validation
      eventSource.addEventListener('referee_update', event => {
        try {
          const data = JSON.parse(event.data)
          console.log('Referee update received:', data)

          // 🔒 Security validation: ensure this event is for the current user
          if (!validateEventForCurrentUser(data)) {
            console.warn('❌ Ignoring referee update for different user')
            return
          }

          setLastEvent(`New referee: ${data.data.handle}`)

          if (onRefereeUpdate) {
            onRefereeUpdate(data.data)
          }
        } catch (error) {
          console.error('Error parsing referee update:', error)
        }
      })

      eventSource.onerror = event => {
        console.error('SSE error:', event)
        setIsConnected(false)
        setConnectionStatus('error')
        setLastEvent('Connection error')

        if (onError) {
          onError(event)
        }

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current)
          reconnectAttemptsRef.current++

          console.log(
            `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`,
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Reconnecting SSE...')
            connect()
            if (onReconnect) {
              onReconnect()
            }
          }, delay)
        } else {
          console.error('Max reconnection attempts reached')
          setConnectionStatus('error')
        }
      }

      eventSourceRef.current = eventSource
    } catch (error) {
      console.error('Failed to create SSE connection:', error)
      setConnectionStatus('error')
      setLastEvent('Failed to connect')
    }
  }, [
    enabled,
    disconnect,
    onStatusUpdate,
    onRefereeUpdate,
    onError,
    onReconnect,
    validateEventForCurrentUser,
  ])

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0
    connect()
  }, [connect])

  // Auto-connect when enabled
  useEffect(() => {
    if (enabled) {
      connect()
    } else {
      disconnect()
    }

    // Cleanup on unmount
    return () => {
      disconnect()
    }
  }, [enabled, connect, disconnect])

  // Handle page visibility changes to reconnect when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled && !isConnected) {
        console.log('Page became visible, reconnecting SSE...')
        reconnect()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, isConnected, reconnect])

  return {
    isConnected,
    connectionStatus,
    lastEvent,
    reconnect,
    disconnect,
  }
}
