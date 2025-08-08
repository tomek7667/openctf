import { ApiResponse } from '@/types/api';

export interface ContestChallenge {
  id: string;
  name: string;
  category: 'web' | 'crypto' | 'reverse' | 'pwn' | 'forensics' | 'misc' | 'hardware';
  points: number;
  solves: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description?: string;
  tags: string[];
  firstBloodTeam?: string;
  firstBloodTime?: string;
}

export interface ContestParticipant {
  id: string;
  type: 'team' | 'individual';
  name: string;
  members?: string[];
  country?: string;
  registeredAt: string;
  isActive: boolean;
}

export interface ContestRegistration {
  id: string;
  contestId: string;
  participantId: string;
  participantType: 'team' | 'individual';
  participantName: string;
  registeredAt: string;
  status: 'registered' | 'confirmed' | 'cancelled';
  metadata?: {
    contactEmail?: string;
    additionalInfo?: string;
  };
}

export interface ContestResult {
  id: string;
  contestId: string;
  participantId: string;
  participantName: string;
  participantType: 'team' | 'individual';
  rank: number;
  score: number;
  solves: Array<{
    challengeId: string;
    challengeName: string;
    points: number;
    solvedAt: string;
    timeToSolve: number; // in minutes
  }>;
  country?: string;
  finalRank: number;
  ratingChange?: number;
}

export interface LiveLeaderboard {
  contestId: string;
  lastUpdated: string;
  entries: Array<{
    rank: number;
    participantId: string;
    participantName: string;
    participantType: 'team' | 'individual';
    score: number;
    solves: number;
    lastSolve?: string;
    country?: string;
    isActive: boolean;
  }>;
  totalParticipants: number;
  totalChallenges: number;
}

export interface Contest {
  id: string;
  name: string;
  description: string;
  format: 'jeopardy' | 'attack-defense' | 'king-of-the-hill' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  
  // Timing
  startTime: string;
  endTime: string;
  duration: number; // in hours
  timezone: string;
  
  // Registration
  registrationStart: string;
  registrationEnd: string;
  maxParticipants?: number;
  allowIndividuals: boolean;
  allowTeams: boolean;
  maxTeamSize: number;
  minTeamSize: number;
  
  // Organization
  organizer: string;
  organizerLogo?: string;
  organizerWebsite?: string;
  logoUrl?: string;
  bannerUrl?: string;
  website?: string;
  
  // Pricing & Prizes
  entryFee?: number;
  currency?: string;
  prizes: Array<{
    rank: number;
    description: string;
    value?: number;
    currency?: string;
  }>;
  
  // Status
  status: 'upcoming' | 'registration-open' | 'registration-closed' | 'live' | 'finished' | 'cancelled';
  visibility: 'public' | 'private' | 'invite-only';
  
  // Participation
  participantCount: number;
  teamCount: number;
  individualCount: number;
  registeredParticipants?: ContestParticipant[];
  
  // Challenges & Scoring
  challenges?: ContestChallenge[];
  totalChallenges: number;
  scoringMode: 'static' | 'dynamic' | 'custom';
  
  // CTFtime Integration
  ctftimeId?: number;
  ctftimeUrl?: string;
  weight?: number; // CTFtime weight
  
  // Metadata
  tags: string[];
  country?: string;
  language: string;
  rulesUrl?: string;
  discordUrl?: string;
  
  // Statistics
  statistics: {
    totalSolves: number;
    avgScore: number;
    topScore: number;
    challengeStats: Array<{
      category: string;
      count: number;
      avgSolves: number;
    }>;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ContestFilters {
  search?: string;
  format?: string;
  difficulty?: string;
  status?: string;
  upcoming?: boolean;
  live?: boolean;
  finished?: boolean;
  organizer?: string;
  country?: string;
  hasRegOpen?: boolean;
  hasPrizes?: boolean;
  freeEntry?: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'start-time' | 'participants' | 'prizes';
}

export interface ContestListResponse {
  contests: Contest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Enhanced mock contests data
const mockContests: Contest[] = [
  {
    id: "contest-001",
    name: "CyberDefenders Global CTF 2024",
    description: "The premier international cybersecurity competition featuring challenges across all domains. Join teams from around the world competing for $50,000 in prizes.",
    format: "jeopardy",
    difficulty: "advanced",
    
    startTime: "2024-03-15T18:00:00Z",
    endTime: "2024-03-17T18:00:00Z",
    duration: 48,
    timezone: "UTC",
    
    registrationStart: "2024-02-01T00:00:00Z",
    registrationEnd: "2024-03-14T23:59:59Z",
    maxParticipants: 500,
    allowIndividuals: false,
    allowTeams: true,
    maxTeamSize: 5,
    minTeamSize: 1,
    
    organizer: "CyberDefenders Alliance",
    organizerLogo: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=64&h=64&fit=crop",
    organizerWebsite: "https://cyberdefenders.org",
    logoUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop",
    website: "https://ctf.cyberdefenders.org",
    
    entryFee: 0,
    currency: "USD",
    prizes: [
      { rank: 1, description: "First Place", value: 25000, currency: "USD" },
      { rank: 2, description: "Second Place", value: 15000, currency: "USD" },
      { rank: 3, description: "Third Place", value: 10000, currency: "USD" },
      { rank: 4, description: "Fourth Place", value: 5000, currency: "USD" },
      { rank: 5, description: "Fifth Place", value: 2500, currency: "USD" }
    ],
    
    status: "registration-open",
    visibility: "public",
    
    participantCount: 156,
    teamCount: 156,
    individualCount: 0,
    
    totalChallenges: 25,
    scoringMode: "dynamic",
    
    ctftimeId: 2024001,
    ctftimeUrl: "https://ctftime.org/event/2024001",
    weight: 25.0,
    
    tags: ["international", "jeopardy", "prizes", "ctftime"],
    country: "US",
    language: "English",
    rulesUrl: "https://ctf.cyberdefenders.org/rules",
    discordUrl: "https://discord.gg/cyberdefenders",
    
    statistics: {
      totalSolves: 0,
      avgScore: 0,
      topScore: 0,
      challengeStats: [
        { category: "web", count: 5, avgSolves: 0 },
        { category: "crypto", count: 5, avgSolves: 0 },
        { category: "pwn", count: 4, avgSolves: 0 },
        { category: "reverse", count: 4, avgSolves: 0 },
        { category: "forensics", count: 4, avgSolves: 0 },
        { category: "misc", count: 3, avgSolves: 0 }
      ]
    },
    
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-20T12:00:00Z"
  },

  {
    id: "contest-002",
    name: "NorthSec 2024",
    description: "Canada's premier cybersecurity conference and CTF competition. Two days of intense competition in beautiful Montreal.",
    format: "jeopardy",
    difficulty: "intermediate",
    
    startTime: "2024-05-17T13:00:00Z",
    endTime: "2024-05-18T21:00:00Z",
    duration: 32,
    timezone: "America/Montreal",
    
    registrationStart: "2024-03-01T00:00:00Z",
    registrationEnd: "2024-05-10T23:59:59Z",
    maxParticipants: 200,
    allowIndividuals: true,
    allowTeams: true,
    maxTeamSize: 4,
    minTeamSize: 1,
    
    organizer: "NorthSec Organization",
    organizerWebsite: "https://nsec.io",
    logoUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=200&h=200&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
    website: "https://ctf.nsec.io",
    
    entryFee: 50,
    currency: "CAD",
    prizes: [
      { rank: 1, description: "Winner Trophy + Conference Tickets", value: 2000, currency: "CAD" },
      { rank: 2, description: "Runner-up Trophy + Conference Tickets", value: 1000, currency: "CAD" },
      { rank: 3, description: "Third Place Trophy + Conference Tickets", value: 500, currency: "CAD" }
    ],
    
    status: "upcoming",
    visibility: "public",
    
    participantCount: 0,
    teamCount: 0,
    individualCount: 0,
    
    totalChallenges: 20,
    scoringMode: "static",
    
    ctftimeId: 2024002,
    ctftimeUrl: "https://ctftime.org/event/2024002",
    weight: 23.5,
    
    tags: ["conference", "canada", "on-site", "ctftime"],
    country: "CA",
    language: "English",
    rulesUrl: "https://ctf.nsec.io/rules",
    
    statistics: {
      totalSolves: 0,
      avgScore: 0,
      topScore: 0,
      challengeStats: []
    },
    
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },

  {
    id: "contest-003",
    name: "picoCTF 2024",
    description: "Educational CTF designed for high school students and beginners. Perfect for learning cybersecurity fundamentals.",
    format: "jeopardy",
    difficulty: "beginner",
    
    startTime: "2024-03-12T00:00:00Z",
    endTime: "2024-03-26T23:59:59Z",
    duration: 336, // 14 days
    timezone: "UTC",
    
    registrationStart: "2024-02-01T00:00:00Z",
    registrationEnd: "2024-03-25T23:59:59Z",
    allowIndividuals: true,
    allowTeams: true,
    maxTeamSize: 5,
    minTeamSize: 1,
    
    organizer: "Carnegie Mellon University",
    organizerLogo: "https://images.unsplash.com/photo-1562774053-701939374585?w=64&h=64&fit=crop",
    organizerWebsite: "https://cmu.edu",
    logoUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=200&fit=crop",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop",
    website: "https://picoctf.org",
    
    entryFee: 0,
    currency: "USD",
    prizes: [
      { rank: 1, description: "picoCTF Champions", value: 0, currency: "USD" },
      { rank: 2, description: "Runner-up Certificate", value: 0, currency: "USD" },
      { rank: 3, description: "Third Place Certificate", value: 0, currency: "USD" }
    ],
    
    status: "live",
    visibility: "public",
    
    participantCount: 2847,
    teamCount: 1203,
    individualCount: 1644,
    
    totalChallenges: 50,
    scoringMode: "static",
    
    ctftimeId: 2024003,
    ctftimeUrl: "https://ctftime.org/event/2024003",
    weight: 0, // Educational, not rated
    
    tags: ["educational", "beginner", "students", "free"],
    country: "US",
    language: "English",
    rulesUrl: "https://picoctf.org/rules",
    
    statistics: {
      totalSolves: 45267,
      avgScore: 2341,
      topScore: 8950,
      challengeStats: [
        { category: "web", count: 8, avgSolves: 156 },
        { category: "crypto", count: 10, avgSolves: 89 },
        { category: "forensics", count: 8, avgSolves: 134 },
        { category: "reverse", count: 8, avgSolves: 67 },
        { category: "pwn", count: 6, avgSolves: 34 },
        { category: "misc", count: 10, avgSolves: 203 }
      ]
    },
    
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z"
  },

  {
    id: "contest-004",
    name: "BSides SF CTF 2024",
    description: "Annual CTF competition held alongside BSides San Francisco. Challenging problems for security professionals.",
    format: "jeopardy",
    difficulty: "advanced",
    
    startTime: "2024-04-27T17:00:00Z",
    endTime: "2024-04-28T17:00:00Z",
    duration: 24,
    timezone: "America/Los_Angeles",
    
    registrationStart: "2024-04-01T00:00:00Z",
    registrationEnd: "2024-04-27T16:00:00Z",
    maxParticipants: 300,
    allowIndividuals: true,
    allowTeams: true,
    maxTeamSize: 6,
    minTeamSize: 1,
    
    organizer: "BSides San Francisco",
    organizerWebsite: "https://bsidessf.org",
    logoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
    website: "https://ctf.bsidessf.net",
    
    entryFee: 0,
    currency: "USD",
    prizes: [
      { rank: 1, description: "BSides SF CTF Champions", value: 0, currency: "USD" },
      { rank: 2, description: "Second Place Recognition", value: 0, currency: "USD" },
      { rank: 3, description: "Third Place Recognition", value: 0, currency: "USD" }
    ],
    
    status: "finished",
    visibility: "public",
    
    participantCount: 267,
    teamCount: 189,
    individualCount: 78,
    
    totalChallenges: 18,
    scoringMode: "dynamic",
    
    ctftimeId: 2024004,
    ctftimeUrl: "https://ctftime.org/event/2024004",
    weight: 22.3,
    
    tags: ["conference", "san-francisco", "free", "ctftime"],
    country: "US",
    language: "English",
    rulesUrl: "https://ctf.bsidessf.net/rules",
    
    statistics: {
      totalSolves: 1456,
      avgScore: 1247,
      topScore: 4567,
      challengeStats: [
        { category: "web", count: 4, avgSolves: 45 },
        { category: "crypto", count: 3, avgSolves: 23 },
        { category: "pwn", count: 3, avgSolves: 12 },
        { category: "reverse", count: 3, avgSolves: 18 },
        { category: "forensics", count: 3, avgSolves: 34 },
        { category: "misc", count: 2, avgSolves: 67 }
      ]
    },
    
    createdAt: "2023-11-15T00:00:00Z",
    updatedAt: "2024-04-28T18:00:00Z"
  }
];

const mockRegistrations: ContestRegistration[] = [
  {
    id: "reg-001",
    contestId: "contest-001",
    participantId: "team-001",
    participantType: "team",
    participantName: "CyberSamurai",
    registeredAt: "2024-02-15T10:30:00Z",
    status: "confirmed",
    metadata: {
      contactEmail: "captain@cybersamurai.team",
      additionalInfo: "Looking forward to the competition!"
    }
  }
];

const mockLiveLeaderboard: LiveLeaderboard = {
  contestId: "contest-003",
  lastUpdated: "2024-03-20T15:30:00Z",
  entries: [
    {
      rank: 1,
      participantId: "team-elite",
      participantName: "Elite Hackers",
      participantType: "team",
      score: 8950,
      solves: 47,
      lastSolve: "2024-03-20T15:25:00Z",
      country: "US",
      isActive: true
    },
    {
      rank: 2,
      participantId: "team-cyber",
      participantName: "CyberNinjas",
      participantType: "team", 
      score: 8234,
      solves: 45,
      lastSolve: "2024-03-20T14:50:00Z",
      country: "KR",
      isActive: true
    },
    {
      rank: 3,
      participantId: "user-master",
      participantName: "HackMaster",
      participantType: "individual",
      score: 7890,
      solves: 44,
      lastSolve: "2024-03-20T15:10:00Z",
      country: "DE",
      isActive: false
    }
  ],
  totalParticipants: 2847,
  totalChallenges: 50
};

// API Functions
export async function getContests(
  filters: ContestFilters = {},
  page = 1,
  limit = 12
): Promise<ApiResponse<ContestListResponse>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredContests = [...mockContests];

  // Apply filters
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filteredContests = filteredContests.filter(contest =>
      contest.name.toLowerCase().includes(search) ||
      contest.description.toLowerCase().includes(search) ||
      contest.organizer.toLowerCase().includes(search) ||
      contest.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  if (filters.format) {
    filteredContests = filteredContests.filter(contest => contest.format === filters.format);
  }

  if (filters.difficulty) {
    filteredContests = filteredContests.filter(contest => contest.difficulty === filters.difficulty);
  }

  if (filters.status) {
    filteredContests = filteredContests.filter(contest => contest.status === filters.status);
  }

  if (filters.upcoming) {
    const now = new Date();
    filteredContests = filteredContests.filter(contest => 
      new Date(contest.startTime) > now
    );
  }

  if (filters.live) {
    const now = new Date();
    filteredContests = filteredContests.filter(contest => 
      new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
    );
  }

  if (filters.finished) {
    const now = new Date();
    filteredContests = filteredContests.filter(contest => 
      new Date(contest.endTime) < now
    );
  }

  if (filters.organizer) {
    filteredContests = filteredContests.filter(contest => 
      contest.organizer.toLowerCase().includes(filters.organizer!.toLowerCase())
    );
  }

  if (filters.country) {
    filteredContests = filteredContests.filter(contest => contest.country === filters.country);
  }

  if (filters.hasRegOpen) {
    const now = new Date();
    filteredContests = filteredContests.filter(contest => 
      new Date(contest.registrationStart) <= now && 
      new Date(contest.registrationEnd) >= now
    );
  }

  if (filters.hasPrizes) {
    filteredContests = filteredContests.filter(contest => 
      contest.prizes.some(prize => prize.value && prize.value > 0)
    );
  }

  if (filters.freeEntry) {
    filteredContests = filteredContests.filter(contest => !contest.entryFee || contest.entryFee === 0);
  }

  if (filters.tags && filters.tags.length > 0) {
    filteredContests = filteredContests.filter(contest =>
      filters.tags!.some(tag => contest.tags.includes(tag))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filteredContests.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'start-time':
      filteredContests.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      break;
    case 'participants':
      filteredContests.sort((a, b) => b.participantCount - a.participantCount);
      break;
    case 'prizes':
      filteredContests.sort((a, b) => {
        const aMaxPrize = Math.max(...a.prizes.map(p => p.value || 0));
        const bMaxPrize = Math.max(...b.prizes.map(p => p.value || 0));
        return bMaxPrize - aMaxPrize;
      });
      break;
    case 'newest':
    default:
      filteredContests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Pagination
  const total = filteredContests.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContests = filteredContests.slice(startIndex, endIndex);

  return {
    success: true,
    data: {
      contests: paginatedContests,
      total,
      page,
      limit,
      totalPages
    }
  };
}

export async function getContest(id: string): Promise<ApiResponse<Contest>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const contest = mockContests.find(c => c.id === id);

  if (!contest) {
    return {
      success: false,
      error: 'Contest not found'
    };
  }

  return {
    success: true,
    data: contest
  };
}

export async function registerForContest(
  contestId: string,
  participantId: string,
  participantType: 'team' | 'individual',
  metadata?: any
): Promise<ApiResponse<ContestRegistration>> {
  await new Promise(resolve => setTimeout(resolve, 500));

  const contest = mockContests.find(c => c.id === contestId);
  if (!contest) {
    return {
      success: false,
      error: 'Contest not found'
    };
  }

  const now = new Date();
  if (new Date(contest.registrationEnd) < now) {
    return {
      success: false,
      error: 'Registration has closed'
    };
  }

  if (contest.maxParticipants && contest.participantCount >= contest.maxParticipants) {
    return {
      success: false,
      error: 'Contest is full'
    };
  }

  const newRegistration: ContestRegistration = {
    id: `reg-${Date.now()}`,
    contestId,
    participantId,
    participantType,
    participantName: participantType === 'team' ? 'Team Name' : 'Individual Name',
    registeredAt: new Date().toISOString(),
    status: 'registered',
    metadata
  };

  mockRegistrations.push(newRegistration);

  // Update contest participant count
  const contestIndex = mockContests.findIndex(c => c.id === contestId);
  if (contestIndex !== -1) {
    const targetContest = mockContests[contestIndex];
    if (targetContest) {
      targetContest.participantCount++;
      if (participantType === 'team') {
        targetContest.teamCount++;
      } else {
        targetContest.individualCount++;
      }
    }
  }

  return {
    success: true,
    data: newRegistration
  };
}

export async function unregisterFromContest(
  contestId: string,
  participantId: string
): Promise<ApiResponse<void>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const registrationIndex = mockRegistrations.findIndex(reg => 
    reg.contestId === contestId && reg.participantId === participantId
  );

  if (registrationIndex === -1) {
    return {
      success: false,
      error: 'Registration not found'
    };
  }

  const registration = mockRegistrations[registrationIndex];
  mockRegistrations.splice(registrationIndex, 1);

  // Update contest participant count
  const contestIndex = mockContests.findIndex(c => c.id === contestId);
  if (contestIndex !== -1) {
    const targetContest = mockContests[contestIndex];
    if (targetContest && registration) {
      targetContest.participantCount--;
      if (registration.participantType === 'team') {
        targetContest.teamCount--;
      } else {
        targetContest.individualCount--;
      }
    }
  }

  return {
    success: true,
    data: undefined
  };
}

export async function getLiveLeaderboard(contestId: string): Promise<ApiResponse<LiveLeaderboard>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  // Mock live data - in real app this would come from real-time API
  return {
    success: true,
    data: {
      ...mockLiveLeaderboard,
      contestId,
      lastUpdated: new Date().toISOString()
    }
  };
}

export async function getContestResults(contestId: string): Promise<ApiResponse<ContestResult[]>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock final results
  const mockResults: ContestResult[] = [
    {
      id: "result-001",
      contestId,
      participantId: "team-elite",
      participantName: "Elite Hackers",
      participantType: "team",
      rank: 1,
      score: 8950,
      solves: [
        {
          challengeId: "chall-001",
          challengeName: "Web Admin Panel",
          points: 500,
          solvedAt: "2024-03-12T10:30:00Z",
          timeToSolve: 45
        }
      ],
      country: "US",
      finalRank: 1,
      ratingChange: 156
    }
  ];

  return {
    success: true,
    data: mockResults
  };
}

export async function getUserRegistrations(userId: string): Promise<ApiResponse<ContestRegistration[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const userRegistrations = mockRegistrations.filter(reg => 
    reg.participantId === userId
  );

  return {
    success: true,
    data: userRegistrations
  };
}

export async function getUpcomingContests(limit = 5): Promise<ApiResponse<Contest[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const now = new Date();
  const upcoming = mockContests
    .filter(contest => new Date(contest.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, limit);

  return {
    success: true,
    data: upcoming
  };
}

export async function getLiveContests(): Promise<ApiResponse<Contest[]>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const now = new Date();
  const live = mockContests.filter(contest => 
    new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
  );

  return {
    success: true,
    data: live
  };
}
