/**
 * Unified API Services Export
 * 
 * This file provides a centralized export for all API services,
 * making it easy to import and use throughout the application.
 */

// Export individual services
export { authApi, AuthApiService } from './services/auth';
export { teamsApi, TeamsApiService } from './services/teams';
export { contestsApi, ContestsApiService } from './services/contests';

// Export base client
export { apiClient, ApiClient } from './client';

// Export error types
export {
  ApiClientError,
  ValidationApiError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
} from './client';

// Export types
export type { ApiClientConfig, RequestConfig } from './client';

// Create unified API object for easy access
export const api = {
  auth: authApi,
  teams: teamsApi,
  contests: contestsApi,
  
  // Utility methods
  isHealthy: () => apiClient.healthCheck(),
  cancelAllRequests: () => apiClient.cancelAllRequests(),
  clearCache: () => {
    // Could implement cache clearing logic here
  },
} as const;

// Default export
export default api;

/**
 * API Usage Examples:
 * 
 * // Using individual services
 * import { authApi, teamsApi } from '@/api';
 * const user = await authApi.getCurrentUser();
 * const teams = await teamsApi.getTeams();
 * 
 * // Using unified API object
 * import api from '@/api';
 * const user = await api.auth.getCurrentUser();
 * const teams = await api.teams.getTeams();
 * 
 * // Error handling
 * try {
 *   const teams = await api.teams.getTeams();
 * } catch (error) {
 *   if (error instanceof ValidationApiError) {
 *     // Handle validation errors
 *     console.log(error.validationErrors);
 *   } else if (error instanceof AuthenticationError) {
 *     // Handle auth errors
 *     router.push('/login');
 *   }
 * }
 */
