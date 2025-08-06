/**
 * Contests API Service
 * 
 * Handles all contest-related API calls including:
 * - Contest CRUD operations
 * - Contest registration and participation
 * - Contest ratings and reviews
 * - Contest statistics and leaderboards
 */

import { apiClient } from '../client';
import { sleep } from '@/lib/utils';
import type {
  Contest,
  ListContestsDto,
  CreateContestDto,
  RateContestDto,
  PaginatedResponse,
  ContestStats,
  ContestPlacement,
  ContestStatus,
  CTFCategory,
} from '@/types/api';

export class ContestsApiService {
  /**
   * Get paginated list of contests with filtering and sorting
   */
  async getContests(params?: ListContestsDto): Promise<PaginatedResponse<Contest>> {
    // TODO: add backend logic here
    await sleep(1000); // Simulate network delay

    // Mock contests data matching actual schema
    const mockContests: Contest[] = [
      // Ongoing Contest
      {
        id: 1,
        name: "cybersec-challenge-2025",
        description: "International cybersecurity competition featuring advanced exploitation challenges",
        rules: "Team-based competition with maximum 4 members per team",
        prizes: "$10,000 for first place, $5,000 for second, $2,500 for third",
        start: "2025-01-15T14:00:00Z",
        end: "2025-01-17T14:00:00Z",
        url: "https://cybersec.example.com",
        ctftimeId: 2847,
        assignedWeightPoints: 85,
        status: "ongoing" as ContestStatus,
        duration: 48,
        participantCount: 287,
        averageRating: 4.5,
        totalRatings: 156,
        places: [],
        createdAt: "2024-12-01T10:00:00Z",
        updatedAt: "2025-01-15T14:00:00Z"
      },

      // Upcoming Contest
      {
        id: 2,
        name: "university-ctf-2025",
        description: "Annual university-level competition with beginner-friendly challenges and educational content",
        start: "2025-02-10T16:00:00Z",
        end: "2025-02-12T16:00:00Z",
        url: "https://uni-ctf.example.com",
        assignedWeightPoints: 35,
        status: "upcoming" as ContestStatus,
        duration: 48,
        participantCount: 0,
        averageRating: undefined,
        totalRatings: 0,
        places: [],
        createdAt: "2024-12-15T10:00:00Z",
        updatedAt: "2024-12-15T10:00:00Z"
      },

      // Finished Contest
      {
        id: 3,
        name: "bsidessf-2024-ctf",
        description: "Annual BSides San Francisco Capture The Flag competition with industry-standard challenges",
        start: "2024-05-18T18:00:00Z",
        end: "2024-05-20T06:00:00Z",
        url: "https://bsidessf.org/ctf",
        ctftimeId: 2456,
        assignedWeightPoints: 75,
        status: "finished" as ContestStatus,
        duration: 36,
        participantCount: 342,
        averageRating: 4.3,
        totalRatings: 189,
        places: [],
        createdAt: "2024-04-15T10:00:00Z",
        updatedAt: "2024-05-20T06:30:00Z"
      },

      // Another Finished Contest
      {
        id: 4,
        name: "picoctf-2024",
        description: "Educational CTF for beginners and advanced players alike, featuring progressive difficulty levels",
        start: "2024-03-12T12:00:00Z",
        end: "2024-03-26T12:00:00Z",
        url: "https://picoctf.org",
        ctftimeId: 2234,
        assignedWeightPoints: 25,
        status: "finished" as ContestStatus,
        duration: 336, // 2 weeks
        participantCount: 8934,
        averageRating: 4.6,
        totalRatings: 1247,
        places: [],
        createdAt: "2024-02-20T09:00:00Z",
        updatedAt: "2024-03-26T14:00:00Z"
      },

      // Another Upcoming Contest
      {
        id: 5,
        name: "global-hack-week-ctf",
        description: "Week-long global cybersecurity challenge with 24/7 support and live streams",
        start: "2025-03-15T00:00:00Z",
        end: "2025-03-22T23:59:59Z",
        url: "https://globalhack.example.com",
        assignedWeightPoints: 60,
        status: "upcoming" as ContestStatus,
        duration: 192, // 1 week
        participantCount: 0,
        averageRating: undefined,
        totalRatings: 0,
        places: [],
        createdAt: "2024-12-20T10:00:00Z",
        updatedAt: "2024-12-20T10:00:00Z"
      }
    ];

    const offset = params?.offset || 0;
    const limit = params?.limit || 20;
    const total = 45; // Total mock contests

    const paginatedContests = mockContests.slice(offset, offset + limit);

    return {
      items: paginatedContests,
      pagination: {
        offset,
        limit,
        total,
        hasNext: offset + limit < total,
        hasPrev: offset > 0,
        totalPages: Math.ceil(total / limit),
        currentPage: Math.floor(offset / limit)
      }
    };
  }

  /**
   * Get specific contest by ID
   */
  async getContest(contestId: number): Promise<Contest> {
    return apiClient.get<Contest>(`/contests/${contestId}`, {
      cacheKey: `contest:${contestId}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Create new contest (team captain only)
   */
  async createContest(contestData: CreateContestDto): Promise<Contest> {
    return apiClient.post<Contest>('/contests/create', contestData);
  }

  /**
   * Update contest information
   */
  async updateContest(contestId: number, contestData: Partial<CreateContestDto>): Promise<Contest> {
    return apiClient.put<Contest>(`/contests/${contestId}`, contestData);
  }

  /**
   * Delete contest
   */
  async deleteContest(contestId: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/contests/${contestId}`);
  }

  /**
   * Rate contest (participants only)
   */
  async rateContest(data: RateContestDto): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/contests/${data.contestId}/rate`, {
      difficulty: data.difficulty,
      quality: data.quality,
      comment: data.comment,
    });
  }

  /**
   * Get contest statistics
   */
  async getContestStats(contestId: number): Promise<ContestStats> {
    return apiClient.get<ContestStats>(`/contests/${contestId}/stats`, {
      cacheKey: `contest:${contestId}:stats`,
      cacheTTL: 600000, // 10 minutes
    });
  }

  /**
   * Get contest leaderboard/placements
   */
  async getContestLeaderboard(contestId: number, limit: number = 100): Promise<ContestPlacement[]> {
    return apiClient.get<ContestPlacement[]>(`/contests/${contestId}/leaderboard`, {
      params: { limit },
      cacheKey: `contest:${contestId}:leaderboard:${limit}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Register team for contest
   */
  async registerForContest(contestId: number, teamId?: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/contests/${contestId}/register`, {
      teamId,
    });
  }

  /**
   * Unregister team from contest
   */
  async unregisterFromContest(contestId: number, teamId?: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/contests/${contestId}/register`, {
      data: { teamId },
    });
  }

  /**
   * Check if team is registered for contest
   */
  async isRegistered(contestId: number, teamId?: number): Promise<{ registered: boolean }> {
    return apiClient.get<{ registered: boolean }>(`/contests/${contestId}/registration-status`, {
      params: { teamId },
    });
  }

  /**
   * Get contest participants
   */
  async getContestParticipants(contestId: number): Promise<Array<{
    team: {
      id: number;
      name: string;
      country?: string;
      logo?: string;
    };
    registeredAt: string;
  }>> {
    return apiClient.get<Array<{
      team: {
        id: number;
        name: string;
        country?: string;
        logo?: string;
      };
      registeredAt: string;
    }>>(`/contests/${contestId}/participants`, {
      cacheKey: `contest:${contestId}:participants`,
      cacheTTL: 300000,
    });
  }

  /**
   * Get upcoming contests
   */
  async getUpcomingContests(limit: number = 10): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/upcoming', {
      params: { limit },
      cacheKey: `contests:upcoming:${limit}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Get ongoing contests
   */
  async getOngoingContests(): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/ongoing', {
      cacheKey: 'contests:ongoing',
      cacheTTL: 180000, // 3 minutes
    });
  }

  /**
   * Get finished contests
   */
  async getFinishedContests(limit: number = 20): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/finished', {
      params: { limit },
      cacheKey: `contests:finished:${limit}`,
      cacheTTL: 600000,
    });
  }

  /**
   * Search contests by name
   */
  async searchContests(query: string, limit: number = 10): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/search', {
      params: { q: query, limit },
      cacheKey: `contests:search:${query}:${limit}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Get contests by category
   */
  async getContestsByCategory(category: CTFCategory, limit: number = 20): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/by-category', {
      params: { category, limit },
      cacheKey: `contests:category:${category}:${limit}`,
      cacheTTL: 600000,
    });
  }

  /**
   * Get contest ratings and reviews
   */
  async getContestRatings(contestId: number): Promise<Array<{
    id: number;
    difficulty: number;
    quality: number;
    comment?: string;
    author: {
      username: string;
      avatar?: string;
    };
    createdAt: string;
  }>> {
    return apiClient.get<Array<{
      id: number;
      difficulty: number;
      quality: number;
      comment?: string;
      author: {
        username: string;
        avatar?: string;
      };
      createdAt: string;
    }>>(`/contests/${contestId}/ratings`, {
      cacheKey: `contest:${contestId}:ratings`,
      cacheTTL: 600000,
    });
  }

  /**
   * Get contest writeups
   */
  async getContestWriteups(contestId: number): Promise<Array<{
    id: number;
    title: string;
    author: {
      username: string;
      team?: string;
    };
    url: string;
    createdAt: string;
    views: number;
    likes: number;
  }>> {
    return apiClient.get<Array<{
      id: number;
      title: string;
      author: {
        username: string;
        team?: string;
      };
      url: string;
      createdAt: string;
      views: number;
      likes: number;
    }>>(`/contests/${contestId}/writeups`, {
      cacheKey: `contest:${contestId}:writeups`,
      cacheTTL: 600000,
    });
  }

  /**
   * Submit contest writeup
   */
  async submitWriteup(contestId: number, data: {
    title: string;
    url: string;
    description?: string;
  }): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/contests/${contestId}/writeups`, data);
  }

  /**
   * Get contest timeline/events
   */
  async getContestTimeline(contestId: number): Promise<Array<{
    id: number;
    type: 'start' | 'end' | 'solve' | 'announcement';
    description: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }>> {
    return apiClient.get<Array<{
      id: number;
      type: 'start' | 'end' | 'solve' | 'announcement';
      description: string;
      timestamp: string;
      data?: Record<string, unknown>;
    }>>(`/contests/${contestId}/timeline`, {
      cacheKey: `contest:${contestId}:timeline`,
      cacheTTL: 180000,
    });
  }

  /**
   * Get contest challenges (if available)
   */
  async getContestChallenges(contestId: number): Promise<Array<{
    id: number;
    name: string;
    category: CTFCategory;
    points: number;
    solves: number;
    description?: string;
  }>> {
    return apiClient.get<Array<{
      id: number;
      name: string;
      category: CTFCategory;
      points: number;
      solves: number;
      description?: string;
    }>>(`/contests/${contestId}/challenges`, {
      cacheKey: `contest:${contestId}:challenges`,
      cacheTTL: 300000,
    });
  }

  /**
   * Import contest from CTFtime
   */
  async importFromCtfTime(ctftimeId: number): Promise<Contest> {
    return apiClient.post<Contest>('/contests/import-ctftime', {
      ctftimeId,
    });
  }

  /**
   * Sync contest data with CTFtime
   */
  async syncWithCtfTime(contestId: number): Promise<{ success: boolean; changes?: string[] }> {
    return apiClient.post<{ success: boolean; changes?: string[] }>(`/contests/${contestId}/sync-ctftime`);
  }

  /**
   * Get recommended contests for user/team
   */
  async getRecommendedContests(limit: number = 10): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/recommended', {
      params: { limit },
      cacheKey: `contests:recommended:${limit}`,
      cacheTTL: 3600000, // 1 hour
    });
  }

  /**
   * Follow/unfollow contest for notifications
   */
  async toggleContestFollow(contestId: number, follow: boolean): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/contests/${contestId}/follow`, {
      follow,
    });
  }

  /**
   * Get user's followed contests
   */
  async getFollowedContests(): Promise<Contest[]> {
    return apiClient.get<Contest[]>('/contests/followed', {
      cacheKey: 'contests:followed',
      cacheTTL: 300000,
    });
  }

  /**
   * Report contest for inappropriate content
   */
  async reportContest(contestId: number, reason: string, description?: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/contests/${contestId}/report`, {
      reason,
      description,
    });
  }
}

// Export singleton instance
export const contestsApi = new ContestsApiService();
export default contestsApi;
