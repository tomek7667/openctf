import { sleep } from '@/lib/utils'

export interface LeaderboardTeam {
  place: number
  name: string
  country: string
  totalPoints: number
  contestsWon: number
  monthlyPoints: number
  isVerified: boolean
  members: number
}

export const leaderboardApi = {
  /**
   * Get top teams leaderboard
   */
  getTopTeams: async (limit: number = 10): Promise<LeaderboardTeam[]> => {
    // TODO: add backend logic here
    await sleep(1000) // Simulate network delay
    
    // Simulate potential API failure
    if (Math.random() < 0.1) {
      throw new Error('Failed to fetch leaderboard data. Network connection error.')
    }
    
    const mockTeamData: LeaderboardTeam[] = [
      { place: 1, name: "r3kapig", country: "CN", totalPoints: 1020.905, contestsWon: 5, monthlyPoints: 250.3, isVerified: true, members: 8 },
      { place: 2, name: "Kalmarunionen", country: "DK", totalPoints: 985.563, contestsWon: 4, monthlyPoints: 210.8, isVerified: true, members: 6 },
      { place: 3, name: "Infobahn", country: "DE", totalPoints: 872.674, contestsWon: 3, monthlyPoints: 195.2, isVerified: true, members: 7 },
      { place: 4, name: "team:placeholder", country: "US", totalPoints: 849.042, contestsWon: 2, monthlyPoints: 180.5, isVerified: true, members: 5 },
      { place: 5, name: "Project Sekai", country: "JP", totalPoints: 813.723, contestsWon: 3, monthlyPoints: 165.9, isVerified: true, members: 9 },
      { place: 6, name: "justCatTheFish", country: "PL", totalPoints: 783.644, contestsWon: 2, monthlyPoints: 145.3, isVerified: true, members: 4 },
      { place: 7, name: "thehackerscrew", country: "IN", totalPoints: 765.696, contestsWon: 1, monthlyPoints: 135.7, isVerified: false, members: 6 },
      { place: 8, name: "The Flat Network Society", country: "FR", totalPoints: 725.351, contestsWon: 2, monthlyPoints: 125.8, isVerified: true, members: 5 },
      { place: 9, name: "L3ak", country: "US", totalPoints: 716.831, contestsWon: 1, monthlyPoints: 118.4, isVerified: false, members: 3 },
      { place: 10, name: "Never Stop Exploiting", country: "CN", totalPoints: 708.169, contestsWon: 1, monthlyPoints: 112.6, isVerified: true, members: 7 },
      { place: 11, name: "EPITA Reverse Engineering", country: "FR", totalPoints: 695.234, contestsWon: 1, monthlyPoints: 98.7, isVerified: true, members: 8 },
      { place: 12, name: "organizers", country: "KR", totalPoints: 678.912, contestsWon: 2, monthlyPoints: 87.4, isVerified: true, members: 4 },
      { place: 13, name: "perfect blue", country: "US", totalPoints: 654.789, contestsWon: 1, monthlyPoints: 76.2, isVerified: true, members: 6 },
      { place: 14, name: "Shellphish", country: "US", totalPoints: 631.456, contestsWon: 0, monthlyPoints: 65.8, isVerified: true, members: 7 },
      { place: 15, name: "WreckTheLine", country: "SG", totalPoints: 608.123, contestsWon: 1, monthlyPoints: 54.9, isVerified: false, members: 5 },
    ]
    
    return mockTeamData.slice(0, limit)
  }
}

export default leaderboardApi
