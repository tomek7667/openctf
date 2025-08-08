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
  Star,
  Eye,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Plus,
  UserPlus,
  Shield,
  Crown,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Award,
  Globe,
  Lock,
  EyeOff,
  Send,
  ExternalLink
} from "@/components/ui/icons";
import { getTeams, Team, TeamFilters, getUserTeams, applyToTeam } from "@/api/teams";
import { useAuthStore } from "@/store/authStore";
import { getCountryByCode, getCountryFlag, getPopularCountries } from "@/lib/countries";

const privacyIcons = {
  public: Globe,
  'invite-only': Lock,
  private: EyeOff
};

const privacyColors = {
  public: 'text-green-400',
  'invite-only': 'text-yellow-400',
  private: 'text-red-400'
};

function TeamCard({ team, onApply }: { team: Team; onApply: (teamId: string) => void }) {
  const { user, isAuthenticated } = useAuthStore();
  const PrivacyIcon = privacyIcons[team.privacy];
  const isUserMember = team.members.some(member => member.userId === user?.id?.toString());
  const isCaptain = team.captainId === user?.id?.toString();
  
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
        {team.bannerUrl && (
          <div className="h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 relative overflow-hidden">
            <img 
              src={team.bannerUrl} 
              alt={`${team.name} banner`}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {team.logoUrl ? (
                <img 
                  src={team.logoUrl} 
                  alt={team.name}
                  className="w-12 h-12 rounded-lg border border-green-500/50"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-lg font-bold font-mono text-black">
                  {team.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="font-mono text-lg font-bold text-white group-hover:text-green-400 transition-colors">
                  <Link href={`/teams/${team.id}`}>
                    {team.name}
                  </Link>
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <PrivacyIcon className={`h-4 w-4 ${privacyColors[team.privacy]}`} />
                  <span className={`text-xs font-mono ${privacyColors[team.privacy]}`}>
                    {team.privacy.replace('-', ' ').toUpperCase()}
                  </span>
                  {team.country && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{getCountryFlag(team.country)}</span>
                      <span className="text-xs font-mono text-gray-400">
                        {getCountryByCode(team.country)?.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-1">
              {team.recruitment.isRecruiting && (
                <Badge variant="outline" className="text-xs font-mono text-green-400 border-green-400">
                  RECRUITING
                </Badge>
              )}
              {team.status === 'active' && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 font-mono">
            {team.description}
          </p>

          {/* Members Preview */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="font-mono text-blue-400 text-sm">
                {team.memberCount}/{team.maxMembers} members
              </span>
            </div>
            
            <div className="flex -space-x-2">
              {team.members.slice(0, 3).map((member, index) => (
                <div 
                  key={member.id}
                  className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-bold font-mono text-black relative"
                  style={{ zIndex: 10 - index }}
                >
                  {member.username.slice(0, 2).toUpperCase()}
                  {member.role === 'captain' && (
                    <Crown className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 bg-gray-900 rounded-full p-0.5" />
                  )}
                </div>
              ))}
              {team.memberCount > 3 && (
                <div className="w-8 h-8 bg-gray-700 rounded-full border-2 border-gray-900 flex items-center justify-center text-xs font-mono text-gray-300">
                  +{team.memberCount - 3}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="font-mono">{team.statistics.currentRating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-green-400" />
                <span className="font-mono">{team.statistics.contestsWon}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4 text-purple-400" />
                <span className="font-mono">{team.statistics.contestsParticipated}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-xs">
              <Clock className="h-3 w-3" />
              <span className="font-mono">
                {new Date(team.lastActive).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Skills */}
          {team.recruitment.isRecruiting && team.recruitment.requiredSkills.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-mono text-green-400 mb-2">LOOKING FOR:</div>
              <div className="flex flex-wrap gap-1">
                {team.recruitment.requiredSkills.slice(0, 3).map((skill) => (
                  <Badge key={skill} variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                    {skill}
                  </Badge>
                ))}
                {team.recruitment.requiredSkills.length > 3 && (
                  <Badge variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                    +{team.recruitment.requiredSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-700">
            {!isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full font-mono border-gray-500 text-gray-400"
                disabled
              >
                LOGIN TO APPLY
              </Button>
            ) : isUserMember ? (
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-mono text-sm">
                  {isCaptain ? 'TEAM CAPTAIN' : 'MEMBER'}
                </span>
              </div>
            ) : team.recruitment.isRecruiting && team.settings.allowApplications ? (
              <Button
                size="sm"
                onClick={() => onApply(team.id)}
                className="w-full font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                APPLY TO JOIN
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full font-mono border-gray-500 text-gray-400"
                disabled
              >
                {team.privacy === 'private' ? 'PRIVATE TEAM' : 'NOT RECRUITING'}
              </Button>
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
            [TEAMS]
          </h1>
          <div className="flex items-center justify-center space-x-2 text-green-400">
            <Users className="h-6 w-6" />
            <span className="text-xl font-mono">&gt; Elite cyber squads assembled</span>
            <div className="w-2 h-6 bg-green-400 animate-pulse" />
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-300 font-mono max-w-3xl mx-auto"
        >
          Join the world's most skilled cybersecurity teams. Compete in CTFs, share knowledge, and advance your career.
        </motion.p>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [filters, setFilters] = useState<TeamFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [isRecruiting, setIsRecruiting] = useState<boolean | undefined>(undefined);
  const [minMembers, setMinMembers] = useState("");
  const [maxMembers, setMaxMembers] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      const currentFilters: TeamFilters = {
        search: searchQuery || undefined,
        country: selectedCountry || undefined,
        minRating: minRating ? parseInt(minRating) : undefined,
        maxRating: maxRating ? parseInt(maxRating) : undefined,
        isRecruiting: isRecruiting,
        memberCount: {
          min: minMembers ? parseInt(minMembers) : undefined,
          max: maxMembers ? parseInt(maxMembers) : undefined,
        },
        sortBy: selectedSort as any,
      };

      const response = await getTeams(currentFilters, currentPage, 12);
      if (response.success && response.data) {
        setTeams(response.data.teams);
        setTotalPages(response.data.totalPages);
      }

      // Load user's teams if authenticated
      if (isAuthenticated && user?.id) {
        const userTeamsResponse = await getUserTeams(user.id.toString());
        if (userTeamsResponse.success && userTeamsResponse.data) {
          setUserTeams(userTeamsResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCountry, minRating, maxRating, isRecruiting, minMembers, maxMembers, selectedSort, currentPage, isAuthenticated, user?.id]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleApply = async (teamId: string) => {
    if (!isAuthenticated || !user?.id) return;
    
    setApplying(teamId);
    try {
      const response = await applyToTeam(
        teamId,
        "I'm interested in joining your team and contributing to your success in CTF competitions.",
        ["Web Security", "Python"], // Mock skills
        user.id.toString()
      );
      
      if (response.success) {
        // Show success message or update UI
        console.log('Application submitted successfully');
      }
    } catch (error) {
      console.error('Error applying to team:', error);
    } finally {
      setApplying(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCountry("");
    setMinRating("");
    setMaxRating("");
    setIsRecruiting(undefined);
    setMinMembers("");
    setMaxMembers("");
    setSelectedSort("newest");
    setCurrentPage(1);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="container mx-auto px-4 py-8">
          <GlowingHeader />

          {/* User's Teams */}
          {isAuthenticated && userTeams.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold font-mono text-green-400 mb-6">YOUR TEAMS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {userTeams.map((team) => (
                  <TeamCard key={team.id} team={team} onApply={handleApply} />
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
                    placeholder="Search teams..."
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
                
                {isAuthenticated && (
                  <Link href="/teams/create">
                    <Button className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold">
                      <Plus className="h-4 w-4 mr-2" />
                      CREATE TEAM
                    </Button>
                  </Link>
                )}
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
                    {/* Country */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">COUNTRY</label>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Countries</option>
                        {getPopularCountries().map(code => {
                          const country = getCountryByCode(code);
                          return (
                            <option key={code} value={code}>
                              {getCountryFlag(code)} {country?.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {/* Rating Range */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">MIN RATING</label>
                      <Input
                        type="number"
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        placeholder="1000"
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">MAX RATING</label>
                      <Input
                        type="number"
                        value={maxRating}
                        onChange={(e) => setMaxRating(e.target.value)}
                        placeholder="3000"
                        className="font-mono bg-gray-800/50 border-green-500/30 text-white text-sm"
                      />
                    </div>

                    {/* Member Count */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">MEMBERS</label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          value={minMembers}
                          onChange={(e) => setMinMembers(e.target.value)}
                          placeholder="Min"
                          className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white text-sm"
                        />
                        <Input
                          type="number"
                          value={maxMembers}
                          onChange={(e) => setMaxMembers(e.target.value)}
                          placeholder="Max"
                          className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white text-sm"
                        />
                      </div>
                    </div>

                    {/* Recruiting Status */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">STATUS</label>
                      <select
                        value={isRecruiting === undefined ? "" : isRecruiting.toString()}
                        onChange={(e) => setIsRecruiting(e.target.value === "" ? undefined : e.target.value === "true")}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="">All Teams</option>
                        <option value="true">Recruiting</option>
                        <option value="false">Not Recruiting</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">SORT BY</label>
                      <select
                        value={selectedSort}
                        onChange={(e) => setSelectedSort(e.target.value)}
                        className="w-full bg-gray-800/50 border border-green-500/30 rounded-lg px-3 py-2 font-mono text-white text-sm"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="rating">Rating</option>
                        <option value="members">Members</option>
                        <option value="activity">Activity</option>
                        <option value="contests">Contests</option>
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

          {/* Teams Grid */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AnimatePresence>
                  {teams.map((team) => (
                    <TeamCard key={team.id} team={team} onApply={handleApply} />
                  ))}
                </AnimatePresence>
              </div>

              {/* No Results */}
              {teams.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-mono text-gray-400 mb-2">No teams found</h3>
                  <p className="text-gray-500 font-mono mb-4">Try adjusting your search criteria or create a new team</p>
                  {isAuthenticated && (
                    <Link href="/teams/create">
                      <Button className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold">
                        CREATE YOUR TEAM
                      </Button>
                    </Link>
                  )}
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
