'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Trophy, Clock, Users, Target, Star, Shield } from '@/components/ui/icons'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MainLayout } from '@/components/layout/MainLayout'
import { ContestCard } from '@/components/contests/ContestCard'
import { contestsApi } from '@/api/services/contests'
import { Contest, ContestStatus } from '@/types/api'
import { clsx } from 'clsx'

const contestStatuses: { status: ContestStatus | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: 'all', label: 'All Contests', icon: Calendar },
  { status: 'ongoing', label: 'Live Now', icon: Target },
  { status: 'upcoming', label: 'Upcoming', icon: Clock },
  { status: 'finished', label: 'Finished', icon: Trophy },
]

const ratingOptions = [
  { min: 4, max: 5, label: '4+ Stars' },
  { min: 3, max: 5, label: '3+ Stars' },
  { min: 2, max: 5, label: '2+ Stars' },
  { min: 1, max: 5, label: '1+ Stars' },
]

const weightOptions = [
  { min: 80, max: 100, label: 'Extreme (80+)' },
  { min: 50, max: 79, label: 'Hard (50-79)' },
  { min: 20, max: 49, label: 'Medium (20-49)' },
  { min: 0, max: 19, label: 'Easy (0-19)' },
]

const getCurrentYear = () => new Date().getFullYear()
const getYearOptions = () => {
  const currentYear = getCurrentYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - i)
}

interface ContestFilters {
  search: string
  status: ContestStatus | 'all'
  minRating?: number
  maxRating?: number
  minWeight?: number
  maxWeight?: number
  year?: number
}

const StatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  description,
  isLoading = false 
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number
  description?: string
  isLoading?: boolean
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 bg-card/50 backdrop-blur-sm rounded-none hacker-border"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 bg-primary/10 rounded">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-mono font-bold text-foreground">{label}</h3>
    </div>
    
    {isLoading ? (
      <div className="text-2xl font-bold text-primary mb-1 font-mono animate-pulse">---</div>
    ) : (
      <div className="text-2xl font-bold text-primary mb-1 font-mono glow-text">{value}</div>
    )}
    
    {description && (
      <p className="text-xs text-muted-foreground font-mono">{description}</p>
    )}
  </motion.div>
)

const ContestTableRow = ({ contest }: { contest: Contest }) => (
  <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
    <td className="p-4 font-mono">
      <div>
        <div className="font-bold text-foreground">{contest.name.replace(/-/g, ' ').toUpperCase()}</div>
        <div className="text-sm text-muted-foreground truncate max-w-xs">{contest.description}</div>
      </div>
    </td>
    <td className="p-4 font-mono text-sm">
      {new Date(contest.start).toLocaleDateString()}
    </td>
    <td className="p-4 font-mono text-sm">
      <div className="flex items-center gap-1">
        <Shield className="h-4 w-4 text-muted-foreground" />
        <span className={clsx(
          "font-bold",
          contest.assignedWeightPoints >= 80 ? "text-red-400" :
          contest.assignedWeightPoints >= 50 ? "text-yellow-400" :
          contest.assignedWeightPoints >= 20 ? "text-blue-400" : "text-green-400"
        )}>
          {contest.assignedWeightPoints}
        </span>
      </div>
    </td>
    <td className="p-4">
      {contest.averageRating && contest.totalRatings && contest.totalRatings > 0 ? (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={clsx(
                "h-3 w-3",
                i < Math.floor(contest.averageRating!) ? "text-yellow-400 fill-current" : "text-gray-600"
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({contest.averageRating.toFixed(1)})</span>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground">No ratings</span>
      )}
    </td>
    <td className="p-4 font-mono text-sm">
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-muted-foreground" />
        {contest.participantCount}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center gap-2">
        {contest.url && (
          <a
            href={contest.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
        <a
          href={`/contests/${contest.id}`}
          className="btn-terminal px-2 py-1 text-xs font-mono font-bold"
        >
          DETAILS
        </a>
      </div>
    </td>
  </tr>
)

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [filteredContests, setFilteredContests] = useState<Contest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ContestFilters>({
    search: '',
    status: 'all'
  })

  console.log("this is fetch")

  // Fetch contests on mount
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true)
        const response = await contestsApi.getContests({ limit: 50 })
        setContests(response.items)
        setFilteredContests(response.items)
      } catch (error) {
        console.error('Error fetching contests:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContests()
  }, [])

  // Apply filters whenever filters or contests change
  useEffect(() => {
    let filtered = [...contests]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(contest => 
        contest.name.toLowerCase().includes(searchLower) ||
        contest.description?.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(contest => contest.status === filters.status)
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      filtered = filtered.filter(contest =>
        contest.averageRating && contest.averageRating >= filters.minRating!
      )
    }

    // Weight filter
    if (filters.minWeight !== undefined && filters.maxWeight !== undefined) {
      filtered = filtered.filter(contest => 
        contest.assignedWeightPoints >= filters.minWeight! && 
        contest.assignedWeightPoints <= filters.maxWeight!
      )
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter(contest => 
        new Date(contest.start).getFullYear() === filters.year
      )
    }

    setFilteredContests(filtered)
  }, [contests, filters])

  const updateFilter = (key: keyof ContestFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const setRatingFilter = (min?: number, max?: number) => {
    setFilters(prev => ({ ...prev, minRating: min, maxRating: max }))
  }

  const setWeightFilter = (min?: number, max?: number) => {
    setFilters(prev => ({ ...prev, minWeight: min, maxWeight: max }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all'
    })
  }

  // Group contests by status
  const ongoingContests = filteredContests.filter(c => c.status === 'ongoing')
  const upcomingContests = filteredContests.filter(c => c.status === 'upcoming')
  const finishedContests = filteredContests.filter(c => c.status === 'finished')

  // Stats
  const stats = {
    total: contests.length,
    ongoing: contests.filter(c => c.status === 'ongoing').length,
    upcoming: contests.filter(c => c.status === 'upcoming').length,
    finished: contests.filter(c => c.status === 'finished').length
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.minRating || filters.minWeight || filters.year

  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 matrix-bg opacity-20" />
          <div className="relative max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
                <span className="terminal-prompt">$ </span>
                <span className="hacker-gradient-text glow-text">CTF_CONTESTS</span>
                <span className="animate-pulse text-primary">_</span>
              </h1>
              
              <div className="terminal glass-terminal p-6 max-w-3xl mx-auto text-left">
                <div className="text-primary mb-2">root@openctf:~# cat contests.txt</div>
                <p className="text-green-400 leading-relaxed">
                  {"// Browse all Capture The Flag competitions"}<br/>
                  {"// Upcoming, ongoing, and finished contests from around the world"}<br/>
                  <span className="text-yellow-400">
                    {"// Live tracking and real-time updates | Total: " + stats.total}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <StatCard
                icon={Calendar}
                label="Total Contests"
                value={stats.total}
                description="All time"
                isLoading={isLoading}
              />
              <StatCard
                icon={Target}
                label="Live Now"
                value={stats.ongoing}
                description="Currently running"
                isLoading={isLoading}
              />
              <StatCard
                icon={Clock}
                label="Upcoming"
                value={stats.upcoming}
                description="Starting soon"
                isLoading={isLoading}
              />
              <StatCard
                icon={Trophy}
                label="Completed"
                value={stats.finished}
                description="Finished events"
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Search and Status Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contests..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-10 font-mono"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {contestStatuses.map(({ status, label, icon: Icon }) => (
                    <Button
                      key={status}
                      variant={filters.status === status ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('status', status)}
                      className="font-mono"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Advanced Filters */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-muted-foreground">Advanced Filters:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rating Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Quality Rating:</label>
                    <div className="flex flex-wrap gap-1">
                      {ratingOptions.map((option) => (
                        <Badge
                          key={`${option.min}-${option.max}`}
                          variant={filters.minRating === option.min ? 'default' : 'outline'}
                          className="cursor-pointer transition-colors font-mono"
                          onClick={() => setRatingFilter(option.min, option.max)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Weight Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Difficulty Weight:</label>
                    <div className="flex flex-wrap gap-1">
                      {weightOptions.map((option) => (
                        <Badge
                          key={`${option.min}-${option.max}`}
                          variant={filters.minWeight === option.min ? 'default' : 'outline'}
                          className="cursor-pointer transition-colors font-mono"
                          onClick={() => setWeightFilter(option.min, option.max)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Year Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-muted-foreground">Year:</label>
                    <div className="flex flex-wrap gap-1">
                      {getYearOptions().map((year) => (
                        <Badge
                          key={year}
                          variant={filters.year === year ? 'default' : 'outline'}
                          className="cursor-pointer transition-colors font-mono"
                          onClick={() => updateFilter('year', year)}
                        >
                          {year}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-mono">
                    Showing {filteredContests.length} of {contests.length} contests
                  </span>
                  <Button variant="outline" size="sm" onClick={clearFilters} className="font-mono">
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Contest Sections */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto space-y-16">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Ongoing Contests */}
                {(filters.status === 'all' || filters.status === 'ongoing') && ongoingContests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="h-6 w-6 text-green-400" />
                      <h2 className="text-2xl font-bold font-mono text-green-400 glow-text">
                        &gt; LIVE_CONTESTS ({ongoingContests.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {ongoingContests.map((contest, index) => (
                        <ContestCard key={contest.id} contest={contest} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Upcoming Contests */}
                {(filters.status === 'all' || filters.status === 'upcoming') && upcomingContests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-6 w-6 text-blue-400" />
                      <h2 className="text-2xl font-bold font-mono text-blue-400">
                        &gt; UPCOMING_CONTESTS ({upcomingContests.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {upcomingContests.map((contest, index) => (
                        <ContestCard key={contest.id} contest={contest} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Finished Contests - Table View */}
                {(filters.status === 'all' || filters.status === 'finished') && finishedContests.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-yellow-400" />
                      <h2 className="text-2xl font-bold font-mono text-yellow-400">
                        &gt; FINISHED_CONTESTS ({finishedContests.length})
                      </h2>
                    </div>
                    
                    <div className="bg-card/30 rounded-none hacker-border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr className="border-b border-border">
                              <th className="p-4 text-left font-mono text-sm font-bold">Contest</th>
                              <th className="p-4 text-left font-mono text-sm font-bold">Date</th>
                              <th className="p-4 text-left font-mono text-sm font-bold">Weight</th>
                              <th className="p-4 text-left font-mono text-sm font-bold">Rating</th>
                              <th className="p-4 text-left font-mono text-sm font-bold">Teams</th>
                              <th className="p-4 text-left font-mono text-sm font-bold">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {finishedContests.slice(0, 20).map((contest) => (
                              <ContestTableRow key={contest.id} contest={contest} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      {finishedContests.length > 20 && (
                        <div className="p-4 bg-muted/20 border-t border-border">
                          <p className="text-sm text-muted-foreground font-mono text-center">
                            Showing first 20 of {finishedContests.length} finished contests
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* No Results */}
                {filteredContests.length === 0 && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="terminal glass-terminal p-8 max-w-lg mx-auto">
                      <div className="text-primary mb-2">root@openctf:~# find contests</div>
                      <p className="text-yellow-400 mb-4">
                        {"// No contests found matching your criteria"}<br/>
                        {"// Try adjusting your filters or search terms"}
                      </p>
                      <Button onClick={clearFilters} className="font-mono">
                        &gt; CLEAR_FILTERS
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
