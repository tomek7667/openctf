import { CreateContestRatingDto, CreateWeightRatingDto, ContestRating, WeightRating } from "@/lib/schema";

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
}

export interface ContestRatingStats {
	averageQualityRating: number;
	totalQualityRatings: number;
	averageDifficultyRating: number;
	totalDifficultyRatings: number;
	qualityRatingDistribution: { [key: number]: number }; // rating -> count
	difficultyRatingDistribution: { [key: number]: number }; // difficulty range -> count
}

// Mock data for development
let mockContestRatings: ContestRating[] = [];
let mockWeightRatings: WeightRating[] = [];

// Mock some initial data
const initializeMockData = () => {
	if (mockContestRatings.length === 0) {
		// Add some sample ratings for demonstration
		mockContestRatings = [
			{
				id: 1,
				rating: 4,
				relevant: true,
				user: { id: 1, username: "alice_hacker", email: "alice@example.com" } as any,
				contest: { id: 1 } as any,
			},
			{
				id: 2,
				rating: 5,
				relevant: true,
				user: { id: 2, username: "bob_ctfer", email: "bob@example.com" } as any,
				contest: { id: 1 } as any,
			},
			{
				id: 3,
				rating: 3,
				relevant: true,
				user: { id: 3, username: "charlie_sec", email: "charlie@example.com" } as any,
				contest: { id: 1 } as any,
			},
		];

		mockWeightRatings = [
			{
				id: 1,
				difficulty: 75,
				captains_team: { id: 1, name: "Team Alpha" } as any,
				contest: { id: 1 } as any,
			},
			{
				id: 2,
				difficulty: 82,
				captains_team: { id: 2, name: "Team Beta" } as any,
				contest: { id: 1 } as any,
			},
			{
				id: 3,
				difficulty: 68,
				captains_team: { id: 3, name: "Team Gamma" } as any,
				contest: { id: 1 } as any,
			},
		];
	}
};

export async function getContestRatings(contestId: number): Promise<ApiResponse<ContestRatingStats>> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	initializeMockData();

	const contestQualityRatings = mockContestRatings.filter((r) => r.contest.id === contestId);
	const contestDifficultyRatings = mockWeightRatings.filter((r) => r.contest.id === contestId);

	// Calculate quality rating stats
	const totalQualityRatings = contestQualityRatings.length;
	const averageQualityRating = totalQualityRatings > 0 
		? contestQualityRatings.reduce((sum, r) => sum + r.rating, 0) / totalQualityRatings 
		: 0;

	const qualityRatingDistribution: { [key: number]: number } = {};
	for (let i = 1; i <= 5; i++) {
		qualityRatingDistribution[i] = contestQualityRatings.filter(r => r.rating === i).length;
	}

	// Calculate difficulty rating stats
	const totalDifficultyRatings = contestDifficultyRatings.length;
	const averageDifficultyRating = totalDifficultyRatings > 0
		? contestDifficultyRatings.reduce((sum, r) => sum + r.difficulty, 0) / totalDifficultyRatings
		: 0;

	// Group difficulty ratings into ranges
	const difficultyRatingDistribution: { [key: number]: number } = {
		20: contestDifficultyRatings.filter(r => r.difficulty >= 0 && r.difficulty < 20).length,
		40: contestDifficultyRatings.filter(r => r.difficulty >= 20 && r.difficulty < 40).length,
		60: contestDifficultyRatings.filter(r => r.difficulty >= 40 && r.difficulty < 60).length,
		80: contestDifficultyRatings.filter(r => r.difficulty >= 60 && r.difficulty < 80).length,
		100: contestDifficultyRatings.filter(r => r.difficulty >= 80 && r.difficulty <= 100).length,
	};

	const stats: ContestRatingStats = {
		averageQualityRating,
		totalQualityRatings,
		averageDifficultyRating,
		totalDifficultyRatings,
		qualityRatingDistribution,
		difficultyRatingDistribution,
	};

	return {
		success: true,
		data: stats,
	};
}

export async function createContestRating(
	contestId: number,
	rating: number,
	userId?: number
): Promise<ApiResponse<ContestRating>> {
	await new Promise((resolve) => setTimeout(resolve, 400));

	if (!userId) {
		return {
			success: false,
			error: "Authentication required",
		};
	}

	if (rating < 1 || rating > 5) {
		return {
			success: false,
			error: "Rating must be between 1 and 5 stars",
		};
	}

	initializeMockData();

	// Check if user already rated this contest
	const existingRatingIndex = mockContestRatings.findIndex(
		(r) => r.contest.id === contestId && r.user.id === userId
	);

	const newRating: ContestRating = {
		id: Date.now(),
		rating,
		relevant: true,
		user: { id: userId, username: `user_${userId}`, email: `user${userId}@example.com` } as any,
		contest: { id: contestId } as any,
	};

	if (existingRatingIndex >= 0) {
		// Update existing rating
		mockContestRatings[existingRatingIndex] = newRating;
	} else {
		// Add new rating
		mockContestRatings.push(newRating);
	}

	return {
		success: true,
		data: newRating,
	};
}

export async function createWeightRating(
	contestId: number,
	difficulty: number,
	teamId: number
): Promise<ApiResponse<WeightRating>> {
	await new Promise((resolve) => setTimeout(resolve, 400));

	if (difficulty < 0 || difficulty > 100) {
		return {
			success: false,
			error: "Difficulty must be between 0 and 100",
		};
	}

	initializeMockData();

	// Check if team captain already rated this contest
	const existingRatingIndex = mockWeightRatings.findIndex(
		(r) => r.contest.id === contestId && r.captains_team.id === teamId
	);

	const newRating: WeightRating = {
		id: Date.now(),
		difficulty,
		captains_team: { id: teamId, name: `Team ${teamId}` } as any,
		contest: { id: contestId } as any,
	};

	if (existingRatingIndex >= 0) {
		// Update existing rating
		mockWeightRatings[existingRatingIndex] = newRating;
	} else {
		// Add new rating
		mockWeightRatings.push(newRating);
	}

	return {
		success: true,
		data: newRating,
	};
}

export async function getUserContestRating(
	contestId: number,
	userId: number
): Promise<ApiResponse<ContestRating | null>> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	initializeMockData();

	const userRating = mockContestRatings.find(
		(r) => r.contest.id === contestId && r.user.id === userId
	);

	return {
		success: true,
		data: userRating || null,
	};
}

export async function getTeamWeightRating(
	contestId: number,
	teamId: number
): Promise<ApiResponse<WeightRating | null>> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	initializeMockData();

	const teamRating = mockWeightRatings.find(
		(r) => r.contest.id === contestId && r.captains_team.id === teamId
	);

	return {
		success: true,
		data: teamRating || null,
	};
}
