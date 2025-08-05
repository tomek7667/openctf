'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, Flag, Star } from '@/components/ui/icons'
import { leaderboardApi, LeaderboardTeam } from '@/api/leaderboard'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/utils'

interface TeamData {
  place: number
  name: string
  country: string
  totalPoints: number
  contestsWon: number
  monthlyPoints: number
  isVerified: boolean
  members: number
}

const getPlaceIcon = (place: number) => {
  switch (place) {
    case 1: return <Trophy className="h-6 w-6 text-yellow-400" />
    case 2: return (
      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-sm">2</div>
    )
    case 3: return (
      <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold text-sm">3</div>
    )
    default: return <span className="text-primary font-bold text-lg">#{place}</span>
  }
}

const getPlaceStyle = (place: number) => {
  switch (place) {
    case 1: 
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50 shadow-lg shadow-yellow-400/20"
    case 2:
      return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50 shadow-lg shadow-gray-400/20"
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50 shadow-lg shadow-amber-600/20"
    default:
      return "bg-card/50 border-primary/20 hover:border-primary/40"
  }
}

const getPodiumHeight = (place: number) => {
  switch (place) {
    case 1: return "h-32"
    case 2: return "h-24" 
    case 3: return "h-20"
    default: return ""
  }
}

const TopThreePodium = ({ teams }: { teams: TeamData[] }) => {
  const topThree = teams.slice(0, 3)
  
  return (
    <div className="flex items-end justify-center gap-4 mb-8">
      {/* 2nd Place */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <div className={`${getPodiumHeight(2)} w-24 bg-gradient-to-t from-gray-500/30 to-gray-400/20 border-t-4 border-gray-400 rounded-t-lg relative terminal mb-2`}>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold glow-text">2</div>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-300 font-bold text-xl">2</div>
        </div>
        <div className="font-mono text-sm text-gray-300 font-bold">{topThree[1]?.name}</div>
        <div className="text-xs text-primary">{topThree[1]?.totalPoints.toFixed(1)} pts</div>
      </motion.div>

      {/* 1st Place */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center"
      >
        <div className={`${getPodiumHeight(1)} w-32 bg-gradient-to-t from-yellow-600/30 to-yellow-400/20 border-t-4 border-yellow-400 rounded-t-lg relative terminal mb-2`}>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            <Trophy className="h-12 w-12 text-yellow-400 glow-text animate-pulse" />
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold text-2xl glow-text">1</div>
        </div>
        <div className="font-mono text-sm text-yellow-400 font-bold glow-text">{topThree[0]?.name}</div>
        <div className="text-xs text-primary">{topThree[0]?.totalPoints.toFixed(1)} pts</div>
      </motion.div>

      {/* 3rd Place */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className={`${getPodiumHeight(3)} w-20 bg-gradient-to-t from-amber-700/30 to-amber-600/20 border-t-4 border-amber-600 rounded-t-lg relative terminal mb-2`}>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold glow-text">3</div>
          </div>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-amber-600 font-bold text-xl">3</div>
        </div>
        <div className="font-mono text-sm text-amber-600 font-bold">{topThree[2]?.name}</div>
        <div className="text-xs text-primary">{topThree[2]?.totalPoints.toFixed(1)} pts</div>
      </motion.div>
    </div>
  )
}

const TeamRow = ({ team, index }: { team: TeamData, index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.1 }}
    className={`p-4 mb-2 rounded-none border transition-all duration-300 hover:scale-[1.02] font-mono ${getPlaceStyle(team.place)}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10">
          {getPlaceIcon(team.place)}
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg text-foreground">{team.name}</span>
            {team.isVerified && <Star className="h-4 w-4 text-primary" />}
            <span className="text-xs text-muted-foreground font-mono">
              [{team.country}]
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{team.members} members</span>
            </span>
            <span className="flex items-center space-x-1">
              <Flag className="h-3 w-3" />
              <span>{team.contestsWon} wins</span>
            </span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <div className="text-2xl font-bold text-primary glow-text">
          {team.totalPoints.toFixed(1)}
        </div>
        <div className="text-xs text-muted-foreground">
          +{team.monthlyPoints.toFixed(1)} this month
        </div>
      </div>
    </div>
  </motion.div>
)

export function TeamLeaderboard() {
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="terminal-prompt">$ </span>
            <span className="hacker-gradient-text glow-text">TOP_TEAMS</span>
          </h2>
          <div className="terminal glass-terminal p-4 max-w-2xl mx-auto text-left">
            <div className="text-primary mb-2">root@openctf:~# cat leaderboard.txt</div>
            <p className="text-green-400">
              // Monthly rankings for {currentMonth}<br/>
              // Based on OpenCTF point system and contest performance<br/>
              <span className="text-yellow-400">// Updated: $(date) | Weight pool: 100.0 pts</span>
            </p>
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <TopThreePodium teams={mockTeamData} />

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold font-mono text-primary mb-2">
              &gt; FULL_RANKINGS
            </h3>
            <div className="h-px bg-primary/30 mb-4"></div>
          </div>
          
          {mockTeamData.map((team, index) => (
            <TeamRow key={team.name} team={team} index={index} />
          ))}
          
          <div className="text-center mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button className="btn-terminal px-6 py-3 font-mono font-bold">
                &gt; VIEW_FULL_RANKINGS
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
