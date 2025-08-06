/**
 * Weight Pool API Service
 * 
 * Handles all weight pool related API calls including:
 * - Monthly distribution data
 * - Contest weight history based on actual schema
 * - Weight rating aggregation (difficulty voting)
 * - Contest rating aggregation (quality stars)
 */

import { sleep } from '@/lib/utils';
import { Contest, ContestRating, WeightRating, AggregatedContestsDifficulties } from '@/types/api';

export interface MonthlyDistribution {
  month: string
  year: number
  totalPoints: number
  eligibleContests: number
  distributedPoints: number
  remainingPool: number
}

export interface ContestWeightHistory {
  contest: Contest
  avgDifficulty: number // from WeightRating aggregation
  avgQuality?: number // from ContestRating aggregation  
  totalRatings: number // count of ContestRating
  participants: number // count of Place records
  weightReceived: number // assigned_weight_points from Contest
  eligible: boolean
  reason?: string
}

export interface WeightPoolStats {
  currentMonthPool: number
  distributedThisMonth: number
  eligibleContestsThisMonth: number
  remainingPool: number
}

export class WeightPoolApiService {
  /**
   * Get monthly distribution history
   */
  async getMonthlyDistributions(): Promise<MonthlyDistribution[]> {
    // TODO: implement actual API call to backend
    await sleep(1000);

    return [
      {
        month: 'January',
        year: 2025,
        totalPoints: 100,
        eligibleContests: 3,
        distributedPoints: 85,
        remainingPool: 15
      },
      {
        month: 'December',
        year: 2024,
        totalPoints: 100,
        eligibleContests: 4,
        distributedPoints: 95,
        remainingPool: 5
      },
      {
        month: 'November',
        year: 2024,
        totalPoints: 100,
        eligibleContests: 2,
        distributedPoints: 70,
        remainingPool: 30
      },
      {
        month: 'October',
        year: 2024,
        totalPoints: 100,
        eligibleContests: 5,
        distributedPoints: 100,
        remainingPool: 0
      }
    ];
  }

  /**
   * Get contest weight allocation history
   * Returns contests with their weight ratings and eligibility status
   */
  async getContestWeightHistory(): Promise<ContestWeightHistory[]> {
    // TODO: implement actual API call to backend
    await sleep(1000);

    return [
      // January 2025 contests
      {
        contest: {
          id: 1,
          name: 'cybersec-challenge-2025',
          description: 'International cybersecurity competition featuring advanced exploitation challenges',
          rules: 'Team-based competition with maximum 4 members per team',
          prizes: '$10,000 for first place, $5,000 for second, $2,500 for third',
          start: '2025-01-15T14:00:00Z',
          end: '2025-01-17T14:00:00Z',
          url: 'https://cybersec.example.com',
          ctftimeId: 2847,
          assignedWeightPoints: 35,
          status: 'finished' as any,
          duration: 48,
          participantCount: 287,
          places: [],
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2025-01-17T14:00:00Z'
        },
        avgDifficulty: 85,
        avgQuality: 4.5,
        totalRatings: 156,
        participants: 287,
        weightReceived: 35,
        eligible: true
      },
      {
        contest: {
          id: 6,
          name: 'newyear-ctf-2025',
          description: 'New Year cybersecurity challenge',
          start: '2025-01-05T16:00:00Z',
          end: '2025-01-07T16:00:00Z',
          url: 'https://newyear-ctf.example.com',
          assignedWeightPoints: 30,
          status: 'finished' as any,
          duration: 48,
          participantCount: 156,
          places: [],
          createdAt: '2024-12-15T10:00:00Z',
          updatedAt: '2025-01-07T16:00:00Z'
        },
        avgDifficulty: 70,
        avgQuality: 4.2,
        totalRatings: 89,
        participants: 156,
        weightReceived: 30,
        eligible: true
      },
      {
        contest: {
          id: 7,
          name: 'winter-security-challenge',
          description: 'Winter themed security challenges',
          start: '2025-01-22T12:00:00Z',
          end: '2025-01-24T12:00:00Z',
          assignedWeightPoints: 20,
          status: 'finished' as any,
          duration: 48,
          participantCount: 203,
          places: [],
          createdAt: '2025-01-01T10:00:00Z',
          updatedAt: '2025-01-24T12:00:00Z'
        },
        avgDifficulty: 55,
        avgQuality: 3.8,
        totalRatings: 67,
        participants: 203,
        weightReceived: 20,
        eligible: true
      },
      
      // December 2024 contests
      {
        contest: {
          id: 2,
          name: 'holiday-hacker-ctf',
          description: 'Holiday themed hacking competition',
          start: '2024-12-15T18:00:00Z',
          end: '2024-12-17T18:00:00Z',
          url: 'https://holiday-hacker.example.com',
          ctftimeId: 2456,
          assignedWeightPoints: 25,
          status: 'finished' as any,
          duration: 48,
          participantCount: 342,
          places: [],
          createdAt: '2024-11-15T10:00:00Z',
          updatedAt: '2024-12-17T18:00:00Z'
        },
        avgDifficulty: 65,
        avgQuality: 4.1,
        totalRatings: 189,
        participants: 342,
        weightReceived: 25,
        eligible: true
      },
      {
        contest: {
          id: 8,
          name: 'end-of-year-challenge',
          description: 'Year-end cybersecurity challenges',
          start: '2024-12-28T12:00:00Z',
          end: '2024-12-30T12:00:00Z',
          assignedWeightPoints: 35,
          status: 'finished' as any,
          duration: 48,
          participantCount: 189,
          places: [],
          createdAt: '2024-12-01T10:00:00Z',
          updatedAt: '2024-12-30T12:00:00Z'
        },
        avgDifficulty: 80,
        avgQuality: 4.6,
        totalRatings: 134,
        participants: 189,
        weightReceived: 35,
        eligible: true
      },
      {
        contest: {
          id: 9,
          name: 'christmas-special-ctf',
          description: 'Special Christmas competition',
          start: '2024-12-20T16:00:00Z',
          end: '2024-12-22T16:00:00Z',
          assignedWeightPoints: 25,
          status: 'finished' as any,
          duration: 48,
          participantCount: 234,
          places: [],
          createdAt: '2024-11-20T10:00:00Z',
          updatedAt: '2024-12-22T16:00:00Z'
        },
        avgDifficulty: 60,
        avgQuality: 3.9,
        totalRatings: 112,
        participants: 234,
        weightReceived: 25,
        eligible: true
      },
      {
        contest: {
          id: 4,
          name: 'small-local-ctf',
          description: 'Small local competition',
          start: '2024-12-10T14:00:00Z',
          end: '2024-12-11T14:00:00Z',
          assignedWeightPoints: 0,
          status: 'finished' as any,
          duration: 24,
          participantCount: 35,
          places: [],
          createdAt: '2024-11-10T10:00:00Z',
          updatedAt: '2024-12-11T14:00:00Z'
        },
        avgDifficulty: 60,
        avgQuality: 3.2,
        totalRatings: 12,
        participants: 35,
        weightReceived: 0,
        eligible: false,
        reason: 'Less than 50 participants'
      },
      {
        contest: {
          id: 10,
          name: 'rookie-december-ctf',
          description: 'First time organizer contest',
          start: '2024-12-05T10:00:00Z',
          end: '2024-12-06T10:00:00Z',
          assignedWeightPoints: 0,
          status: 'finished' as any,
          duration: 24,
          participantCount: 67,
          places: [],
          createdAt: '2024-11-05T10:00:00Z',
          updatedAt: '2024-12-06T10:00:00Z'
        },
        avgDifficulty: 45,
        avgQuality: 2.8,
        totalRatings: 23,
        participants: 67,
        weightReceived: 0,
        eligible: false,
        reason: 'Organizer has no prior qualifying CTFs'
      },
      
      // November 2024 contests
      {
        contest: {
          id: 11,
          name: 'autumn-security-challenge',
          description: 'Autumn themed security competition',
          start: '2024-11-15T12:00:00Z',
          end: '2024-11-17T12:00:00Z',
          assignedWeightPoints: 40,
          status: 'finished' as any,
          duration: 48,
          participantCount: 298,
          places: [],
          createdAt: '2024-10-15T10:00:00Z',
          updatedAt: '2024-11-17T12:00:00Z'
        },
        avgDifficulty: 75,
        avgQuality: 4.3,
        totalRatings: 167,
        participants: 298,
        weightReceived: 40,
        eligible: true
      },
      {
        contest: {
          id: 12,
          name: 'november-network-ctf',
          description: 'Network security focused CTF',
          start: '2024-11-08T14:00:00Z',
          end: '2024-11-10T14:00:00Z',
          assignedWeightPoints: 30,
          status: 'finished' as any,
          duration: 48,
          participantCount: 167,
          places: [],
          createdAt: '2024-10-08T10:00:00Z',
          updatedAt: '2024-11-10T14:00:00Z'
        },
        avgDifficulty: 68,
        avgQuality: 4.0,
        totalRatings: 89,
        participants: 167,
        weightReceived: 30,
        eligible: true
      },
      
      // October 2024 contests  
      {
        contest: {
          id: 13,
          name: 'spooky-security-ctf',
          description: 'Halloween themed security competition',
          start: '2024-10-31T18:00:00Z',
          end: '2024-11-02T18:00:00Z',
          assignedWeightPoints: 25,
          status: 'finished' as any,
          duration: 48,
          participantCount: 445,
          places: [],
          createdAt: '2024-09-30T10:00:00Z',
          updatedAt: '2024-11-02T18:00:00Z'
        },
        avgDifficulty: 72,
        avgQuality: 4.4,
        totalRatings: 234,
        participants: 445,
        weightReceived: 25,
        eligible: true
      },
      {
        contest: {
          id: 3,
          name: 'picoctf-2024',
          description: 'Educational CTF for beginners and advanced players',
          start: '2024-10-12T12:00:00Z',
          end: '2024-10-26T12:00:00Z',
          url: 'https://picoctf.org',
          ctftimeId: 2234,
          assignedWeightPoints: 0,
          status: 'finished' as any,
          duration: 336, // 2 weeks
          participantCount: 8934,
          places: [],
          createdAt: '2024-09-12T10:00:00Z',
          updatedAt: '2024-10-26T12:00:00Z'
        },
        avgDifficulty: 45,
        avgQuality: 4.6,
        totalRatings: 1247,
        participants: 8934,
        weightReceived: 0,
        eligible: false,
        reason: 'Educational CTF - different scoring system'
      }
    ];
  }

  /**
   * Get current weight pool statistics
   */
  async getWeightPoolStats(): Promise<WeightPoolStats> {
    // TODO: implement actual API call to backend
    await sleep(1000);

    return {
      currentMonthPool: 100,
      distributedThisMonth: 85,
      eligibleContestsThisMonth: 3,
      remainingPool: 15
    };
  }

  /**
   * Get contests for a specific month and year
   */
  async getContestsByMonth(month: string, year: number): Promise<ContestWeightHistory[]> {
    // TODO: implement actual API call to backend with month/year filters
    await sleep(1000);

    const allContests = await this.getContestWeightHistory();
    
    return allContests.filter(item => {
      const contestDate = new Date(item.contest.start);
      const contestMonth = contestDate.toLocaleString('en-US', { month: 'long' });
      const contestYear = contestDate.getFullYear();
      
      return contestMonth === month && contestYear === year;
    });
  }

  /**
   * Get aggregated contest difficulties (eligible contests view)
   */
  async getAggregatedContestsDifficulties(): Promise<AggregatedContestsDifficulties[]> {
    // TODO: implement actual API call to backend aggregated_contests_difficulties view
    await sleep(1000);

    // This would return data from the database view
    return [];
  }
}

// Export singleton instance
export const weightPoolApi = new WeightPoolApiService();
export default weightPoolApi;
