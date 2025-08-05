import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <div className="text-4xl">🔍</div>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-2">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-muted-foreground">
              You might want to check the URL or return to the homepage.
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/teams">
                <Search className="h-4 w-4 mr-2" />
                Browse Teams
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Popular pages:</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Link href="/teams" className="text-primary hover:underline">Teams</Link>
              <span>•</span>
              <Link href="/contests" className="text-primary hover:underline">Contests</Link>
              <span>•</span>
              <Link href="/forum" className="text-primary hover:underline">Forum</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
