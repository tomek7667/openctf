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
    return apiClient.get<PaginatedResponse<Contest>>('/contests/list', {
      params,
      cacheKey: `contests:list:${JSON.stringify(params)}`,
      cacheTTL: 300000, // 5 minutes
    });
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
