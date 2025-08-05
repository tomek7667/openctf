'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useTeamsStore } from '@/stores/teams'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  ExternalLink,
  MapPin,
  Users,
  Trophy
} from '@/components/icons'
import { useToast } from '@/hooks/useToast'
import type { Team } from '@/types/api'

interface TeamsTableProps {
  className?: string
}

function TeamRow({ team, rank }: { team: Team; rank: number }) {
  const getTrendIcon = () => {
    if (!team.weeklyChange) return <Minus className="h-4 w-4 text-muted-foreground" />
    
    if (team.weeklyChange > 0) {
      return (
        <div className="flex items-center text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span className="text-sm">+{team.weeklyChange}</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center text-red-600">
        <TrendingDown className="h-4 w-4 mr-1" />
        <span className="text-sm">{team.weeklyChange}</span>
      </div>
    )
  }

  const getCountryFlag = (countryCode?: string) => {
    if (!countryCode) return null
    // In a real app, you'd use a proper flag component or images
    return (
      <span className="text-lg" title={countryCode}>
        🏳️
      </span>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 border-b hover:bg-accent/50 transition-colors">
      <div className="flex items-center space-x-4 flex-1">
        {/* Rank */}
        <div className="text-lg font-bold text-muted-foreground w-12 text-center">
          #{rank}
        </div>

        {/* Team Info */}
        <div className="flex items-center space-x-3 flex-1">
          {/* Team Logo */}
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            {team.logo ? (
              <img
                src={team.logo}
                alt={`${team.name} logo`}
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <Users className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Team Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Link 
                href={`/teams/${team.id}`}
                className="font-semibold hover:text-primary truncate"
              >
                {team.name}
              </Link>
              {team.verified && (
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
              )}
              {getCountryFlag(team.country)}
            </div>
            
            {team.description && (
              <p className="text-sm text-muted-foreground truncate mt-1">
                {team.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
              {team.country && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{team.country}</span>
                </div>
              )}
              {team.ctftimeID && (
                <div className="flex items-center space-x-1">
                  <ExternalLink className="h-3 w-3" />
                  <span>CTFtime</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-6 text-right">
        {/* Points */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1">
            <Trophy className="h-4 w-4 text-yellow-600" />
            <span className="font-semibold">{team.points || 0}</span>
          </div>
          <span className="text-xs text-muted-foreground">points</span>
        </div>

        {/* Weekly Change */}
        <div className="flex flex-col items-end">
          {getTrendIcon()}
          <span className="text-xs text-muted-foreground">this week</span>
        </div>

        {/* Status */}
        <div className="flex flex-col items-end">
          <Badge 
            variant={team.verified ? 'success' : 'secondary'}
            size="sm"
          >
            {team.verified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export function TeamsTable({ className }: TeamsTableProps) {
  const { teams, isLoading, error, currentPage, limit } = useTeamsStore()

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading teams: {error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-4 w-12 bg-muted rounded" />
                <div className="h-10 w-10 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="h-4 w-16 bg-muted rounded" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (teams.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No teams found</p>
            <p className="text-sm">Try adjusting your search criteria or filters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-muted-foreground w-12 text-center">Rank</span>
            <span className="text-sm font-medium text-muted-foreground flex-1">Team</span>
          </div>
          <div className="flex items-center space-x-6 text-sm font-medium text-muted-foreground">
            <span>Points</span>
            <span>Change</span>
            <span>Status</span>
          </div>
        </div>

        {/* Teams List */}
        <div>
          {teams.map((team, index) => (
            <TeamRow 
              key={team.id} 
              team={team} 
              rank={currentPage * limit + index + 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
