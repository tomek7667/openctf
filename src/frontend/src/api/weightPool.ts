import { sleep } from "@/lib/utils";
import type { Contest, AggregatedContestsDifficulties } from "@/types/api";

export interface MonthlyDistribution {
	month: string;
	year: number;
	totalPoints: number;
	eligibleContests: number;
	distributedPoints: number;
	remainingPool: number;
}

export interface ContestWeightHistory {
	contest: Contest;
	avgDifficulty: number;
	avgQuality?: number;
	totalRatings: number;
	participants: number;
	weightReceived: number;
	eligible: boolean;
	reason?: string;
}

export const getMonthlyDistributions = async (): Promise<
	MonthlyDistribution[]
> => {
	await sleep(1000);
	// TODO: implement getMonthlyDistributions
	return [
		{
			month: "January",
			year: 2025,
			totalPoints: 100,
			eligibleContests: 3,
			distributedPoints: 85,
			remainingPool: 15,
		},
		{
			month: "December",
			year: 2024,
			totalPoints: 100,
			eligibleContests: 4,
			distributedPoints: 95,
			remainingPool: 5,
		},
		{
			month: "November",
			year: 2024,
			totalPoints: 100,
			eligibleContests: 2,
			distributedPoints: 70,
			remainingPool: 30,
		},
		{
			month: "October",
			year: 2024,
			totalPoints: 100,
			eligibleContests: 5,
			distributedPoints: 100,
			remainingPool: 0,
		},
		{
			month: "September",
			year: 2024,
			totalPoints: 100,
			eligibleContests: 3,
			distributedPoints: 88,
			remainingPool: 12,
		},
		{
			month: "August",
			year: 2024,
			totalPoints: 100,
			eligibleContests: 6,
			distributedPoints: 100,
			remainingPool: 0,
		},
	];
};

export const getContestWeightHistory = async (): Promise<
	ContestWeightHistory[]
> => {
	await sleep(1000);
	// TODO: implement getContestWeightHistory
	return [
		{
			contest: {
				id: 1,
				name: "cybersec-challenge-2025",
				description: "International cybersecurity competition",
				start: "2025-01-15T14:00:00Z",
				end: "2025-01-17T14:00:00Z",
				assigned_weight_points: 35,
				participantCount: 287,
				places: [],
			} as Contest,
			avgDifficulty: 85,
			avgQuality: 4.5,
			totalRatings: 156,
			participants: 287,
			weightReceived: 35,
			eligible: true,
		},
	];
};

export const getContestsByMonth = async (
	month: string,
	year: number
): Promise<ContestWeightHistory[]> => {
	await sleep(1000);
	// TODO: implement getContestsByMonth
	const allContests = await getContestWeightHistory();
	return allContests.filter((item) => {
		const contestDate = new Date(item.contest.start);
		const contestMonth = contestDate.toLocaleString("en-US", { month: "long" });
		const contestYear = contestDate.getFullYear();
		return contestMonth === month && contestYear === year;
	});
};

export const getAggregatedContestsDifficulties = async (): Promise<
	AggregatedContestsDifficulties[]
> => {
	await sleep(1000);
	// TODO: implement getAggregatedContestsDifficulties
	return [];
};
