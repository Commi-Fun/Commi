'use client'

import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 10 * 60 * 1000, // 10 minutes
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors
              if (error instanceof Error && 'status' in error) {
                const status = (error as any).status
                if (status >= 400 && status < 500) {
                  return false
                }
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: false,
          },
        },
      }),
  )

  const [persister] = useState(() =>
    createAsyncStoragePersister({
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }),
  )

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: Infinity,
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            return ((query.meta?.isPersist || false) as boolean) && query.state.status === 'success'
          },
        },
      }}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </PersistQueryClientProvider>
  )
}
