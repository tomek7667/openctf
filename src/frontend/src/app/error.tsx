'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <span>Application Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We're sorry, but something went wrong. Our team has been notified and is working to fix the issue.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="text-left text-sm mb-4">
                <summary className="cursor-pointer text-muted-foreground mb-2">
                  Technical Details
                </summary>
                <div className="bg-muted p-3 rounded text-xs">
                  <div className="font-medium mb-1">Error:</div>
                  <div className="mb-2">{error.message}</div>
                  
                  {error.digest && (
                    <>
                      <div className="font-medium mb-1">Digest:</div>
                      <div className="mb-2">{error.digest}</div>
                    </>
                  )}
                  
                  {error.stack && (
                    <>
                      <div className="font-medium mb-1">Stack Trace:</div>
                      <pre className="whitespace-pre-wrap text-xs opacity-70">
                        {error.stack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            If this problem persists, please contact our support team.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
