'use client'
import { useWhitelistSSE } from '@/hooks/useWhitelistSSE'
import { useSession } from 'next-auth/react'
import { useState } from 'react'

/**
 * Test component to demonstrate SSE security validation
 * This component shows:
 * 1. Current user info
 * 2. SSE connection status
 * 3. Event validation logs
 * 4. Option to disable validation for testing
 */
export function SSESecurityTest() {
  const { data: session } = useSession()
  const [validationEnabled, setValidationEnabled] = useState(true)
  const [receivedEvents, setReceivedEvents] = useState<
    {
      type: string
      data: Record<string, unknown>
      timestamp: string
      validated: boolean
    }[]
  >([])

  const { isConnected, connectionStatus, lastEvent } = useWhitelistSSE({
    enabled: true,
    validateUserId: validationEnabled,
    onStatusUpdate: status => {
      setReceivedEvents(prev => [
        ...prev,
        {
          type: 'status_update',
          data: status,
          timestamp: new Date().toISOString(),
          validated: validationEnabled,
        },
      ])
    },
    onRefereeUpdate: referee => {
      setReceivedEvents(prev => [
        ...prev,
        {
          type: 'referee_update',
          data: referee as Record<string, unknown>,
          timestamp: new Date().toISOString(),
          validated: validationEnabled,
        },
      ])
    },
  })

  if (!session) {
    return (
      <div className="p-4 border rounded bg-yellow-50">
        <h3 className="font-bold text-yellow-800">Please log in to test SSE security</h3>
      </div>
    )
  }

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-4">SSE Security Test Panel</h3>

      {/* Current User Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-800">Current User</h4>
        <p>Twitter ID: {session.user.twitterId}</p>
        <p>Handle: @{session.user.username || session.user.name}</p>
      </div>

      {/* Connection Status */}
      <div className="mb-4 p-3 bg-green-50 rounded">
        <h4 className="font-semibold text-green-800">SSE Connection</h4>
        <p>
          Status:
          <span
            className={`ml-2 px-2 py-1 rounded text-sm ${
              connectionStatus === 'connected'
                ? 'bg-green-200 text-green-800'
                : connectionStatus === 'connecting'
                  ? 'bg-yellow-200 text-yellow-800'
                  : 'bg-red-200 text-red-800'
            }`}>
            {connectionStatus}
          </span>
        </p>
        <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
        <p>Last Event: {lastEvent}</p>
      </div>

      {/* Validation Controls */}
      <div className="mb-4 p-3 bg-orange-50 rounded">
        <h4 className="font-semibold text-orange-800">Security Settings</h4>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={validationEnabled}
            onChange={e => setValidationEnabled(e.target.checked)}
            className="mr-2"
          />
          Enable Twitter ID Validation (Recommended)
        </label>
        <p className="text-sm text-gray-600 mt-2">
          When enabled, only events meant for the current user will be processed. Disable for
          testing to see how the system handles invalid events.
        </p>
      </div>

      {/* Received Events Log */}
      <div className="mb-4 p-3 bg-purple-50 rounded">
        <h4 className="font-semibold text-purple-800">Received Events ({receivedEvents.length})</h4>
        <div className="max-h-64 overflow-y-auto">
          {receivedEvents.length === 0 ? (
            <p className="text-gray-500">No events received yet</p>
          ) : (
            receivedEvents
              .slice(-10)
              .reverse()
              .map((event, index) => (
                <div key={index} className="border-b border-purple-200 py-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{event.type}</span>
                    <span className="text-gray-500">{event.timestamp}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Validation: {event.validated ? 'Enabled' : 'Disabled'}
                  </div>
                  <pre className="text-xs bg-gray-100 p-1 mt-1 rounded overflow-x-auto">
                    {JSON.stringify(event.data, null, 2)}
                  </pre>
                </div>
              ))
          )}
        </div>
        {receivedEvents.length > 10 && (
          <p className="text-xs text-gray-500 mt-2">Showing last 10 events</p>
        )}
        <button
          onClick={() => setReceivedEvents([])}
          className="mt-2 px-3 py-1 bg-purple-200 text-purple-800 rounded text-sm hover:bg-purple-300">
          Clear Events
        </button>
      </div>

      {/* Security Warning */}
      <div className="p-3 bg-red-50 border border-red-200 rounded">
        <h4 className="font-semibold text-red-800">🔒 Security Note</h4>
        <p className="text-sm text-red-700">
          Twitter ID validation is critical for preventing cross-user data leakage. Always keep
          validation enabled in production environments.
        </p>
      </div>
    </div>
  )
}
