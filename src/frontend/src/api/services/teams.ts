import BaseApiClient from '../client'
import type { 
  ListTeamsDto, 
  CreateTeamDto, 
  Team, 
  TeamsResponse 
} from '@/types/api'

export interface TeamFilters extends ListTeamsDto {
  searchTerm?: string
  year?: number
  verified?: boolean
  sortBy?: 'name' | 'points' | 'rank' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export class TeamsApiService extends BaseApiClient {
  async getTeams(params?: TeamFilters): Promise<TeamsResponse> {
    const queryParams = new URLSearchParams()
    
    if (params?.offset !== undefined) {
      queryParams.append('offset', params.offset.toString())
    }
    if (params?.limit !== undefined) {
      queryParams.append('limit', params.limit.toString())
    }
    if (params?.countryCodes?.length) {
      params.countryCodes.forEach(code => {
        queryParams.append('countryCodes', code)
      })
    }
    if (params?.searchTerm) {
      queryParams.append('search', params.searchTerm)
    }
    if (params?.year) {
      queryParams.append('year', params.year.toString())
    }
    if (params?.verified !== undefined) {
      queryParams.append('verified', params.verified.toString())
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy)
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder)
    }

    const url = `/teams/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return this.get<TeamsResponse>(url)
  }

  async getTeam(teamId: number): Promise<{ team: Team }> {
    return this.get<{ team: Team }>(`/teams/${teamId}`)
  }

  async createTeam(teamData: CreateTeamDto): Promise<{ team: Team }> {
    return this.post<{ team: Team }>('/teams/create', teamData)
  }

  async updateTeam(teamId: number, teamData: Partial<CreateTeamDto>): Promise<{ team: Team }> {
    return this.put<{ team: Team }>(`/teams/${teamId}`, teamData)
  }

  async verifyTeam(teamId: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>('/teams/verify', { teamId })
  }

  async deleteTeam(teamId: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/teams/${teamId}`)
  }

  async getTeamMembers(teamId: number): Promise<{ members: User[] }> {
    return this.get<{ members: User[] }>(`/teams/${teamId}/members`)
  }

  async addTeamMember(teamId: number, userId: number): Promise<{ success: boolean }> {
    return this.post<{ success: boolean }>(`/teams/${teamId}/members`, { userId })
  }

  async removeTeamMember(teamId: number, userId: number): Promise<{ success: boolean }> {
    return this.delete<{ success: boolean }>(`/teams/${teamId}/members/${userId}`)
  }

  async getCountries(): Promise<{ countries: string[] }> {
    return this.get<{ countries: string[] }>('/teams/countries')
  }

  async getTeamStats(teamId: number): Promise<{ stats: any }> {
    return this.get<{ stats: any }>(`/teams/${teamId}/stats`)
  }
}

export const teamsApi = new TeamsApiService()
