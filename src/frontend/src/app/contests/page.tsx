'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Calendar, Trophy, Clock, Users, Target } from '@/components/ui/icons'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MainLayout } from '@/components/layout/MainLayout'
import { ContestCard } from '@/components/contests/ContestCard'
import { contestsApi } from '@/api/services/contests'
import { Contest, ContestStatus, CTFCategory } from '@/types/api'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/utils'
import { clsx } from 'clsx'

const contestStatuses: { status: ContestStatus | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: 'all', label: 'All Contests', icon: Calendar },
  { status: 'ongoing', label: 'Live Now', icon: Target },
  { status: 'upcoming', label: 'Upcoming', icon: Clock },
  { status: 'finished', label: 'Finished', icon: Trophy },
]

const categories: CTFCategory[] = [
  'web', 'crypto', 'pwn', 'reverse', 'forensics', 'misc', 'osint'
]

interface ContestFilters {
  search: string
  status: ContestStatus | 'all'
  categories: CTFCategory[]
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

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([])
  const [filteredContests, setFilteredContests] = useState<Contest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ContestFilters>({
    search: '',
    status: 'all',
    categories: []
  })
  const { toast } = useToast()

  // Fetch contests on mount
  useEffect(() => {
    console.log("this is fetch")
    const fetchContests = async () => {
      try {
        setIsLoading(true)
        const response = await contestsApi.getContests({ limit: 50 })
        setContests(response.items)
        setFilteredContests(response.items)
      } catch (error) {
        console.error('Error fetching contests:', error)
        toast({
          title: 'Error loading contests',
          description: getErrorMessage(error),
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContests()
  }, [toast])

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

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(contest => 
        contest.categories?.some(cat => filters.categories.includes(cat))
      )
    }

    setFilteredContests(filtered)
  }, [contests, filters])

  const updateFilter = (key: keyof ContestFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleCategory = (category: CTFCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      categories: []
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

              {/* Category Filters */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-muted-foreground">Categories:</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={filters.categories.includes(category) ? 'default' : 'outline'}
                      className={clsx(
                        "cursor-pointer transition-colors font-mono",
                        filters.categories.includes(category) 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-primary/10"
                      )}
                      onClick={() => toggleCategory(category)}
                    >
                      {category.toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(filters.search || filters.status !== 'all' || filters.categories.length > 0) && (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {upcomingContests.map((contest, index) => (
                        <ContestCard key={contest.id} contest={contest} index={index} />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Finished Contests */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {finishedContests.map((contest, index) => (
                        <ContestCard key={contest.id} contest={contest} index={index} />
                      ))}
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
