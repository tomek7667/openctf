'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Users, Trophy, Star, TrendingUp, Code, Shield, Zap } from '@/components/icons'

const mockTopUsers = [
  { id: 1, username: 'h4ck3r_pr0', points: 2850, category: 'Web', rank: 1, weeklyChange: 15 },
  { id: 2, username: 'crypto_master', points: 2720, category: 'Crypto', rank: 2, weeklyChange: -2 },
  { id: 3, username: 'pwn_ninja', points: 2650, category: 'Pwn', rank: 3, weeklyChange: 8 },
  { id: 4, username: 'rev_wizard', points: 2590, category: 'Reverse', rank: 4, weeklyChange: 12 },
  { id: 5, username: 'misc_expert', points: 2480, category: 'Misc', rank: 5, weeklyChange: -5 },
]

const categories = [
  { name: 'Web', icon: Code, description: 'Web application security', color: 'text-blue-600' },
  { name: 'Crypto', icon: Shield, description: 'Cryptography challenges', color: 'text-green-600' },
  { name: 'Pwn', icon: Zap, description: 'Binary exploitation', color: 'text-red-600' },
  { name: 'Reverse', icon: TrendingUp, description: 'Reverse engineering', color: 'text-purple-600' },
  { name: 'Misc', icon: Star, description: 'Miscellaneous challenges', color: 'text-yellow-600' },
]

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-muted-foreground">
              Individual player rankings and achievements
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Trophy className="h-4 w-4 mr-2" />
            View Rankings
          </Button>
          <Button>
            <Star className="h-4 w-4 mr-2" />
            Top Performers
          </Button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">User Rankings Coming Soon</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            We're building a comprehensive user ranking system based on individual achievements 
            and skill development across different CTF categories.
          </p>
          <div className="text-sm text-muted-foreground">
            Expected features include:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-sm text-left max-w-md mx-auto">
            <div>• Individual player rankings</div>
            <div>• Category-specific leaderboards</div>
            <div>• Achievement tracking</div>
            <div>• Skill progression analysis</div>
            <div>• Team contribution metrics</div>
            <div>• Challenge solve statistics</div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge Categories</CardTitle>
            <p className="text-sm text-muted-foreground">
              User rankings will be organized by these specialized categories
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.name} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                    <Icon className={`h-5 w-5 ${category.color}`} />
                    <div className="flex-1">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Users Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Top Players Preview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sample of how the leaderboard will look
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-bold text-muted-foreground w-8">
                      #{user.rank}
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">{user.category} Specialist</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{user.points.toLocaleString()}</div>
                    <div className={`text-sm flex items-center ${
                      user.weeklyChange > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {user.weeklyChange > 0 ? '+' : ''}{user.weeklyChange}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Development Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold mb-2">Phase 1</div>
              <div className="text-sm text-muted-foreground mb-3">Basic Rankings</div>
              <ul className="text-sm space-y-1">
                <li>• Overall user leaderboard</li>
                <li>• Points calculation system</li>
                <li>• Basic profile pages</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold mb-2">Phase 2</div>
              <div className="text-sm text-muted-foreground mb-3">Category Specialization</div>
              <ul className="text-sm space-y-1">
                <li>• Category-specific rankings</li>
                <li>• Challenge solve tracking</li>
                <li>• Team contribution metrics</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="text-lg font-semibold mb-2">Phase 3</div>
              <div className="text-sm text-muted-foreground mb-3">Advanced Features</div>
              <ul className="text-sm space-y-1">
                <li>• Achievement system</li>
                <li>• Skill progression analysis</li>
                <li>• Advanced statistics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
