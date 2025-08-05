import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Team, ListTeamsDto, CreateTeamDto } from '@/types/api'
import { teamsApi } from '@/api'

interface TeamsState {
  teams: Team[]
  currentTeam: Team | null
  isLoading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  limit: number
  filters: {
    countryCodes: string[]
    searchTerm: string
    year?: number
  }
  availableCountries: string[]
}

interface TeamsActions {
  fetchTeams: (params?: Partial<ListTeamsDto>) => Promise<void>
  fetchTeam: (teamId: number) => Promise<void>
  createTeam: (teamData: CreateTeamDto) => Promise<Team>
  verifyTeam: (teamId: number) => Promise<void>
  setFilters: (filters: Partial<TeamsState['filters']>) => void
  setCurrentPage: (page: number) => void
  setLimit: (limit: number) => void
  clearError: () => void
  reset: () => void
}

type TeamsStore = TeamsState & TeamsActions

export const useTeamsStore = create<TeamsStore>()(
  immer((set, get) => ({
    // State
    teams: [],
    currentTeam: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 0,
    limit: 30,
    filters: {
      countryCodes: [],
      searchTerm: '',
    },
    availableCountries: [],

    // Actions
    fetchTeams: async (params) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const { filters, currentPage, limit } = get()
        
        const queryParams: ListTeamsDto = {
          offset: currentPage * limit,
          limit,
          countryCodes: filters.countryCodes.length > 0 ? filters.countryCodes : undefined,
          ...params,
        }

        const response = await teamsApi.getTeams(queryParams)
        
        set((state) => {
          state.teams = response.teams || []
          state.totalCount = response.total || 0
          state.isLoading = false
        })
      } catch (error: any) {
        set((state) => {
          state.error = error.response?.data?.message || 'Failed to fetch teams'
          state.isLoading = false
        })
      }
    },

    fetchTeam: async (teamId: number) => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await teamsApi.getTeam(teamId)
        
        set((state) => {
          state.currentTeam = response.team
          state.isLoading = false
        })
      } catch (error: any) {
        set((state) => {
          state.error = error.response?.data?.message || 'Failed to fetch team'
          state.isLoading = false
        })
      }
    },

    createTeam: async (teamData: CreateTeamDto): Promise<Team> => {
      set((state) => {
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await teamsApi.createTeam(teamData)
        
        set((state) => {
          state.teams.unshift(response.team)
          state.isLoading = false
        })

        return response.team
      } catch (error: any) {
        set((state) => {
          state.error = error.response?.data?.message || 'Failed to create team'
          state.isLoading = false
        })
        throw error
      }
    },

    verifyTeam: async (teamId: number) => {
      try {
        await teamsApi.verifyTeam(teamId)
        
        set((state) => {
          const teamIndex = state.teams.findIndex(team => team.id === teamId)
          if (teamIndex !== -1) {
            state.teams[teamIndex].verified = true
          }
          
          if (state.currentTeam?.id === teamId) {
            state.currentTeam.verified = true
          }
        })
      } catch (error: any) {
        set((state) => {
          state.error = error.response?.data?.message || 'Failed to verify team'
        })
        throw error
      }
    },

    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters }
        state.currentPage = 0 // Reset to first page when filters change
      })

      // Automatically fetch teams with new filters
      get().fetchTeams()
    },

    setCurrentPage: (page: number) => {
      set((state) => {
        state.currentPage = page
      })

      get().fetchTeams()
    },

    setLimit: (limit: number) => {
      set((state) => {
        state.limit = limit
        state.currentPage = 0
      })

      get().fetchTeams()
    },

    clearError: () => {
      set((state) => {
        state.error = null
      })
    },

    reset: () => {
      set((state) => {
        state.teams = []
        state.currentTeam = null
        state.error = null
        state.totalCount = 0
        state.currentPage = 0
        state.filters = {
          countryCodes: [],
          searchTerm: '',
        }
      })
    },
  }))
)
