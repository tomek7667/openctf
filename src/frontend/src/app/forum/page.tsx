'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { 
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp, 
  Plus, 
  Search,
  Pin,
  MessageCircle,
  Eye,
  Calendar
} from 'lucide-react'
import { format, subDays, subHours } from 'date-fns'

const mockPosts = [
  {
    id: 1,
    title: 'CyberTech CTF 2024 - Discussion & Team Formation',
    author: 'ctf_organizer',
    category: 'Events',
    replies: 23,
    views: 156,
    lastActivity: subHours(new Date(), 2),
    isPinned: true,
    isLocked: false,
  },
  {
    id: 2,
    title: 'Looking for teammates for University CTF Finals',
    author: 'student_hacker',
    category: 'Team Formation',
    replies: 8,
    views: 45,
    lastActivity: subHours(new Date(), 4),
    isPinned: false,
    isLocked: false,
  },
  {
    id: 3,
    title: 'Tips for Web Exploitation Challenges',
    author: 'web_expert',
    category: 'General Discussion',
    replies: 15,
    views: 89,
    lastActivity: subHours(new Date(), 6),
    isPinned: false,
    isLocked: false,
  },
  {
    id: 4,
    title: 'SecureCode Challenge - Post Event Discussion',
    author: 'admin',
    category: 'Events',
    replies: 34,
    views: 234,
    lastActivity: subDays(new Date(), 1),
    isPinned: false,
    isLocked: true,
  },
  {
    id: 5,
    title: 'Best practices for Cryptography challenges?',
    author: 'crypto_newbie',
    category: 'General Discussion',
    replies: 12,
    views: 67,
    lastActivity: subDays(new Date(), 2),
    isPinned: false,
    isLocked: false,
  },
]

const categories = [
  { name: 'Events', description: 'Contest announcements and discussions', count: 8, color: 'bg-blue-500' },
  { name: 'Team Formation', description: 'Find teammates for competitions', count: 12, color: 'bg-green-500' },
  { name: 'General Discussion', description: 'CTF techniques and strategies', count: 45, color: 'bg-purple-500' },
  { name: 'Beginner Questions', description: 'Help for new players', count: 23, color: 'bg-yellow-500' },
]

function ForumPost({ post }: { post: typeof mockPosts[0] }) {
  return (
    <div className="flex items-center space-x-4 p-4 border-b hover:bg-accent/50 transition-colors">
      {/* Pin indicator */}
      <div className="w-1">
        {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
      </div>

      {/* Post content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-medium hover:text-primary cursor-pointer truncate">
            {post.title}
          </h3>
          {post.isLocked && <div className="text-muted-foreground">🔒</div>}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>by {post.author}</span>
          <Badge variant="outline" size="sm">
            {post.category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{format(post.lastActivity, 'MMM dd, HH:mm')}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.replies}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4" />
          <span>{post.views}</span>
        </div>
      </div>
    </div>
  )
}

export default function ForumPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Forum</h1>
            <p className="text-muted-foreground">
              Community discussions and event announcements
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{mockPosts.length}</div>
                <div className="text-sm text-muted-foreground">Total Posts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockPosts.reduce((acc, post) => acc + post.replies, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Replies</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Posts Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer">
                  <div className={`h-3 w-3 rounded-full ${category.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{category.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {category.count}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Forum Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Users online:</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Posts today:</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">New members:</span>
                <span className="font-medium">5</span>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Forum Posts */}
        <main className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Discussions</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Latest Activity</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {mockPosts.map((post) => (
                <ForumPost key={post.id} post={post} />
              ))}
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="mt-6 border-dashed border-2">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Join the Conversation</h3>
              <p className="text-muted-foreground mb-4">
                Share your knowledge, ask questions, and connect with the CTF community
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
