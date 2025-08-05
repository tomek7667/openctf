/**
 * Teams API Service
 * 
 * Handles all team-related API calls including:
 * - Team CRUD operations
 * - Team member management
 * - Team statistics and rankings
 * - Team verification and moderation
 */

import { apiClient } from '../client';
import type {
  Team,
  ListTeamsDto,
  CreateTeamDto,
  VerifyTeamDto,
  MergeTeamsDto,
  PaginatedResponse,
  TeamStats,
  TeamMember,
  User,
  FilterOptions,
} from '@/types/api';

export class TeamsApiService {
  /**
   * Get paginated list of teams with filtering and sorting
   */
  async getTeams(params?: ListTeamsDto): Promise<PaginatedResponse<Team>> {
    return apiClient.get<PaginatedResponse<Team>>('/teams/list', {
      params,
      cacheKey: `teams:list:${JSON.stringify(params)}`,
      cacheTTL: 300000, // 5 minutes
    });
  }

  /**
   * Get specific team by ID
   */
  async getTeam(teamId: number): Promise<Team> {
    return apiClient.get<Team>(`/teams/${teamId}`, {
      cacheKey: `team:${teamId}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Create new team
   */
  async createTeam(teamData: CreateTeamDto): Promise<Team> {
    const formData = new FormData();
    
    // Handle file upload for logo
    if (teamData.logo instanceof File) {
      formData.append('logo', teamData.logo);
      const { logo, ...restData } = teamData;
      Object.entries(restData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      return apiClient.post<Team>('/teams/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    return apiClient.post<Team>('/teams/create', teamData);
  }

  /**
   * Update team information
   */
  async updateTeam(teamId: number, teamData: Partial<CreateTeamDto>): Promise<Team> {
    const formData = new FormData();
    
    if (teamData.logo instanceof File) {
      formData.append('logo', teamData.logo);
      const { logo, ...restData } = teamData;
      Object.entries(restData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      return apiClient.put<Team>(`/teams/${teamId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    return apiClient.put<Team>(`/teams/${teamId}`, teamData);
  }

  /**
   * Delete team (captain only)
   */
  async deleteTeam(teamId: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/teams/${teamId}`);
  }

  /**
   * Verify team (moderator/admin only)
   */
  async verifyTeam(data: VerifyTeamDto): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/teams/verify', data);
  }

  /**
   * Merge two teams (captain of both teams required)
   */
  async mergeTeams(data: MergeTeamsDto): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/teams/merge', data);
  }

  /**
   * Get team statistics
   */
  async getTeamStats(teamId: number): Promise<TeamStats> {
    return apiClient.get<TeamStats>(`/teams/${teamId}/stats`, {
      cacheKey: `team:${teamId}:stats`,
      cacheTTL: 600000, // 10 minutes
    });
  }

  /**
   * Get team members
   */
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return apiClient.get<TeamMember[]>(`/teams/${teamId}/members`, {
      cacheKey: `team:${teamId}:members`,
      cacheTTL: 300000,
    });
  }

  /**
   * Invite user to team
   */
  async inviteTeamMember(teamId: number, userId: number, message?: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/${teamId}/members/invite`, {
      userId,
      message,
    });
  }

  /**
   * Remove team member
   */
  async removeTeamMember(teamId: number, userId: number): Promise<{ success: boolean }> {
    return apiClient.delete<{ success: boolean }>(`/teams/${teamId}/members/${userId}`);
  }

  /**
   * Transfer team ownership
   */
  async transferOwnership(teamId: number, newCaptainId: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/${teamId}/transfer`, {
      newCaptainId,
    });
  }

  /**
   * Accept team invitation
   */
  async acceptTeamInvitation(invitationId: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/invitations/${invitationId}/accept`);
  }

  /**
   * Decline team invitation
   */
  async declineTeamInvitation(invitationId: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/invitations/${invitationId}/decline`);
  }

  /**
   * Get team invitations for current user
   */
  async getTeamInvitations(): Promise<Array<{
    id: number;
    team: Team;
    invitedBy: User;
    message?: string;
    createdAt: string;
  }>> {
    return apiClient.get<Array<{
      id: number;
      team: Team;
      invitedBy: User;
      message?: string;
      createdAt: string;
    }>>('/teams/invitations');
  }

  /**
   * Join public team
   */
  async joinTeam(teamId: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/${teamId}/join`);
  }

  /**
   * Leave team
   */
  async leaveTeam(teamId: number): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/${teamId}/leave`);
  }

  /**
   * Get team rankings/leaderboard
   */
  async getTeamRankings(params?: {
    year?: number;
    country?: string;
    limit?: number;
    category?: string;
  }): Promise<Array<Team & { rank: number }>> {
    return apiClient.get<Array<Team & { rank: number }>>('/teams/rankings', {
      params,
      cacheKey: `teams:rankings:${JSON.stringify(params)}`,
      cacheTTL: 600000,
    });
  }

  /**
   * Get filter options for teams (countries, years, etc.)
   */
  async getFilterOptions(): Promise<FilterOptions> {
    return apiClient.get<FilterOptions>('/teams/filters', {
      cacheKey: 'teams:filters',
      cacheTTL: 3600000, // 1 hour
    });
  }

  /**
   * Search teams by name
   */
  async searchTeams(query: string, limit: number = 10): Promise<Team[]> {
    return apiClient.get<Team[]>('/teams/search', {
      params: { q: query, limit },
      cacheKey: `teams:search:${query}:${limit}`,
      cacheTTL: 300000,
    });
  }

  /**
   * Get teams by CTFtime ID
   */
  async getTeamsByCtfTimeId(ctftimeId: number): Promise<Team[]> {
    return apiClient.get<Team[]>('/teams/ctftime', {
      params: { ctftimeId },
    });
  }

  /**
   * Sync team data with CTFtime
   */
  async syncWithCtfTime(teamId: number): Promise<{ success: boolean; changes?: string[] }> {
    return apiClient.post<{ success: boolean; changes?: string[] }>(`/teams/${teamId}/sync-ctftime`);
  }

  /**
   * Get team activity feed
   */
  async getTeamActivity(teamId: number, limit: number = 20): Promise<Array<{
    id: number;
    type: string;
    description: string;
    timestamp: string;
    data?: Record<string, unknown>;
  }>> {
    return apiClient.get<Array<{
      id: number;
      type: string;
      description: string;
      timestamp: string;
      data?: Record<string, unknown>;
    }>>(`/teams/${teamId}/activity`, {
      params: { limit },
      cacheKey: `team:${teamId}:activity:${limit}`,
      cacheTTL: 180000, // 3 minutes
    });
  }

  /**
   * Report team for inappropriate content
   */
  async reportTeam(teamId: number, reason: string, description?: string): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(`/teams/${teamId}/report`, {
      reason,
      description,
    });
  }

  /**
   * Get team's contest history
   */
  async getTeamContestHistory(teamId: number, limit: number = 50): Promise<Array<{
    contest: {
      id: number;
      name: string;
      start: string;
      end: string;
    };
    rank: number;
    points: number;
    solves: number;
  }>> {
    return apiClient.get<Array<{
      contest: {
        id: number;
        name: string;
        start: string;
        end: string;
      };
      rank: number;
      points: number;
      solves: number;
    }>>(`/teams/${teamId}/contests`, {
      params: { limit },
      cacheKey: `team:${teamId}:contests:${limit}`,
      cacheTTL: 600000,
    });
  }

  /**
   * Generate team join token for invites
   */
  async generateJoinToken(teamId: number, expiresIn: string = '7d'): Promise<{ token: string; expiresAt: string }> {
    return apiClient.post<{ token: string; expiresAt: string }>(`/teams/${teamId}/join-token`, {
      expiresIn,
    });
  }

  /**
   * Join team using join token
   */
  async joinTeamWithToken(token: string): Promise<{ success: boolean; team: Team }> {
    return apiClient.post<{ success: boolean; team: Team }>('/teams/join-with-token', {
      token,
    });
  }
}

// Export singleton instance
export const teamsApi = new TeamsApiService();
export default teamsApi;
