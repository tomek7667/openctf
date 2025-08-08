import { ApiResponse } from '@/types/api';

export interface TeamMember {
  id: string;
  userId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: 'captain' | 'member' | 'substitute';
  joinedAt: string;
  skills: string[];
  isActive: boolean;
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  teamName: string;
  invitedUserId: string;
  invitedUsername: string;
  invitedEmail: string;
  invitedByUserId: string;
  invitedByUsername: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
}

export interface TeamApplication {
  id: string;
  teamId: string;
  userId: string;
  username: string;
  email: string;
  message: string;
  skills: string[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
  reviewedByUserId?: string;
  rejectionReason?: string;
}

export interface TeamRecruitment {
  isRecruiting: boolean;
  description?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minExperience?: string;
  timeCommitment?: string;
  contactMethod: 'application' | 'invitation_only';
  maxMembers: number;
  applicationDeadline?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  privacy: 'public' | 'invite-only' | 'private';
  captainId: string;
  members: TeamMember[];
  memberCount: number;
  maxMembers: number;
  country?: string;
  founded: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'disbanded';
  
  // Statistics
  statistics: {
    contestsParticipated: number;
    contestsWon: number;
    totalPoints: number;
    averageRating: number;
    bestRanking: number;
    currentRating: number;
    ratingHistory: Array<{
      date: string;
      rating: number;
      contest: string;
    }>;
  };

  // Recruitment
  recruitment: TeamRecruitment;

  // Settings
  settings: {
    allowApplications: boolean;
    requireApproval: boolean;
    autoAcceptFromRating: number;
    visibilityLevel: 'public' | 'members_only' | 'captain_only';
  };

  // Social links
  socialLinks: {
    website?: string;
    discord?: string;
    slack?: string;
    github?: string;
  };

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface TeamFilters {
  search?: string;
  country?: string;
  minRating?: number;
  maxRating?: number;
  isRecruiting?: boolean;
  memberCount?: {
    min?: number;
    max?: number;
  };
  lastActive?: 'week' | 'month' | 'year';
  contestsParticipated?: {
    min?: number;
    max?: number;
  };
  skills?: string[];
  sortBy?: 'newest' | 'oldest' | 'rating' | 'members' | 'activity' | 'contests';
}

export interface TeamListResponse {
  teams: Team[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Enhanced mock teams data with comprehensive information
const mockTeams: Team[] = [
  {
    id: "team-001",
    name: "CyberSamurai",
    description: "Elite cybersecurity team specializing in advanced persistent threat hunting and zero-day research. We compete at the highest level of international CTF competitions.",
    logoUrl: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=64&h=64&fit=crop&crop=center",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop",
    privacy: 'public',
    captainId: "user-001",
    members: [
      {
        id: "member-001",
        userId: "user-001",
        username: "CyberNinja",
        email: "ninja@cybersamurai.team",
        role: "captain",
        joinedAt: "2022-01-15T00:00:00Z",
        skills: ["Web Security", "Cryptography", "Reverse Engineering"],
        isActive: true
      },
      {
        id: "member-002", 
        userId: "user-010",
        username: "BinaryMaster",
        email: "binary@cybersamurai.team",
        role: "member",
        joinedAt: "2022-02-20T00:00:00Z",
        skills: ["Binary Exploitation", "Reverse Engineering", "Assembly"],
        isActive: true
      },
      {
        id: "member-003",
        userId: "user-023",
        username: "CryptoQueen",
        email: "crypto@cybersamurai.team", 
        role: "member",
        joinedAt: "2022-03-10T00:00:00Z",
        skills: ["Cryptography", "Number Theory", "Mathematics"],
        isActive: true
      }
    ],
    memberCount: 3,
    maxMembers: 5,
    country: "US",
    founded: "2022-01-15T00:00:00Z",
    lastActive: "2024-01-20T00:00:00Z",
    status: "active",
    statistics: {
      contestsParticipated: 28,
      contestsWon: 8,
      totalPoints: 15420,
      averageRating: 1892,
      bestRanking: 1,
      currentRating: 1943,
      ratingHistory: [
        { date: "2024-01-15", rating: 1943, contest: "picoCTF 2024" },
        { date: "2023-12-10", rating: 1867, contest: "ASIS CTF Finals" },
        { date: "2023-11-25", rating: 1823, contest: "HITCON CTF" }
      ]
    },
    recruitment: {
      isRecruiting: true,
      description: "Looking for experienced players with strong crypto and pwn skills. Must have participated in at least 10 major CTFs.",
      requiredSkills: ["Cryptography", "Binary Exploitation"],
      preferredSkills: ["Reverse Engineering", "Web Security"],
      minExperience: "2+ years",
      timeCommitment: "15+ hours/week",
      contactMethod: "application",
      maxMembers: 5,
      applicationDeadline: "2024-03-01T00:00:00Z"
    },
    settings: {
      allowApplications: true,
      requireApproval: true,
      autoAcceptFromRating: 1800,
      visibilityLevel: "public"
    },
    socialLinks: {
      website: "https://cybersamurai.team",
      discord: "https://discord.gg/cybersamurai",
      github: "https://github.com/cybersamurai-team"
    },
    createdAt: "2022-01-15T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z"
  },

  {
    id: "team-002", 
    name: "Digital Ronin",
    description: "International team of security researchers and penetration testers. We focus on real-world security challenges and advanced exploitation techniques.",
    logoUrl: "https://images.unsplash.com/photo-1516472543999-e22c6fe7d43a?w=64&h=64&fit=crop&crop=center",
    privacy: 'invite-only',
    captainId: "user-045",
    members: [
      {
        id: "member-010",
        userId: "user-045", 
        username: "ShadowHacker",
        email: "shadow@digitalronin.org",
        role: "captain",
        joinedAt: "2021-06-01T00:00:00Z",
        skills: ["Web Security", "Network Security", "Social Engineering"],
        isActive: true
      },
      {
        id: "member-011",
        userId: "user-078",
        username: "ForensicsExpert",
        email: "forensics@digitalronin.org",
        role: "member", 
        joinedAt: "2021-08-15T00:00:00Z",
        skills: ["Digital Forensics", "Malware Analysis", "OSINT"],
        isActive: true
      }
    ],
    memberCount: 2,
    maxMembers: 4,
    country: "DE",
    founded: "2021-06-01T00:00:00Z",
    lastActive: "2024-01-18T00:00:00Z",
    status: "active",
    statistics: {
      contestsParticipated: 35,
      contestsWon: 12,
      totalPoints: 18750,
      averageRating: 2034,
      bestRanking: 3,
      currentRating: 2156,
      ratingHistory: [
        { date: "2024-01-10", rating: 2156, contest: "InsomniHack CTF" },
        { date: "2023-12-20", rating: 2089, contest: "35C3 CTF" }
      ]
    },
    recruitment: {
      isRecruiting: false,
      description: "",
      requiredSkills: [],
      preferredSkills: [],
      contactMethod: "invitation_only",
      maxMembers: 4
    },
    settings: {
      allowApplications: false,
      requireApproval: true,
      autoAcceptFromRating: 2000,
      visibilityLevel: "public"
    },
    socialLinks: {
      discord: "https://discord.gg/digitalronin"
    },
    createdAt: "2021-06-01T00:00:00Z",
    updatedAt: "2024-01-18T00:00:00Z"
  },

  {
    id: "team-003",
    name: "NullPointer Academy",
    description: "Student-led team from top universities focusing on learning and skill development. Perfect for beginners and intermediate players looking to grow.",
    logoUrl: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=64&h=64&fit=crop&crop=center",
    privacy: 'public',
    captainId: "user-156",
    members: [
      {
        id: "member-020",
        userId: "user-156",
        username: "StudentHacker",
        email: "student@nullpointer.academy",
        role: "captain",
        joinedAt: "2023-09-01T00:00:00Z",
        skills: ["Python", "Web Security", "Linux"],
        isActive: true
      }
    ],
    memberCount: 8,
    maxMembers: 10,
    country: "CA",
    founded: "2023-09-01T00:00:00Z",
    lastActive: "2024-01-19T00:00:00Z",
    status: "active",
    statistics: {
      contestsParticipated: 12,
      contestsWon: 0,
      totalPoints: 5420,
      averageRating: 1245,
      bestRanking: 45,
      currentRating: 1267,
      ratingHistory: [
        { date: "2024-01-15", rating: 1267, contest: "NorthSec CTF" },
        { date: "2023-12-01", rating: 1198, contest: "CSAW CTF" }
      ]
    },
    recruitment: {
      isRecruiting: true,
      description: "Welcoming students and beginners! No prior CTF experience required. We provide mentorship and learning resources.",
      requiredSkills: [],
      preferredSkills: ["Programming", "Linux", "Networking"],
      minExperience: "Beginner friendly",
      timeCommitment: "5-10 hours/week",
      contactMethod: "application",
      maxMembers: 10
    },
    settings: {
      allowApplications: true,
      requireApproval: false,
      autoAcceptFromRating: 0,
      visibilityLevel: "public"
    },
    socialLinks: {
      website: "https://nullpointer.academy",
      discord: "https://discord.gg/nullpointer",
      github: "https://github.com/nullpointer-academy"
    },
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2024-01-19T00:00:00Z"
  }
];

const mockInvitations: TeamInvitation[] = [
  {
    id: "inv-001",
    teamId: "team-001",
    teamName: "CyberSamurai",
    invitedUserId: "user-999",
    invitedUsername: "NewHacker",
    invitedEmail: "newhacker@example.com",
    invitedByUserId: "user-001", 
    invitedByUsername: "CyberNinja",
    status: "pending",
    message: "We'd love to have you join our team! Your crypto skills would be a great addition.",
    createdAt: "2024-01-20T10:00:00Z",
    expiresAt: "2024-02-20T10:00:00Z"
  }
];

const mockApplications: TeamApplication[] = [
  {
    id: "app-001",
    teamId: "team-003",
    userId: "user-888",
    username: "AspiringHacker",
    email: "aspiring@example.com",
    message: "I'm a computer science student passionate about cybersecurity. I've been practicing on HackTheBox and would love to join a team to learn more!",
    skills: ["Python", "Linux", "Web Development"],
    status: "pending",
    createdAt: "2024-01-19T15:30:00Z"
  }
];

// API Functions
export async function getTeams(
  filters: TeamFilters = {},
  page = 1,
  limit = 12
): Promise<ApiResponse<TeamListResponse>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredTeams = [...mockTeams];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredTeams = filteredTeams.filter(team =>
      team.name.toLowerCase().includes(search) ||
      team.description.toLowerCase().includes(search) ||
      team.members.some(member => member.username.toLowerCase().includes(search))
    );
  }

  if (filters.country) {
    filteredTeams = filteredTeams.filter(team => team.country === filters.country);
  }

  if (filters.isRecruiting !== undefined) {
    filteredTeams = filteredTeams.filter(team => team.recruitment.isRecruiting === filters.isRecruiting);
  }

  if (filters.minRating) {
    filteredTeams = filteredTeams.filter(team => team.statistics.currentRating >= filters.minRating!);
  }

  if (filters.maxRating) {
    filteredTeams = filteredTeams.filter(team => team.statistics.currentRating <= filters.maxRating!);
  }

  if (filters.memberCount) {
    filteredTeams = filteredTeams.filter(team => {
      const count = team.memberCount;
      return (!filters.memberCount!.min || count >= filters.memberCount!.min) &&
             (!filters.memberCount!.max || count <= filters.memberCount!.max);
    });
  }

  if (filters.skills && filters.skills.length > 0) {
    filteredTeams = filteredTeams.filter(team =>
      team.recruitment.requiredSkills.some(skill => filters.skills!.includes(skill)) ||
      team.recruitment.preferredSkills.some(skill => filters.skills!.includes(skill))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filteredTeams.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'rating':
      filteredTeams.sort((a, b) => b.statistics.currentRating - a.statistics.currentRating);
      break;
    case 'members':
      filteredTeams.sort((a, b) => b.memberCount - a.memberCount);
      break;
    case 'activity':
      filteredTeams.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
      break;
    case 'contests':
      filteredTeams.sort((a, b) => b.statistics.contestsParticipated - a.statistics.contestsParticipated);
      break;
    case 'newest':
    default:
      filteredTeams.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Pagination
  const total = filteredTeams.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTeams = filteredTeams.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      teams: paginatedTeams,
      total,
      page,
      limit,
      totalPages
    }
  };
}

export async function getTeam(id: string): Promise<ApiResponse<Team>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const team = mockTeams.find(t => t.id === id);

  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  return {
    success: true,
    data: team
  };
}

export async function createTeam(teamData: Partial<Team>, userId: string): Promise<ApiResponse<Team>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: teamData.name || '',
    description: teamData.description || '',
    logoUrl: teamData.logoUrl || undefined,
    bannerUrl: teamData.bannerUrl || undefined,
    privacy: teamData.privacy || 'public',
    captainId: userId,
    members: [{
      id: `member-${Date.now()}`,
      userId,
      username: 'CurrentUser', // In real app, this would come from user data
      email: 'current@example.com',
      role: 'captain',
      joinedAt: new Date().toISOString(),
      skills: [],
      isActive: true
    }],
    memberCount: 1,
    maxMembers: teamData.maxMembers || 5,
    country: teamData.country,
    founded: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    status: 'active',
    statistics: {
      contestsParticipated: 0,
      contestsWon: 0,
      totalPoints: 0,
      averageRating: 1000,
      bestRanking: 0,
      currentRating: 1000,
      ratingHistory: []
    },
    recruitment: teamData.recruitment || {
      isRecruiting: false,
      requiredSkills: [],
      preferredSkills: [],
      contactMethod: 'application',
      maxMembers: 5
    },
    settings: {
      allowApplications: true,
      requireApproval: true,
      autoAcceptFromRating: 0,
      visibilityLevel: 'public'
    },
    socialLinks: teamData.socialLinks || {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockTeams.unshift(newTeam);

  return {
    success: true,
    data: newTeam
  };
}

export async function updateTeam(
  id: string,
  teamData: Partial<Team>,
  userId: string
): Promise<ApiResponse<Team>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const teamIndex = mockTeams.findIndex(t => t.id === id);
  if (teamIndex === -1) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  const team = mockTeams[teamIndex];
  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  if (team.captainId !== userId) {
    return {
      success: false,
      error: 'Permission denied - only team captain can update team'
    };
  }

  const updatedTeam: Team = {
    ...team,
    ...teamData,
    id: team.id,
    captainId: team.captainId,
    createdAt: team.createdAt,
    updatedAt: new Date().toISOString()
  };

  mockTeams[teamIndex] = updatedTeam;

  return {
    success: true,
    data: updatedTeam
  };
}

export async function deleteTeam(id: string, userId: string): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const teamIndex = mockTeams.findIndex(t => t.id === id);
  if (teamIndex === -1) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  const team = mockTeams[teamIndex];
  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  if (team.captainId !== userId) {
    return {
      success: false,
      error: 'Permission denied - only team captain can delete team'
    };
  }

  mockTeams.splice(teamIndex, 1);

  // Clean up related data
  const invitationIndicesToRemove = mockInvitations
    .map((inv, index) => inv.teamId === id ? index : -1)
    .filter(index => index !== -1)
    .reverse();

  invitationIndicesToRemove.forEach(index => {
    mockInvitations.splice(index, 1);
  });

  return {
    success: true,
    data: undefined
  };
}

export async function inviteToTeam(
  teamId: string,
  userIdOrEmail: string,
  message?: string,
  invitedByUserId?: string
): Promise<ApiResponse<TeamInvitation>> {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!invitedByUserId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const team = mockTeams.find(t => t.id === teamId);
  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  if (team.captainId !== invitedByUserId && 
      !team.members.some(m => m.userId === invitedByUserId && m.role === 'captain')) {
    return {
      success: false,
      error: 'Permission denied - only team captain can send invitations'
    };
  }

  const newInvitation: TeamInvitation = {
    id: `inv-${Date.now()}`,
    teamId,
    teamName: team.name,
    invitedUserId: userIdOrEmail, // In real app, resolve email to userId
    invitedUsername: 'InvitedUser',
    invitedEmail: userIdOrEmail.includes('@') ? userIdOrEmail : 'user@example.com',
    invitedByUserId,
    invitedByUsername: 'CurrentUser',
    status: 'pending',
    message,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  mockInvitations.push(newInvitation);

  return {
    success: true,
    data: newInvitation
  };
}

export async function respondToInvitation(
  invitationId: string,
  response: 'accept' | 'decline',
  userId: string
): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const invitation = mockInvitations.find(inv => inv.id === invitationId);
  if (!invitation) {
    return {
      success: false,
      error: 'Invitation not found'
    };
  }

  if (invitation.invitedUserId !== userId) {
    return {
      success: false,
      error: 'Permission denied'
    };
  }

  if (invitation.status !== 'pending') {
    return {
      success: false,
      error: 'Invitation already responded to'
    };
  }

  invitation.status = response === 'accept' ? 'accepted' : 'declined';
  invitation.respondedAt = new Date().toISOString();

  if (response === 'accept') {
    // Add user to team
    const team = mockTeams.find(t => t.id === invitation.teamId);
    if (team && team.memberCount < team.maxMembers) {
      team.members.push({
        id: `member-${Date.now()}`,
        userId,
        username: invitation.invitedUsername,
        email: invitation.invitedEmail,
        role: 'member',
        joinedAt: new Date().toISOString(),
        skills: [],
        isActive: true
      });
      team.memberCount++;
      team.updatedAt = new Date().toISOString();
    }
  }

  return {
    success: true,
    data: undefined
  };
}

export async function applyToTeam(
  teamId: string,
  message: string,
  skills: string[],
  userId: string
): Promise<ApiResponse<TeamApplication>> {
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!userId) {
    return {
      success: false,
      error: 'Authentication required'
    };
  }

  const team = mockTeams.find(t => t.id === teamId);
  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  if (!team.settings.allowApplications) {
    return {
      success: false,
      error: 'Team is not accepting applications'
    };
  }

  if (team.members.some(m => m.userId === userId)) {
    return {
      success: false,
      error: 'You are already a member of this team'
    };
  }

  const newApplication: TeamApplication = {
    id: `app-${Date.now()}`,
    teamId,
    userId,
    username: 'CurrentUser',
    email: 'current@example.com',
    message,
    skills,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  mockApplications.push(newApplication);

  return {
    success: true,
    data: newApplication
  };
}

export async function getTeamInvitations(userId: string): Promise<ApiResponse<TeamInvitation[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const userInvitations = mockInvitations.filter(inv => inv.invitedUserId === userId);

  return {
    success: true,
    data: userInvitations
  };
}

export async function getTeamApplications(teamId: string, userId: string): Promise<ApiResponse<TeamApplication[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const team = mockTeams.find(t => t.id === teamId);
  if (!team) {
    return {
      success: false,
      error: 'Team not found'
    };
  }

  if (team.captainId !== userId) {
    return {
      success: false,
      error: 'Permission denied - only team captain can view applications'
    };
  }

  const teamApplications = mockApplications.filter(app => app.teamId === teamId);

  return {
    success: true,
    data: teamApplications
  };
}

export async function getUserTeams(userId: string): Promise<ApiResponse<Team[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const userTeams = mockTeams.filter(team => 
    team.members.some(member => member.userId === userId)
  );

  return {
    success: true,
    data: userTeams
  };
}
