'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Calendar, 
  Trophy, 
  Users, 
  Target, 
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  BarChart,
  Clock,
  Info
} from '@/components/ui/icons'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MainLayout } from '@/components/layout/MainLayout'
import { clsx } from 'clsx'

interface MonthlyDistribution {
  month: string
  year: number
  totalPoints: number
  eligibleContests: number
  distributedPoints: number
  remainingPool: number
}

interface ContestWeightHistory {
  id: number
  name: string
  date: string
  participants: number
  organizers: string
  weightReceived: number
  difficulty: number
  eligible: boolean
  reason?: string
}

// Mock data for weight pool history
const mockMonthlyData: MonthlyDistribution[] = [
  {
    month: 'January',
    year: 2025,
    totalPoints: 100,
    eligibleContests: 3,
    distributedPoints: 85,
    remainingPool: 15
  },
  {
    month: 'December',
    year: 2024,
    totalPoints: 100,
    eligibleContests: 4,
    distributedPoints: 95,
    remainingPool: 5
  },
  {
    month: 'November',
    year: 2024,
    totalPoints: 100,
    eligibleContests: 2,
    distributedPoints: 70,
    remainingPool: 30
  },
  {
    month: 'October',
    year: 2024,
    totalPoints: 100,
    eligibleContests: 5,
    distributedPoints: 100,
    remainingPool: 0
  }
]

const mockContestHistory: ContestWeightHistory[] = [
  {
    id: 1,
    name: 'CyberSec Challenge 2025',
    date: '2025-01-15',
    participants: 287,
    organizers: 'CyberSec Org',
    weightReceived: 35,
    difficulty: 85,
    eligible: true
  },
  {
    id: 2,
    name: 'BSidesSF 2024 CTF',
    date: '2024-05-18',
    participants: 342,
    organizers: 'BSides SF',
    weightReceived: 30,
    difficulty: 75,
    eligible: true
  },
  {
    id: 3,
    name: 'picoCTF 2024',
    date: '2024-03-12',
    participants: 8934,
    organizers: 'Carnegie Mellon University',
    weightReceived: 25,
    difficulty: 45,
    eligible: true
  },
  {
    id: 4,
    name: 'Small Local CTF',
    date: '2024-12-10',
    participants: 35,
    organizers: 'New Organizer',
    weightReceived: 0,
    difficulty: 60,
    eligible: false,
    reason: 'Less than 50 participants'
  },
  {
    id: 5,
    name: 'First Time CTF',
    date: '2024-11-20',
    participants: 120,
    organizers: 'Rookie Team',
    weightReceived: 0,
    difficulty: 70,
    eligible: false,
    reason: 'Organizer has no prior qualifying CTFs'
  }
]

const InfoCard = ({ 
  icon: Icon, 
  title, 
  description, 
  value, 
  color = 'text-primary' 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  value: string
  color?: string
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
      <h3 className="font-mono font-bold text-foreground">{title}</h3>
    </div>
    <div className={clsx("text-2xl font-bold mb-2 font-mono glow-text", color)}>
      {value}
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
)

const EligibilityCard = ({ 
  title, 
  items, 
  icon: Icon, 
  color 
}: {
  title: string
  items: string[]
  icon: React.ComponentType<{ className?: string }>
  color: string
}) => (
  <Card className="h-full hacker-border rounded-none bg-card/50 backdrop-blur-sm">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-3 font-mono">
        <Icon className={clsx("h-5 w-5", color)} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm">
            <CheckCircle className={clsx("h-4 w-4 mt-0.5 shrink-0", color)} />
            <span className="text-muted-foreground leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)

const ContestHistoryRow = ({ contest }: { contest: ContestWeightHistory }) => (
  <tr className={clsx(
    "border-b border-border/50 transition-colors hover:bg-muted/20",
    !contest.eligible && "opacity-60"
  )}>
    <td className="p-4">
      <div className="font-mono font-bold text-foreground">{contest.name}</div>
      <div className="text-xs text-muted-foreground">{contest.organizers}</div>
    </td>
    <td className="p-4 font-mono text-sm">
      {new Date(contest.date).toLocaleDateString()}
    </td>
    <td className="p-4 font-mono text-sm text-center">
      {contest.participants}
    </td>
    <td className="p-4 font-mono text-sm text-center">
      <div className={clsx(
        "font-bold",
        contest.difficulty >= 80 ? "text-red-400" :
        contest.difficulty >= 60 ? "text-yellow-400" :
        contest.difficulty >= 40 ? "text-blue-400" : "text-green-400"
      )}>
        {contest.difficulty}/100
      </div>
    </td>
    <td className="p-4 text-center">
      <div className="flex items-center justify-center gap-2">
        {contest.eligible ? (
          <CheckCircle className="h-4 w-4 text-green-400" />
        ) : (
          <AlertCircle className="h-4 w-4 text-red-400" />
        )}
        <span className={clsx(
          "text-xs",
          contest.eligible ? "text-green-400" : "text-red-400"
        )}>
          {contest.eligible ? "Yes" : "No"}
        </span>
      </div>
      {!contest.eligible && contest.reason && (
        <div className="text-xs text-muted-foreground mt-1">{contest.reason}</div>
      )}
    </td>
    <td className="p-4 font-mono text-center">
      <div className={clsx(
        "font-bold",
        contest.weightReceived > 0 ? "text-primary" : "text-muted-foreground"
      )}>
        {contest.weightReceived}
      </div>
    </td>
  </tr>
)

export default function WeightPoolPage() {
  const [selectedMonth, setSelectedMonth] = useState(mockMonthlyData[0])

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
                <span className="hacker-gradient-text glow-text">WEIGHT_POOL</span>
                <span className="animate-pulse text-primary">_</span>
              </h1>
              
              <div className="terminal glass-terminal p-6 max-w-4xl mx-auto text-left">
                <div className="text-primary mb-2">root@openctf:~# cat weight_pool_info.txt</div>
                <p className="text-green-400 leading-relaxed">
                  {"// Monthly distribution system for contest difficulty weighting"}<br/>
                  {"// 100 points distributed each month among qualifying CTFs"}<br/>
                  <span className="text-yellow-400">
                    {"// Current pool: 100 pts | This month distributed: 85 pts"}
                  </span>
                </p>
              </div>
            </motion.div>

            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
              <InfoCard
                icon={Shield}
                title="Monthly Pool"
                description="Total points available each month"
                value="100 pts"
                color="text-primary"
              />
              <InfoCard
                icon={Trophy}
                title="This Month"
                description="Points distributed so far"
                value="85 pts"
                color="text-green-400"
              />
              <InfoCard
                icon={Target}
                title="Eligible CTFs"
                description="Contests that qualified this month"
                value="3"
                color="text-blue-400"
              />
              <InfoCard
                icon={Calendar}
                title="Remaining"
                description="Points left in current pool"
                value="15 pts"
                color="text-yellow-400"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold font-mono text-center mb-4">
                &gt; HOW_WEIGHT_DISTRIBUTION_WORKS
              </h2>
              <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
                Understanding the monthly weight point allocation system for CTF contests
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Eligibility Requirements */}
              <EligibilityCard
                title="Eligibility Requirements"
                icon={CheckCircle}
                color="text-green-400"
                items={[
                  "Contest organizers must have organized at least one different CTF with at least 50 teams at least 6 months before",
                  "The contest must have at least 50 teams participating",
                  "Contest must be completed and results verified",
                  "Voting period must be completed by qualified participants"
                ]}
              />

              {/* Voting Process */}
              <EligibilityCard
                title="Difficulty Voting Process"
                icon={Users}
                color="text-blue-400"
                items={[
                  "Top 15 team captains OR top 5% of participants vote (whichever is smaller)",
                  "Difficulty rated from 0 (easiest) to 100 (hardest they've played in 2 years)",
                  "Guessy challenges are excluded (guessy = 0 points)",
                  "Votes are weighted by team performance and relevance"
                ]}
              />
            </div>

            {/* Distribution Formula */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <Card className="hacker-border rounded-none bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-mono">
                    <BarChart className="h-5 w-5 text-primary" />
                    Distribution Formula
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/5 p-6 rounded border border-primary/20 font-mono">
                    <div className="text-primary mb-4 text-lg font-bold">
                      Weight Points = (Difficulty Score / Total Difficulty) × Available Pool
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• Difficulty Score: Average of qualified voters' ratings (0-100)</div>
                      <div>• Total Difficulty: Sum of all eligible contests' difficulty scores</div>
                      <div>• Available Pool: 100 points per month</div>
                      <div>• Unused points roll over to next month's special distributions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Historical Data */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold font-mono mb-4">
                &gt; DISTRIBUTION_HISTORY
              </h2>
              <p className="text-muted-foreground mb-6">
                Track how weight points have been distributed over recent months
              </p>

              {/* Monthly Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {mockMonthlyData.map((month, index) => (
                  <motion.div
                    key={`${month.month}-${month.year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={clsx(
                      "p-4 rounded-none hacker-border cursor-pointer transition-all duration-300",
                      selectedMonth === month 
                        ? "bg-primary/20 border-primary" 
                        : "bg-card/30 hover:bg-card/50"
                    )}
                    onClick={() => setSelectedMonth(month)}
                  >
                    <div className="font-mono font-bold text-foreground mb-2">
                      {month.month} {month.year}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Distributed:</span>
                        <span className="text-primary font-mono">{month.distributedPoints}pts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Contests:</span>
                        <span className="font-mono">{month.eligibleContests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining:</span>
                        <span className="text-yellow-400 font-mono">{month.remainingPool}pts</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contest History Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold font-mono mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-primary" />
                &gt; RECENT_CONTESTS_WEIGHT_ALLOCATION
              </h3>

              <div className="bg-card/30 rounded-none hacker-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="border-b border-border">
                        <th className="p-4 text-left font-mono text-sm font-bold">Contest</th>
                        <th className="p-4 text-left font-mono text-sm font-bold">Date</th>
                        <th className="p-4 text-center font-mono text-sm font-bold">Teams</th>
                        <th className="p-4 text-center font-mono text-sm font-bold">Difficulty</th>
                        <th className="p-4 text-center font-mono text-sm font-bold">Eligible</th>
                        <th className="p-4 text-center font-mono text-sm font-bold">Weight Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockContestHistory.map((contest) => (
                        <ContestHistoryRow key={contest.id} contest={contest} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="text-sm">
                    <div className="font-mono font-bold text-primary mb-2">For Contest Organizers:</div>
                    <p className="text-muted-foreground leading-relaxed">
                      To be eligible for weight points, ensure your contest meets the participation requirements 
                      and that you have a proven track record of organizing quality CTFs. Weight points are 
                      distributed based on community-voted difficulty, encouraging fair and challenging contests 
                      while discouraging guessy or poorly designed challenges.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
