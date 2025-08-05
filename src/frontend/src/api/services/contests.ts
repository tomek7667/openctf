import BaseApiClient from '../client'
import type { 
  ListContestsDto, 
  CreateContestDto, 
  Contest, 
  ContestsResponse 
} from '@/types/api'

export interface ContestFilters extends ListContestsDto {
  searchTerm?: string
  status?: 'upcoming' | 'ongoing' | 'finished'
  year?: number
  sortBy?: 'name' | 'start' | 'end' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface ContestRating {
  difficulty: number // 1-5
  quality: number // 1-5
  comment?: string
}

export class ContestsApiService extends BaseApiClient {
  async getContests(params?: ContestFilters): Promise<ContestsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString())
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params?.searchTerm) {
      queryParams.append('search', params.searchTerm)
    }
    if (params?.status) {
      queryParams.append('status', params.status)
    }
    if (params?.year) {
      queryParams.append('year', params.year.toString())
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy)
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder)
    }

    const url = `/contests/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.get<ContestsResponse>(url)
  }

  async getContest(contestId: number): Promise<{ contest: Contest }> {
    return this.get<{ contest: Contest }>(`/contests/${contestId}`)
  }

  async createContest(contestData: CreateContestDto): Promise<{ contest: Contest }> {
    return this.post<{ contest: Contest }>('/contests/create', contestData)
  }

  async updateContest(contestId: number, contestData: Partial<CreateContestDto>): Promise<{ contest: Contest }> {
    return this.put<{ contest: Contest }>(`/contests/${contestId}`, contestData)
  }

  async deleteContest(contestId: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/contests/${contestId}`)
  }

  async rateContest(contestId: number, rating: ContestRating): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`/contests/${contestId}/rate`, rating)
  }

  async getContestRatings(contestId: number): Promise<{ ratings: ContestRating[] }> {
    return this.get<{ ratings: ContestRating[] }>(`/contests/${contestId}/ratings`)
  }

  async getContestLeaderboard(contestId: number): Promise<{ leaderboard: any[] }> {
    return this.get<{ leaderboard: any[] }>(`/contests/${contestId}/leaderboard`)
  }

  async registerForContest(contestId: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`/contests/${contestId}/register`)
  }

  async unregisterFromContest(contestId: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/contests/${contestId}/register`)
  }

  async getUpcomingContests(): Promise<{ contests: Contest[] }> {
    return this.get<{ contests: Contest[] }>('/contests/upcoming')
  }

  async getOngoingContests(): Promise<{ contests: Contest[] }> {
    return this.get<{ contests: Contest[] }>('/contests/ongoing')
  }
}

export const contestsApi = new ContestsApiService()
