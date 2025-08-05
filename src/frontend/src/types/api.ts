// Auth Types
export interface LoginDto {
  identity: string // username or email
  password: string
}

export interface RegisterDto {
  username: string
  email: string
  password: string
  description: string
}

export interface User {
  id: number
  username: string
  email: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Team Types
export interface ListTeamsDto {
  offset?: number
  limit?: number
  countryCodes?: string[]
}

export interface CreateTeamDto {
  name: string
  description: string
  ctftimeID?: number
  logo?: string // base64 encoded
}

export interface Team {
  id: number
  name: string
  description?: string
  ctftimeID?: number
  logo?: string
  country?: string
  verified?: boolean
  createdAt: string
  updatedAt: string
  // Rating/ranking fields that might be included
  points?: number
  rank?: number
  weeklyChange?: number
}

export interface TeamsResponse {
  teams: Team[]
  total?: number
}

// Contest Types
export interface ListContestsDto {
  offset?: number
  limit?: number
}

export interface CreateContestDto {
  name: string
  description: string
  rules: string
  prizes: string
  start: string // ISO date string
  end: string // ISO date string
  url: string
  ctftimeID?: number
}

export interface Contest {
  id: number
  name: string
  description?: string
  rules?: string
  prizes?: string
  start: string
  end: string
  url?: string
  ctftimeID?: number
  createdAt: string
  updatedAt: string
}

export interface ContestsResponse {
  contests: Contest[]
  total?: number
}

// Generic API Response
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

// Pagination
export interface PaginationParams {
  offset?: number
  limit?: number
}

// Filter options
export interface FilterOptions {
  countries?: string[]
  years?: number[]
}
