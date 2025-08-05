/**
 * Application Providers
 * 
 * Centralizes all context providers and global state management.
 * This ensures proper order of providers and clean architecture.
 */

'use client'

import React, { useEffect, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { LoadingFallback } from '@/components/ui/LoadingFallback'
import ToastContainer from '@/components/ui/ToastContainer'
import { useAuthStore } from '@/stores/auth'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 401, 408, 429
        if (error?.status >= 400 && error?.status < 500) {
          return [401, 408, 429].includes(error.status) && failureCount < 2
        }
        // Retry on 5xx errors up to 3 times
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Auth Initializer Component
 * Handles authentication state initialization
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (!isInitialized) {
    return <LoadingFallback message="Initializing application..." />
  }

  return <>{children}</>
}

/**
 * Toast Configuration
 */
const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
  style: {
    background: 'hsl(var(--card))',
    color: 'hsl(var(--card-foreground))',
    border: '1px solid hsl(var(--primary) / 0.3)',
    borderRadius: '0',
    fontFamily: 'JetBrains Mono, monospace',
    boxShadow: '0 0 10px rgba(0, 255, 255, 0.2)',
  },
  success: {
    iconTheme: {
      primary: 'hsl(var(--success-500))',
      secondary: 'hsl(var(--success-50))',
    },
  },
  error: {
    iconTheme: {
      primary: 'hsl(var(--destructive))',
      secondary: 'hsl(var(--destructive-foreground))',
    },
  },
  loading: {
    iconTheme: {
      primary: 'hsl(var(--primary))',
      secondary: 'hsl(var(--primary-foreground))',
    },
  },
}

/**
 * Main Providers Component
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingFallback />}>
          <AuthInitializer>
            {children}
          </AuthInitializer>
        </Suspense>
        
        {/* Toast notifications */}
        <Toaster
          position={toastOptions.position}
          toastOptions={toastOptions}
        />
        
        {/* Development tools */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools 
            initialIsOpen={false} 
            position="bottom-right"
          />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default Providers
