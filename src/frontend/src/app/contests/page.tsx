"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  Filter,
  Calendar,
  Trophy,
  Clock,
  Users,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Globe
} from "@/components/ui/icons";
import { 
  getContests, 
  Contest, 
  ContestFilters, 
  registerForContest, 
  unregisterFromContest,
  getUserRegistrations,
  getUpcomingContests,
  getLiveContests
} from "@/api/contests";
import { useAuthStore } from "@/store/authStore";
import { getCountryByCode, getCountryFlag, getPopularCountries } from "@/lib/countries";

const statusColors = {
  upcoming: 'text-blue-400 border-blue-400',
  'registration-open': 'text-green-400 border-green-400',
  'registration-closed': 'text-yellow-400 border-yellow-400',
  live: 'text-red-400 border-red-400 animate-pulse',
  finished: 'text-gray-400 border-gray-400',
  cancelled: 'text-red-400 border-red-400'
};

const statusIcons = {
  upcoming: Clock,
  'registration-open': UserPlus,
  'registration-closed': UserMinus,
  live: Play,
  finished: CheckCircle,
  cancelled: AlertCircle
};

const difficultyColors = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400', 
  advanced: 'text-orange-400',
  expert: 'text-red-400'
};

function ContestCard({ contest, isRegistered, onRegister, onUnregister, loading }: {
  contest: Contest;
  isRegistered: boolean;
  onRegister: (contestId: string) => void;
  onUnregister: (contestId: string) => void;
  loading: boolean;
}) {
  const { isAuthenticated } = useAuthStore();
  const StatusIcon = statusIcons[contest.status];
  
  const now = new Date();
  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);
  const regEndTime = new Date(contest.registrationEnd);
  
  const isLive = now >= startTime && now <= endTime;
  const canRegister = now <= regEndTime && contest.status === 'registration-open';
  const hasStarted = now >= startTime;
  
  const timeUntilStart = startTime.getTime() - now.getTime();
  const timeUntilEnd = endTime.getTime() - now.getTime();
  const timeUntilRegEnd = regEndTime.getTime() - now.getTime();
  
  const formatTimeLeft = (ms: number) => {
    if (ms <= 0) return 'Ended';
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
      
      <div className="relative bg-card/50 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden h-full hover:border-green-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20">
        {/* Banner */}
        {contest.bannerUrl && (
          <div className="h-24 relative overflow-hidden">
            <img 
              src={contest.bannerUrl} 
              alt={`${contest.name} banner`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            
            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <Badge 
                variant="outline" 
                className={`text-xs font-mono ${statusColors[contest.status]} bg-black/50 backdrop-blur`}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {contest.status.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
            
            {/* Live Indicator */}
            {isLive && (
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono text-red-400 bg-black/50 backdrop-blur px-2 py-1 rounded">
                  LIVE
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {contest.logoUrl && (
                  <img 
                    src={contest.logoUrl} 
                    alt={contest.name}
                    className="w-8 h-8 rounded border border-green-500/50"
                  />
                )}
                <h3 className="font-mono text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-1">
                  <Link href={`/contests/${contest.id}`}>
                    {contest.name}
                  </Link>
                </h3>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="flex items-center space-x-1 text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="font-mono">{contest.organizer}</span>
                </div>
                
                {contest.country && (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{getCountryFlag(contest.country)}</span>
                    <span className="text-xs font-mono text-gray-400">
                      {getCountryByCode(contest.country)?.name}
                    </span>
                  </div>
                )}
                
                <Badge 
                  variant="outline" 
                  className={`text-xs font-mono ${difficultyColors[contest.difficulty]} border-current`}
                >
                  {contest.difficulty.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-mono">
            {contest.description}
          </p>

          {/* Time Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-blue-400">
                <Calendar className="h-4 w-4" />
                <span className="font-mono">
                  {startTime.toLocaleDateString()} - {endTime.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Clock className="h-3 w-3" />
                <span className="font-mono text-xs">{contest.duration}h</span>
              </div>
            </div>
            
            {!hasStarted && (
              <div className="text-xs font-mono text-green-400">
                Starts in {formatTimeLeft(timeUntilStart)}
              </div>
            )}
            
            {isLive && (
              <div className="text-xs font-mono text-red-400">
                Ends in {formatTimeLeft(timeUntilEnd)}
              </div>
            )}
            
            {canRegister && timeUntilRegEnd > 0 && (
              <div className="text-xs font-mono text-yellow-400">
                Registration closes in {formatTimeLeft(timeUntilRegEnd)}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="text-lg font-bold font-mono text-blue-400">
                {contest.participantCount}
              </div>
              <div className="text-xs font-mono text-gray-400">Participants</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-purple-400">
                {contest.totalChallenges}
              </div>
              <div className="text-xs font-mono text-gray-400">Challenges</div>
            </div>
            <div>
              <div className="text-lg font-bold font-mono text-yellow-400">
                {contest.weight || 0}
              </div>
              <div className="text-xs font-mono text-gray-400">Weight</div>
            </div>
          </div>

          {/* Prizes */}
          {contest.prizes.length > 0 && contest.prizes[0].value && contest.prizes[0].value > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-mono text-yellow-400">PRIZES</span>
              </div>
              <div className="text-lg font-bold font-mono text-green-400">
                ${contest.prizes[0].value?.toLocaleString()} {contest.prizes[0].currency}
              </div>
              {contest.prizes.length > 1 && (
                <div className="text-xs font-mono text-gray-400">
                  + {contest.prizes.length - 1} more prizes
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {contest.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                #{tag}
              </Badge>
            ))}
            {contest.tags.length > 3 && (
              <Badge variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                +{contest.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-700">
            {!isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full font-mono border-gray-500 text-gray-400"
                disabled
              >
                LOGIN TO REGISTER
              </Button>
            ) : isRegistered ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-mono">REGISTERED</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUnregister(contest.id)}
                  disabled={loading || hasStarted}
                  className="w-full font-mono border-red-500/50 text-red-400 text-xs"
                >
                  <UserMinus className="h-3 w-3 mr-1" />
                  UNREGISTER
                </Button>
              </div>
            ) : canRegister ? (
              <Button
                size="sm"
                onClick={() => onRegister(contest.id)}
                disabled={loading}
                className="w-full font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full font-mono border-gray-500 text-gray-400"
                disabled
              >
                {contest.status === 'finished' ? 'FINISHED' : 
                 contest.status === 'live' ? 'IN PROGRESS' :
                 'REGISTRATION CLOSED'}
              </Button>
            )}
          </div>

          {/* External Links */}
          <div className="flex items-center space-x-2 mt-3 text-xs">
            {contest.website && (
              <a
                href={contest.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 font-mono"
              >
                <Globe className="h-3 w-3" />
                <span>WEBSITE</span>
              </a>
            )}
            {contest.ctftimeUrl && (
              <a
                href={contest.ctftimeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 font-mono"
              >
                <ExternalLink className="h-3 w-3" />
                <span>CTFTIME</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function GlowingHeader() {
  return (
    <div className="relative mb-12 text-center">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 blur-3xl animate-pulse" />
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-6xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-4">
            [CONTESTS]
          </h1>
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-mono">&gt; Battle arena initialized</span>
            <div className="w-2 h-6 bg-green-400 animate-pulse" />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 font-mono max-w-3xl mx-auto"
        >
          Compete in the world's most challenging cybersecurity competitions. Test your skills against elite hackers.
        </motion.p>
      </div>
    </div>
  );
}

export default function ContestsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [contests, setContests] = useState<Contest[]>([]);
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [liveContests, setLiveContests] = useState<Contest[]>([]);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);
  const [onlyWithPrizes, setOnlyWithPrizes] = useState(false);
  const [selectedSort, setSelectedSort] = useState("start-time");

  const loadContests = useCallback(async () => {
    setLoading(true);
    try {
      // Load main contests
      const currentFilters: ContestFilters = {
        ...(searchQuery && { search: searchQuery }),
        ...(selectedFormat && { format: selectedFormat }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedCountry && { country: selectedCountry }),
        ...(onlyFree && { freeEntry: onlyFree }),
        ...(onlyWithPrizes && { hasPrizes: onlyWithPrizes }),
        sortBy: selectedSort as any,
      };

      const response = await getContests(currentFilters, currentPage, 12);
      if (response.success && response.data) {
        setContests(response.data.contests);
        setTotalPages(response.data.totalPages);
      }

      // Load special sections
      const upcomingResponse = await getUpcomingContests(3);
      if (upcomingResponse.success && upcomingResponse.data) {
        setUpcomingContests(upcomingResponse.data);
      }

      const liveResponse = await getLiveContests();
      if (liveResponse.success && liveResponse.data) {
        setLiveContests(liveResponse.data);
      }

      // Load user registrations if authenticated
      if (isAuthenticated && user?.id) {
        const registrationsResponse = await getUserRegistrations(user.id.toString());
        if (registrationsResponse.success && registrationsResponse.data) {
          setUserRegistrations(registrationsResponse.data.map(reg => reg.contestId));
        }
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedFormat, selectedDifficulty, selectedStatus, selectedCountry, onlyFree, onlyWithPrizes, selectedSort, currentPage, isAuthenticated, user?.id]);

  useEffect(() => {
    loadContests();
  }, [loadContests]);

  const handleRegister = async (contestId: string) => {
    if (!isAuthenticated || !user?.id) return;
    
    setActionLoading(contestId);
    try {
      const response = await registerForContest(
        contestId,
        user.id.toString(),
        'individual', // Default to individual, would need team selection UI
        { contactEmail: user.email }
      );
      
      if (response.success) {
        setUserRegistrations(prev => [...prev, contestId]);
        // Refresh contest data to update participant count
        loadContests();
      }
    } catch (error) {
      console.error('Error registering for contest:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnregister = async (contestId: string) => {
    if (!isAuthenticated || !user?.id) return;
    
    setActionLoading(contestId);
    try {
      const response = await unregisterFromContest(contestId, user.id.toString());
      
      if (response.success) {
        setUserRegistrations(prev => prev.filter(id => id !== contestId));
        // Refresh contest data to update participant count
        loadContests();
      }
    } catch (error) {
      console.error('Error unregistering from contest:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedFormat("");
    setSelectedDifficulty("");
    setSelectedStatus("");
    setSelectedCountry("");
    setOnlyFree(false);
    setOnlyWithPrizes(false);
    setSelectedSort("start-time");
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          <GlowingHeader />

          {/* Live Contests */}
          {liveContests.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold font-mono text-red-400 mb-6 flex items-center">
                <Play className="h-6 w-6 mr-2 animate-pulse" />
                LIVE NOW
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {liveContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isRegistered={userRegistrations.includes(contest.id)}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    loading={actionLoading === contest.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Contests */}
          {upcomingContests.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold font-mono text-blue-400 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2" />
                UPCOMING
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {upcomingContests.map((contest) => (
                  <ContestCard
                    key={contest.id}
                    contest={contest}
                    isRegistered={userRegistrations.includes(contest.id)}
                    onRegister={handleRegister}
                    onUnregister={handleUnregister}
                    loading={actionLoading === contest.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search contests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  FILTERS
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/30 border border-green-500/30 rounded-lg p-6 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Format */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">FORMAT</label>
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Formats</option>
                        <option value="jeopardy">Jeopardy</option>
                        <option value="attack-defense">Attack-Defense</option>
                        <option value="king-of-the-hill">King of the Hill</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">DIFFICULTY</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">STATUS</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Status</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="registration-open">Registration Open</option>
                        <option value="live">Live</option>
                        <option value="finished">Finished</option>
                      </select>
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">COUNTRY</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Countries</option>
                        {getPopularCountries().map(country => {
                          return (
                            <option key={country.code} value={country.code}>
                              {country.flag} {country.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={onlyFree}
                          onChange={(e) => setOnlyFree(e.target.checked)}
                          className="rounded border-green-500/30 bg-gray-800 text-green-500 focus:ring-green-500"
                        />
                        <span className="font-mono text-sm text-gray-300">Free Entry Only</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={onlyWithPrizes}
                          onChange={(e) => setOnlyWithPrizes(e.target.checked)}
                          className="rounded border-green-500/30 bg-gray-800 text-green-500 focus:ring-green-500"
                        />
                        <span className="font-mono text-sm text-gray-300">With Prizes</span>
                      </label>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">SORT BY</label>
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="start-time">Start Time</option>
                        <option value="newest">Newest</option>
                        <option value="participants">Participants</option>
                        <option value="prizes">Prize Value</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="font-mono border-gray-500 text-gray-400 hover:bg-gray-700/50"
                    >
                      RESET FILTERS
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* All Contests */}
          {!loading && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold font-mono text-green-400">ALL CONTESTS</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AnimatePresence>
                  {contests.map((contest) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      isRegistered={userRegistrations.includes(contest.id)}
                      onRegister={handleRegister}
                      onUnregister={handleUnregister}
                      loading={actionLoading === contest.id}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* No Results */}
              {contests.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-mono text-gray-400 mb-2">No contests found</h3>
                  <p className="text-gray-500 font-mono">Try adjusting your search criteria</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="font-mono border-green-500/50 text-green-400 disabled:opacity-50"
                  >
                    PREV
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-mono text-sm transition-all ${
                            currentPage === pageNum
                              ? 'bg-green-500 text-black font-bold'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="font-mono border-green-500/50 text-green-400 disabled:opacity-50"
                  >
                    NEXT
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
