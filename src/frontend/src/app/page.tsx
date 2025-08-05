'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Shield, Users, Trophy, MessageSquare, ArrowRight } from '@/components/icons'

const features = [
  {
    icon: Shield,
    title: 'Team Management',
    description: 'Create and manage CTF teams with comprehensive ranking systems and verification.',
    href: '/teams',
  },
  {
    icon: Users,
    title: 'User Profiles',
    description: 'Track individual achievements and skill development across categories.',
    href: '/users',
  },
  {
    icon: Trophy,
    title: 'Competitions',
    description: 'Organize and participate in Capture The Flag competitions.',
    href: '/contests',
  },
  {
    icon: MessageSquare,
    title: 'Community Forum',
    description: 'Discuss strategies, share knowledge, and connect with the CTF community.',
    href: '/forum',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          Welcome to <span className="text-primary">OpenCTF</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The comprehensive platform for Capture The Flag competitions. 
          Track teams, manage competitions, and build the cybersecurity community.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/teams">
              Explore Teams
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contests">View Competitions</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <Button variant="outline" size="sm" asChild className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Link href={feature.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Platform Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-muted-foreground">Active Teams</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">1.2K+</div>
            <div className="text-muted-foreground">Registered Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">150+</div>
            <div className="text-muted-foreground">Competitions</div>
          </div>
        </div>
      </section>
    </div>
  )
}
