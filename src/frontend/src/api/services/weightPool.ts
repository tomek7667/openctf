/**
 * Weight Pool API Service
 * 
 * Handles all weight pool related API calls including:
 * - Monthly distribution data
 * - Contest weight history
 * - Pool statistics and allocation tracking
 */

import { sleep } from '@/lib/utils';

export interface MonthlyDistribution {
  month: string
  year: number
  totalPoints: number
  eligibleContests: number
  distributedPoints: number
  remainingPool: number
}

export interface ContestWeightHistory {
  id: number
  name: string
  date: string
  participants: number
  organizers: string
  weightReceived: number
  difficulty: number
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
   */
  async getContestWeightHistory(): Promise<ContestWeightHistory[]> {
    // TODO: implement actual API call to backend
    await sleep(1000);

    return [
      // January 2025 contests
      {
        id: 1,
        name: 'CyberSec Challenge 2025',
        date: '2025-01-15',
        participants: 287,
        organizers: 'CyberSec Org',
        weightReceived: 35,
        difficulty: 85,
        eligible: true
      },
      {
        id: 6,
        name: 'NewYear CTF 2025',
        date: '2025-01-05',
        participants: 156,
        organizers: 'Global CTF Alliance',
        weightReceived: 30,
        difficulty: 70,
        eligible: true
      },
      {
        id: 7,
        name: 'Winter Security Challenge',
        date: '2025-01-22',
        participants: 203,
        organizers: 'Winter Sec Team',
        weightReceived: 20,
        difficulty: 55,
        eligible: true
      },
      
      // December 2024 contests
      {
        id: 2,
        name: 'Holiday Hacker CTF',
        date: '2024-12-15',
        participants: 342,
        organizers: 'Holiday Hackers',
        weightReceived: 25,
        difficulty: 65,
        eligible: true
      },
      {
        id: 8,
        name: 'End of Year Challenge',
        date: '2024-12-28',
        participants: 189,
        organizers: 'Year End Team',
        weightReceived: 35,
        difficulty: 80,
        eligible: true
      },
      {
        id: 9,
        name: 'Christmas Special CTF',
        date: '2024-12-20',
        participants: 234,
        organizers: 'Christmas Crew',
        weightReceived: 25,
        difficulty: 60,
        eligible: true
      },
      {
        id: 4,
        name: 'Small Local CTF',
        date: '2024-12-10',
        participants: 35,
        organizers: 'New Organizer',
        weightReceived: 0,
        difficulty: 60,
        eligible: false,
        reason: 'Less than 50 participants'
      },
      {
        id: 10,
        name: 'Rookie December CTF',
        date: '2024-12-05',
        participants: 67,
        organizers: 'First Time Organizers',
        weightReceived: 0,
        difficulty: 45,
        eligible: false,
        reason: 'Organizer has no prior qualifying CTFs'
      },
      
      // November 2024 contests
      {
        id: 11,
        name: 'Autumn Security Challenge',
        date: '2024-11-15',
        participants: 298,
        organizers: 'Autumn Sec',
        weightReceived: 40,
        difficulty: 75,
        eligible: true
      },
      {
        id: 12,
        name: 'November Network CTF',
        date: '2024-11-08',
        participants: 167,
        organizers: 'Network Masters',
        weightReceived: 30,
        difficulty: 68,
        eligible: true
      },
      {
        id: 5,
        name: 'First Time CTF',
        date: '2024-11-20',
        participants: 120,
        organizers: 'Rookie Team',
        weightReceived: 0,
        difficulty: 70,
        eligible: false,
        reason: 'Organizer has no prior qualifying CTFs'
      },
      
      // October 2024 contests
      {
        id: 13,
        name: 'Spooky Security CTF',
        date: '2024-10-31',
        participants: 445,
        organizers: 'Halloween Hackers',
        weightReceived: 25,
        difficulty: 72,
        eligible: true
      },
      {
        id: 14,
        name: 'October Offensive',
        date: '2024-10-15',
        participants: 323,
        organizers: 'Offensive Sec Team',
        weightReceived: 30,
        difficulty: 78,
        eligible: true
      },
      {
        id: 15,
        name: 'Fall Forensics Challenge',
        date: '2024-10-08',
        participants: 189,
        organizers: 'Forensics Guild',
        weightReceived: 20,
        difficulty: 65,
        eligible: true
      },
      {
        id: 16,
        name: 'Crypto October Fest',
        date: '2024-10-22',
        participants: 276,
        organizers: 'Crypto Masters',
        weightReceived: 25,
        difficulty: 70,
        eligible: true
      },
      {
        id: 3,
        name: 'picoCTF 2024',
        date: '2024-10-12',
        participants: 8934,
        organizers: 'Carnegie Mellon University',
        weightReceived: 0,
        difficulty: 45,
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
    
    return allContests.filter(contest => {
      const contestDate = new Date(contest.date);
      const contestMonth = contestDate.toLocaleString('en-US', { month: 'long' });
      const contestYear = contestDate.getFullYear();
      
      return contestMonth === month && contestYear === year;
    });
  }
}

// Export singleton instance
export const weightPoolApi = new WeightPoolApiService();
export default weightPoolApi;
