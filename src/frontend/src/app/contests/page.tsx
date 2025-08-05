'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Trophy, Calendar, Clock, Users, Plus, Filter, ExternalLink } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'

const mockContests = [
  {
    id: 1,
    name: 'CyberTech CTF 2024',
    status: 'upcoming',
    start: addDays(new Date(), 5),
    end: addDays(new Date(), 7),
    participants: 156,
    prizes: '$5,000',
    difficulty: 'Hard',
  },
  {
    id: 2,
    name: 'SecureCode Challenge',
    status: 'ongoing',
    start: subDays(new Date(), 1),
    end: addDays(new Date(), 1),
    participants: 89,
    prizes: '$2,500',
    difficulty: 'Medium',
  },
  {
    id: 3,
    name: 'University CTF Finals',
    status: 'finished',
    start: subDays(new Date(), 10),
    end: subDays(new Date(), 8),
    participants: 234,
    prizes: '$10,000',
    difficulty: 'Hard',
  },
  {
    id: 4,
    name: 'Beginner Friendly CTF',
    status: 'upcoming',
    start: addDays(new Date(), 12),
    end: addDays(new Date(), 14),
    participants: 45,
    prizes: '$1,000',
    difficulty: 'Easy',
  },
]

function ContestCard({ contest }: { contest: typeof mockContests[0] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'success'
      case 'upcoming': return 'default'
      case 'finished': return 'secondary'
      default: return 'secondary'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success'
      case 'Medium': return 'default'
      case 'Hard': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{contest.name}</h3>
            <div className="flex items-center space-x-2 mb-3">
              <Badge variant={getStatusColor(contest.status)} size="sm">
                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
              </Badge>
              <Badge variant={getDifficultyColor(contest.difficulty)} size="sm">
                {contest.difficulty}
              </Badge>
            </div>
          </div>
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(contest.start, 'MMM dd')} - {format(contest.end, 'MMM dd, yyyy')}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(contest.start, 'HH:mm')} - {format(contest.end, 'HH:mm')}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{contest.participants} participants</span>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{contest.prizes} in prizes</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Button size="sm" className="flex-1">
            {contest.status === 'upcoming' && 'Register'}
            {contest.status === 'ongoing' && 'Join Now'}
            {contest.status === 'finished' && 'View Results'}
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ContestsPage() {
  const upcomingContests = mockContests.filter(c => c.status === 'upcoming')
  const ongoingContests = mockContests.filter(c => c.status === 'ongoing')
  const finishedContests = mockContests.filter(c => c.status === 'finished')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Contests</h1>
            <p className="text-muted-foreground">
              Participate in Capture The Flag competitions
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Contest
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{mockContests.length}</div>
                <div className="text-sm text-muted-foreground">Total Contests</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{ongoingContests.length}</div>
                <div className="text-sm text-muted-foreground">Live Now</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{upcomingContests.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {mockContests.reduce((acc, c) => acc + c.participants, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Participants</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ongoing Contests */}
      {ongoingContests.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <div className="h-3 w-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            Live Contests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingContests.map((contest) => (
              <ContestCard key={contest.id} contest={contest} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Contests */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </section>

      {/* Recent Contests */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Contests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {finishedContests.map((contest) => (
            <ContestCard key={contest.id} contest={contest} />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <Card className="border-dashed border-2">
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Host Your Own CTF</h3>
          <p className="text-muted-foreground mb-4">
            Create and manage your own Capture The Flag competition
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Contest
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
