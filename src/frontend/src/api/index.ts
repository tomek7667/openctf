// Export all API services
export { authApi, AuthApiService } from './services/auth'
export { teamsApi, TeamsApiService } from './services/teams'
export { contestsApi, ContestsApiService } from './services/contests'

// Export base client for extension
export { default as BaseApiClient } from './client'
export type { ApiConfig, ApiResponse } from './client'

// Create a unified API object for easy access
export const api = {
  auth: authApi,
  teams: teamsApi,
  contests: contestsApi,
}

export default api
