import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  User,
  ListTeamsDto,
  CreateTeamDto,
  TeamsResponse,
  ListContestsDto,
  CreateContestDto,
  ContestsResponse,
  ApiResponse,
} from '@/types/api'

class ApiClient {
  private api: AxiosInstance
  private token: string | null = null

  constructor(baseURL: string = '/api') {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken()
          // Redirect to login or emit auth error event
        }
        return Promise.reject(error)
      }
    )

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        this.setToken(savedToken)
      }
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  getToken() {
    return this.token
  }

  // Auth endpoints
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials)
    const { user, token } = response.data
    this.setToken(token)
    return { user, token }
  }

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', userData)
    const { user, token } = response.data
    this.setToken(token)
    return { user, token }
  }

  async me(): Promise<User> {
    const response = await this.api.get<{ user: User }>('/auth/me')
    return response.data.user
  }

  async logout() {
    this.clearToken()
    // Could also call a logout endpoint if it exists
  }

  // Teams endpoints
  async getTeams(params?: ListTeamsDto): Promise<TeamsResponse> {
    const response = await this.api.get<TeamsResponse>('/teams/list', { params })
    return response.data
  }

  async getTeam(teamId: number): Promise<{ team: Team }> {
    const response = await this.api.get<{ team: Team }>(`/teams/${teamId}`)
    return response.data
  }

  async createTeam(teamData: CreateTeamDto): Promise<{ team: Team }> {
    const response = await this.api.post<{ team: Team }>('/teams/create', teamData)
    return response.data
  }

  async verifyTeam(teamId: number): Promise<{ success: boolean }> {
    const response = await this.api.post<{ success: boolean }>('/teams/verify', { teamId })
    return response.data
  }

  // Contests endpoints
  async getContests(params?: ListContestsDto): Promise<ContestsResponse> {
    const response = await this.api.get<ContestsResponse>('/contests/list', { params })
    return response.data
  }

  async getContest(contestId: number): Promise<{ contest: Contest }> {
    const response = await this.api.get<{ contest: Contest }>(`/contests/${contestId}`)
    return response.data
  }

  async createContest(contestData: CreateContestDto): Promise<{ contest: Contest }> {
    const response = await this.api.post<{ contest: Contest }>('/contests/create', contestData)
    return response.data
  }

  async rateContest(contestId: number, rating: number): Promise<{ success: boolean }> {
    const response = await this.api.post<{ success: boolean }>(`/contests/${contestId}/rate`, { rating })
    return response.data
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient()
export default apiClient
