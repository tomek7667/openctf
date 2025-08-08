"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  ArrowLeft,
  Users,
  Settings,
  Mail,
  UserPlus,
  UserMinus,
  Shield,
  Crown,
  Check,
  X,
  Clock,
  Eye,
  Trash2,
  Edit,
  Send,
  AlertTriangle,
  Star,
  Trophy,
  Calendar,
  Target
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { 
  getTeam, 
  getTeamApplications, 
  inviteToTeam, 
  Team, 
  TeamApplication, 
  TeamMember 
} from "@/api/teams";

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingApplications: number;
  avgRating: number;
  recentActivity: Array<{
    type: 'join' | 'leave' | 'promotion' | 'contest';
    member: string;
    date: string;
    details?: string;
  }>;
}

export default function ManageTeamPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "applications" | "settings">("overview");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/teams');
      return;
    }

    const loadTeamData = async () => {
      try {
        const teamResponse = await getTeam(params.id as string);
        if (teamResponse.success && teamResponse.data) {
          const teamData = teamResponse.data;
          
          // Check if user is team captain
          if (teamData.captainId !== user?.id?.toString()) {
            router.push(`/teams/${params.id}`);
            return;
          }
          
          setTeam(teamData);

          // Load applications
          const appsResponse = await getTeamApplications(teamData.id, user.id.toString());
          if (appsResponse.success && appsResponse.data) {
            setApplications(appsResponse.data);
          }
        } else {
          router.push('/teams');
        }
      } catch (error) {
        console.error('Error loading team data:', error);
        router.push('/teams');
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [params.id, isAuthenticated, user?.id, router]);

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !team) return;
    
    setActionLoading('invite');
    try {
      const response = await inviteToTeam(
        team.id, 
        inviteEmail, 
        inviteMessage || undefined, 
        user?.id?.toString()
      );
      if (response.success) {
        setInviteEmail("");
        setInviteMessage("");
        setShowInviteModal(false);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplicationResponse = async (applicationId: string, action: 'accept' | 'reject') => {
    setActionLoading(applicationId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected', reviewedAt: new Date().toISOString() }
          : app
      ));
      
      if (action === 'accept' && team) {
        // Add member to team (mock)
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          setTeam(prev => prev ? {
            ...prev,
            members: [...prev.members, {
              id: `member-${Date.now()}`,
              userId: application.userId,
              username: application.username,
              email: application.email,
              role: 'member',
              joinedAt: new Date().toISOString(),
              skills: application.skills,
              isActive: true
            }],
            memberCount: prev.memberCount + 1
          } : null);
        }
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!team) return;
    
    setActionLoading(memberId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeam(prev => prev ? {
        ...prev,
        members: prev.members.filter(m => m.id !== memberId),
        memberCount: prev.memberCount - 1
      } : null);
      
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error removing member:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handlePromoteMember = async (memberId: string, newRole: 'captain' | 'member') => {
    if (!team) return;
    
    setActionLoading(memberId);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTeam(prev => prev ? {
        ...prev,
        members: prev.members.map(m => 
          m.id === memberId ? { ...m, role: newRole } : m
        )
      } : null);
    } catch (error) {
      console.error('Error promoting member:', error);
    } finally {
      setActionLoading(null);
    }
  };

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

  if (!team) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-mono text-red-400 mb-4">Team not found or access denied</h1>
          <Button onClick={() => router.push('/teams')}>Back to Teams</Button>
        </div>
      </MainLayout>
    );
  }

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const teamStats: TeamStats = {
    totalMembers: team.memberCount,
    activeMembers: team.members.filter(m => m.isActive).length,
    pendingApplications: pendingApplications.length,
    avgRating: team.statistics.averageRating,
    recentActivity: [
      { type: 'join', member: 'NewMember', date: '2024-01-20', details: 'Joined via application' },
      { type: 'contest', member: 'Team', date: '2024-01-18', details: 'Participated in picoCTF 2024' },
      { type: 'promotion', member: 'SeniorMember', date: '2024-01-15', details: 'Promoted to co-captain' }
    ]
  };

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
            <Button
              variant="outline"
              onClick={() => router.push(`/teams/${team.id}`)}
              className="mb-6 font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              BACK TO TEAM
            </Button>

            <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {team.logoUrl && (
                    <img 
                      src={team.logoUrl} 
                      alt={team.name}
                      className="w-16 h-16 rounded-lg border border-green-500/50"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                      {team.name}
                    </h1>
                    <p className="text-gray-400 font-mono">Team Management Dashboard</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setShowInviteModal(true)}
                    className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    INVITE MEMBER
                  </Button>
                  <Button
                    onClick={() => router.push(`/teams/${team.id}/edit`)}
                    variant="outline"
                    className="font-mono border-blue-500/50 text-blue-400"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    EDIT TEAM
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {[
              { label: 'Total Members', value: teamStats.totalMembers, icon: Users, color: 'text-blue-400' },
              { label: 'Active Members', value: teamStats.activeMembers, icon: Shield, color: 'text-green-400' },
              { label: 'Pending Applications', value: teamStats.pendingApplications, icon: Clock, color: 'text-yellow-400' },
              { label: 'Average Rating', value: teamStats.avgRating, icon: Star, color: 'text-purple-400' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 font-mono text-sm">{stat.label}</p>
                      <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
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
                { id: "overview", label: "Overview", icon: Eye },
                { id: "members", label: "Members", icon: Users },
                { id: "applications", label: `Applications (${pendingApplications.length})`, icon: Mail },
                { id: "settings", label: "Settings", icon: Settings }
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
                {/* Recent Activity */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-6">RECENT ACTIVITY</h3>
                  <div className="space-y-4">
                    {teamStats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {activity.type === 'join' && <UserPlus className="h-4 w-4 text-green-400" />}
                            {activity.type === 'leave' && <UserMinus className="h-4 w-4 text-red-400" />}
                            {activity.type === 'promotion' && <Crown className="h-4 w-4 text-yellow-400" />}
                            {activity.type === 'contest' && <Trophy className="h-4 w-4 text-blue-400" />}
                            <span className="font-mono text-white text-sm">{activity.member}</span>
                          </div>
                          <p className="font-mono text-gray-400 text-xs">{activity.details}</p>
                          <p className="font-mono text-gray-500 text-xs mt-1">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Performance */}
                <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                  <h3 className="font-mono text-green-400 font-bold mb-6">TEAM PERFORMANCE</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Current Rating</span>
                      <span className="font-mono text-green-400 font-bold">{team.statistics.currentRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Best Ranking</span>
                      <span className="font-mono text-yellow-400 font-bold">#{team.statistics.bestRanking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Contests Won</span>
                      <span className="font-mono text-blue-400 font-bold">{team.statistics.contestsWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Total Contests</span>
                      <span className="font-mono text-purple-400 font-bold">{team.statistics.contestsParticipated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono text-gray-400">Total Points</span>
                      <span className="font-mono text-gray-300">{team.statistics.totalPoints.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "members" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-6">TEAM MEMBERS ({team.memberCount})</h3>
                <div className="space-y-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-lg font-bold font-mono text-black">
                          {member.username.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-white font-bold">{member.username}</span>
                            {member.role === 'captain' && <Crown className="h-4 w-4 text-yellow-400" />}
                            {!member.isActive && <Badge variant="outline" className="text-red-400 border-red-400 text-xs">INACTIVE</Badge>}
                          </div>
                          <div className="font-mono text-gray-400 text-sm">{member.email}</div>
                          <div className="flex space-x-1 mt-1">
                            {member.skills.slice(0, 3).map(skill => (
                              <Badge key={skill} variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                                {skill}
                              </Badge>
                            ))}
                            {member.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs font-mono text-gray-400 border-gray-600">
                                +{member.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                          <div className="font-mono text-gray-500 text-xs mt-1">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {member.role !== 'captain' && (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromoteMember(member.id, 'captain')}
                            disabled={actionLoading === member.id}
                            className="font-mono border-yellow-500/50 text-yellow-400 text-xs"
                          >
                            <Crown className="h-3 w-3 mr-1" />
                            PROMOTE
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDeleteConfirm(member.id)}
                            disabled={actionLoading === member.id}
                            className="font-mono border-red-500/50 text-red-400 text-xs"
                          >
                            <UserMinus className="h-3 w-3 mr-1" />
                            REMOVE
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "applications" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-6">
                  PENDING APPLICATIONS ({pendingApplications.length})
                </h3>
                
                {pendingApplications.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h4 className="font-mono text-gray-400 text-lg mb-2">No pending applications</h4>
                    <p className="text-gray-500 font-mono">Applications will appear here when users apply to join your team</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingApplications.map((application) => (
                      <div key={application.id} className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-mono text-white font-bold text-lg">{application.username}</h4>
                            <p className="font-mono text-gray-400 text-sm">{application.email}</p>
                            <p className="font-mono text-gray-500 text-xs mt-1">
                              Applied {new Date(application.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApplicationResponse(application.id, 'accept')}
                              disabled={actionLoading === application.id}
                              className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold text-sm"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              ACCEPT
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleApplicationResponse(application.id, 'reject')}
                              disabled={actionLoading === application.id}
                              className="font-mono border-red-500/50 text-red-400 text-sm"
                            >
                              <X className="h-4 w-4 mr-1" />
                              REJECT
                            </Button>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-mono text-green-400 font-bold text-sm mb-2">MESSAGE:</h5>
                          <p className="font-mono text-gray-300 text-sm bg-gray-800/50 p-3 rounded">
                            {application.message}
                          </p>
                        </div>

                        <div>
                          <h5 className="font-mono text-green-400 font-bold text-sm mb-2">SKILLS:</h5>
                          <div className="flex flex-wrap gap-2">
                            {application.skills.map(skill => (
                              <Badge key={skill} variant="outline" className="font-mono text-gray-300 border-gray-600 text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
                <h3 className="font-mono text-green-400 font-bold mb-6">TEAM SETTINGS</h3>
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-mono text-yellow-400 font-bold">Warning</h4>
                    </div>
                    <p className="font-mono text-yellow-300 text-sm">
                      Team settings can be modified in the team edit page. Be careful when changing privacy settings or member limits.
                    </p>
                  </div>

                  <Button
                    onClick={() => router.push(`/teams/${team.id}/edit`)}
                    className="font-mono bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    EDIT TEAM SETTINGS
                  </Button>

                  <div className="border-t border-gray-700 pt-6">
                    <h4 className="font-mono text-red-400 font-bold mb-4">DANGER ZONE</h4>
                    <Button
                      variant="outline"
                      className="font-mono border-red-500/50 text-red-400"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      DELETE TEAM
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Invite Modal */}
          <AnimatePresence>
            {showInviteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowInviteModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gray-800 border border-green-500/50 rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="font-mono text-green-400 font-bold text-lg mb-4">INVITE MEMBER</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">EMAIL OR USERNAME</label>
                      <Input
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="user@example.com or username"
                        className="font-mono bg-gray-900/50 border-green-500/30 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-mono text-green-400 mb-2">MESSAGE (Optional)</label>
                      <Input
                        value={inviteMessage}
                        onChange={(e) => setInviteMessage(e.target.value)}
                        placeholder="Personal message for the invitation..."
                        className="font-mono bg-gray-900/50 border-green-500/30 text-white"
                        multiline
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <Button
                      onClick={handleInviteMember}
                      disabled={!inviteEmail.trim() || actionLoading === 'invite'}
                      className="flex-1 font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {actionLoading === 'invite' ? "SENDING..." : "SEND INVITE"}
                    </Button>
                    <Button
                      onClick={() => setShowInviteModal(false)}
                      variant="outline"
                      className="flex-1 font-mono border-gray-500 text-gray-400"
                    >
                      CANCEL
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowDeleteConfirm(null)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gray-800 border border-red-500/50 rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                    <h3 className="font-mono text-red-400 font-bold text-lg">REMOVE MEMBER</h3>
                  </div>
                  
                  <p className="text-gray-300 font-mono mb-6">
                    Are you sure you want to remove this member from the team? This action cannot be undone.
                  </p>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleRemoveMember(showDeleteConfirm)}
                      disabled={actionLoading === showDeleteConfirm}
                      className="flex-1 font-mono bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {actionLoading === showDeleteConfirm ? "REMOVING..." : "REMOVE"}
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(null)}
                      variant="outline"
                      className="flex-1 font-mono border-gray-500 text-gray-400"
                    >
                      CANCEL
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MainLayout>
  );
}
