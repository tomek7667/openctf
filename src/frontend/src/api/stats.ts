import { sleep } from '@/lib/utils'

export interface PlatformStats {
  rankedTeams: number
  teamMembers: number
  activeContests: number
  pastEvents: number
}

export const statsApi = {
  /**
   * Get platform statistics
   */
  getPlatformStats: async (): Promise<PlatformStats> => {
    // TODO: add backend logic here
    await sleep(1000) // Simulate network delay
    
    // Simulate potential API failure
    const random = Math.random()
    if (random < 0.05) {
      throw new Error('Network timeout while fetching statistics. Please check your connection.')
    } else if (random < 0.1) {
      throw new Error('Statistics service temporarily unavailable. Please try again in a moment.')
    }
    
    return {
      rankedTeams: 142,
      teamMembers: 1247,
      activeContests: 23,
      pastEvents: 15
    }
  }
}

export default statsApi
