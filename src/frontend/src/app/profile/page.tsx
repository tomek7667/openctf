"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  User,
  Edit,
  MapPin,
  Calendar,
  Star,
  Trophy,
  BookOpen,
  Users,
  Shield,
  Github,
  Linkedin,
  Globe,
  Mail,
  Eye,
  EyeOff,
  Settings,
  Award,
  TrendingUp,
  BarChart
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { getUserWriteups, WriteupListResponse } from "@/api/writeups";

// Mock user profile data - in real app this would come from API
const mockUserProfile = {
  id: "1",
  username: "CyberNinja",
  email: "cyberninja@example.com",
  bio: "Passionate cybersecurity researcher specializing in web application security and cryptography. CTF enthusiast with 5+ years of experience.",
  location: "San Francisco, CA",
  joinedDate: "2019-03-15",
  socialLinks: {
    github: "https://github.com/cyberninja",
    linkedin: "https://linkedin.com/in/cyberninja",
    twitter: "https://twitter.com/cyberninja",
    website: "https://cyberninja.dev"
  },
  skills: ["Web Security", "Cryptography", "Reverse Engineering", "Python", "JavaScript", "Binary Exploitation"],
  statistics: {
    contestsParticipated: 42,
    writeupsAuthored: 28,
    currentRating: 1847,
    maxRating: 1923,
    totalViews: 15420,
    totalLikes: 892
  },
  achievements: [
    { id: "first-writeup", name: "First Writeup", description: "Published your first writeup", rarity: "common", unlockedAt: "2019-04-01" },
    { id: "prolific-writer", name: "Prolific Writer", description: "Authored 25+ writeups", rarity: "rare", unlockedAt: "2023-08-15" },
    { id: "crypto-master", name: "Crypto Master", description: "Solved 50+ cryptography challenges", rarity: "epic", unlockedAt: "2023-12-01" },
    { id: "community-favorite", name: "Community Favorite", description: "Received 500+ likes on writeups", rarity: "legendary", unlockedAt: "2024-01-20" }
  ],
  preferences: {
    profileVisibility: "public" as const,
    emailNotifications: true,
    showLocation: true,
    showEmail: false
  },
  recentActivity: [
    { type: "writeup", title: "Breaking RSA with Small Exponent", date: "2024-01-15", likes: 284 },
    { type: "contest", title: "picoCTF 2024", place: 12, date: "2024-01-10" },
    { type: "writeup", title: "SQL Injection to RCE", date: "2024-01-05", likes: 198 }
  ]
};

const rarityColors = {
  common: "text-gray-400 border-gray-400",
  rare: "text-blue-400 border-blue-400",
  epic: "text-purple-400 border-purple-400",
  legendary: "text-yellow-400 border-yellow-400"
};

function SkillRadar({ skills }: { skills: string[] }) {
  const maxSkills = 6;
  const displaySkills = skills.slice(0, maxSkills);
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Radar background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
        {/* Concentric circles */}
        {[20, 40, 60, 80].map((radius) => (
          <circle
            key={radius}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgb(34, 197, 94, 0.2)"
            strokeWidth="1"
          />
        ))}
        
        {/* Radar lines */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i * 60) - 90; // Start from top
          const radians = (angle * Math.PI) / 180;
          const x = 100 + 80 * Math.cos(radians);
          const y = 100 + 80 * Math.sin(radians);
          
          return (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={x}
              y2={y}
              stroke="rgb(34, 197, 94, 0.2)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Skill points */}
        <polygon
          points={displaySkills.map((_, i) => {
            const angle = (i * 60) - 90;
            const radians = (angle * Math.PI) / 180;
            const level = Math.random() * 60 + 20; // Mock skill level
            const x = 100 + level * Math.cos(radians);
            const y = 100 + level * Math.sin(radians);
            return `${x},${y}`;
          }).join(' ')}
          fill="rgba(34, 197, 94, 0.2)"
          stroke="rgb(34, 197, 94)"
          strokeWidth="2"
        />
      </svg>
      
      {/* Skill labels */}
      {displaySkills.map((skill, i) => {
        const angle = (i * 60) - 90;
        const radians = (angle * Math.PI) / 180;
        const x = 100 + 95 * Math.cos(radians);
        const y = 100 + 95 * Math.sin(radians);
        
        return (
          <div
            key={skill}
            className="absolute text-xs font-mono text-green-400 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(x / 200) * 100}%`,
              top: `${(y / 200) * 100}%`,
            }}
          >
            {skill}
          </div>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [userWriteups, setUserWriteups] = useState<WriteupListResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "writeups" | "achievements" | "activity">("overview");
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const loadUserData = async () => {
      try {
        // Load user's writeups
        const writeupsResponse = await getUserWriteups(user?.id?.toString() || "1", 1, 6);
        if (writeupsResponse.success) {
          setUserWriteups(writeupsResponse.data);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, user?.id, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  const profile = mockUserProfile; // In real app, this would come from API

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-8">
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Avatar and Basic Info */}
                <div className="flex flex-col items-center text-center lg:text-left">
                  <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold font-mono text-black mb-4">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </div>
                  <h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2">
                    {profile.username}
                  </h1>
                  <div className="flex items-center space-x-2 text-gray-400 font-mono text-sm mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                  </div>
                  {profile.location && profile.preferences.showLocation && (
                    <div className="flex items-center space-x-2 text-gray-400 font-mono text-sm mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Eye className={`h-4 w-4 ${profile.preferences.profileVisibility === 'public' ? 'text-green-400' : 'text-red-400'}`} />
                        <span className={`font-mono text-sm ${profile.preferences.profileVisibility === 'public' ? 'text-green-400' : 'text-red-400'}`}>
                          {profile.preferences.profileVisibility.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => router.push('/profile/edit')}
                      className="font-mono bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      EDIT PROFILE
                    </Button>
                  </div>

                  <p className="text-gray-300 font-mono text-sm leading-relaxed mb-6">
                    {profile.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {profile.socialLinks.github && (
                      <a
                        href={profile.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Github className="h-4 w-4 text-gray-300" />
                        <span className="font-mono text-sm text-gray-300">GitHub</span>
                      </a>
                    )}
                    {profile.socialLinks.linkedin && (
                      <a
                        href={profile.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Linkedin className="h-4 w-4 text-blue-400" />
                        <span className="font-mono text-sm text-gray-300">LinkedIn</span>
                      </a>
                    )}
                    {profile.socialLinks.website && (
                      <a
                        href={profile.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                      >
                        <Globe className="h-4 w-4 text-green-400" />
                        <span className="font-mono text-sm text-gray-300">Website</span>
                      </a>
                    )}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-mono text-green-400 font-bold mb-3">SKILLS</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="font-mono text-gray-300 border-gray-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-6 min-w-[280px]">
                  <h3 className="font-mono text-green-400 font-bold mb-4 flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    STATISTICS
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Current Rating</span>
                      <span className="font-mono text-green-400 font-bold">{profile.statistics.currentRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Max Rating</span>
                      <span className="font-mono text-yellow-400 font-bold">{profile.statistics.maxRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Contests</span>
                      <span className="font-mono text-blue-400 font-bold">{profile.statistics.contestsParticipated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Writeups</span>
                      <span className="font-mono text-purple-400 font-bold">{profile.statistics.writeupsAuthored}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Total Views</span>
                      <span className="font-mono text-gray-300">{profile.statistics.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Total Likes</span>
                      <span className="font-mono text-red-400">{profile.statistics.totalLikes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-gray-800/30 border border-green-500/30 rounded-lg p-1">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "writeups", label: "Writeups", icon: BookOpen },
                { id: "achievements", label: "Achievements", icon: Award },
                { id: "activity", label: "Activity", icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-mono text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Radar */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-6 text-center">SKILL RADAR</h3>
                  <SkillRadar skills={profile.skills} />
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-6">RECENT ACTIVITY</h3>
                  <div className="space-y-4">
                    {profile.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-900/50 rounded-lg">
                        {activity.type === 'writeup' ? (
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        ) : (
                          <Trophy className="h-5 w-5 text-yellow-400" />
                        )}
                        <div className="flex-1">
                          <div className="font-mono text-white text-sm">{activity.title}</div>
                          <div className="font-mono text-gray-400 text-xs">
                            {new Date(activity.date).toLocaleDateString()}
                            {activity.type === 'writeup' && ` • ${activity.likes} likes`}
                            {activity.type === 'contest' && ` • ${activity.place} place`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "writeups" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-mono text-green-400 font-bold">MY WRITEUPS</h3>
                  <Button
                    onClick={() => router.push('/writeups/create')}
                    className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    NEW WRITEUP
                  </Button>
                </div>
                
                {userWriteups && userWriteups.writeups.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {userWriteups.writeups.map((writeup) => (
                      <div
                        key={writeup.id}
                        className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-green-500/30 transition-colors cursor-pointer"
                        onClick={() => router.push(`/writeups/${writeup.id}`)}
                      >
                        <h4 className="font-mono text-white font-bold mb-2 line-clamp-2">{writeup.title}</h4>
                        <p className="text-gray-400 font-mono text-sm mb-3 line-clamp-2">{writeup.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline" className="font-mono text-gray-400 border-gray-600">
                            {writeup.category.toUpperCase()}
                          </Badge>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <Eye className="h-4 w-4" />
                            <span className="font-mono">{writeup.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="font-mono text-gray-400 text-lg mb-2">No writeups yet</h4>
                    <p className="text-gray-500 font-mono mb-4">Share your knowledge with the community!</p>
                    <Button
                      onClick={() => router.push('/writeups/create')}
                      className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                    >
                      CREATE YOUR FIRST WRITEUP
                    </Button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-6">ACHIEVEMENTS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`bg-gray-900/50 border rounded-lg p-6 text-center ${rarityColors[achievement.rarity]}`}
                    >
                      <Award className="h-12 w-12 mx-auto mb-4" />
                      <h4 className="font-mono font-bold mb-2">{achievement.name}</h4>
                      <p className="font-mono text-sm text-gray-400 mb-3">{achievement.description}</p>
                      <div className="font-mono text-xs text-gray-500">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-6">ACTIVITY TIMELINE</h3>
                <div className="space-y-6">
                  {profile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {activity.type === 'writeup' ? (
                            <BookOpen className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Trophy className="h-4 w-4 text-yellow-400" />
                          )}
                          <span className="font-mono text-white font-bold">{activity.title}</span>
                        </div>
                        <div className="font-mono text-gray-400 text-sm">
                          {activity.type === 'writeup' ? 'Published writeup' : `Participated in contest • ${activity.place} place`}
                        </div>
                        <div className="font-mono text-gray-500 text-xs mt-1">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
