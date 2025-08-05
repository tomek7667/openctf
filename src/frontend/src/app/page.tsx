/**
 * OpenCTF Home Page
 * 
 * Professional landing page showcasing the platform's capabilities
 * with modern design, responsive layout, and compelling content.
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Users, 
  Trophy, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Globe,
  Target,
  BarChart
} from '@/components/ui/icons'

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
  gradient: string
}

const FeatureCard = ({ icon: Icon, title, description, href, gradient }: FeatureCardProps) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="group relative overflow-hidden"
  >
    <Link href={href}>
      <div className="relative p-8 h-full bg-card hacker-border rounded-none card-hover transition-all duration-300 group-hover:border-primary">
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradient}`} />
        
        <div className="relative z-10">
          <div className="mb-4">
            <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors duration-300">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 font-mono">
            &gt; {title.toUpperCase().replace(' ', '_')}
          </h3>
          
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center text-primary font-bold group-hover:translate-x-1 transition-transform duration-300 font-mono">
            <span>[EXPLORE]</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
)

const StatCard = ({ 
  value, 
  label, 
  trend,
  icon: Icon 
}: { 
  value: string
  label: string
  trend?: string
  icon: React.ComponentType<{ className?: string }>
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-none hacker-border"
  >
    <div className="flex justify-center mb-3">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <div className="text-3xl font-bold text-primary mb-1 font-mono glow-text">{value}</div>
    <div className="text-sm text-muted-foreground mb-2 font-mono uppercase">{label}</div>
    {trend && (
      <div className="flex items-center justify-center text-xs text-green-600">
        <TrendingUp className="h-3 w-3 mr-1" />
        {trend}
      </div>
    )}
  </motion.div>
)

export default function HomePage() {
  const features = [
    {
      icon: Shield,
      title: 'Team Management',
      description: 'Create and manage CTF teams with comprehensive ranking systems, member management, and verification processes.',
      href: '/teams',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Player Rankings',
      description: 'Track individual achievements and skill development across categories with detailed performance analytics.',
      href: '/users',
      gradient: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      icon: Trophy,
      title: 'Competitions',
      description: 'Organize and participate in Capture The Flag competitions with real-time leaderboards and scoring.',
      href: '/contests',
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    },
    {
      icon: MessageSquare,
      title: 'Community Forum',
      description: 'Connect with the CTF community, share strategies, discuss events, and collaborate on solutions.',
      href: '/forum',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        {/* Hacker Background Effects */}
        <div className="absolute inset-0 matrix-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-mono">
              <span className="terminal-prompt">$ </span>
              <span className="hacker-gradient-text glow-text">
                OpenCTF
              </span>
              <br />
              <span className="text-foreground">&gt; Platform</span>
              <span className="animate-pulse text-primary">_</span>
            </h1>
            
            <div className="terminal glass-terminal p-6 mb-12 max-w-4xl mx-auto text-left">
              <div className="text-primary mb-2">root@openctf:~# cat mission.txt</div>
              <p className="text-green-400 leading-relaxed">
                // The professional platform for Capture The Flag competitions.<br/>
                // Connect teams, organize contests, and build the cybersecurity community.<br/>
                <span className="text-yellow-400">// Status: ACTIVE | Users: CONNECTING | Security: ENHANCED</span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/teams"
                  className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
                >
                  &gt; EXPLORE_TEAMS
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contests"
                  className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
                >
                  &gt; VIEW_CONTESTS
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30 matrix-bg">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
              &gt; TRUSTED_BY_THE_CTF_COMMUNITY
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of security enthusiasts and teams already competing on our platform.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={Shield}
              value="500+"
              label="Active Teams"
              trend="+12% this month"
            />
            <StatCard
              icon={Users}
              value="2.1K+"
              label="Registered Users"
              trend="+18% this month"
            />
            <StatCard
              icon={Trophy}
              value="150+"
              label="Competitions"
              trend="+8% this month"
            />
            <StatCard
              icon={Globe}
              value="40+"
              label="Countries"
              trend="+5% this month"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
              &gt; EVERYTHING_YOU_NEED_FOR_CTF_SUCCESS
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and features needed to excel in 
              Capture The Flag competitions, from individual skill tracking to team management.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-green-400/10 to-primary/10 matrix-bg">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono">
              &gt; READY_TO_LEVEL_UP_YOUR_CTF_GAME?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the OpenCTF community today and start competing, learning, and growing 
              your cybersecurity skills with teams from around the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/teams"
                  className="btn-gradient inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  [JOIN_TEAM]
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contests"
                  className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  [BROWSE_CONTESTS]
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
