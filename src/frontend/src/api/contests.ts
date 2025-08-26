import {
	ContestStatus,
	ContestStatusType,
	RawContest,
	User,
} from "@/types/api";
import { BASE_URL } from "./constant";
import { Team } from "./teams";

export interface ListContestsDto {
	Offset?: number;
	Limit?: number;
}

export interface ParsedContest extends RawContest {
	status: ContestStatusType;
}

export const getStatus = (start: Date, end: Date): ContestStatusType => {
	const now = new Date();
	if (end < now) {
		return ContestStatus.Finished;
	} else if (now > start) {
		return ContestStatus.Upcoming;
	} else if (now < start && end > now) {
		return ContestStatus.Ongoing;
	}
	return ContestStatus.Cancelled;
};

export interface ParsedAggregatedContest extends AggregatedContest {
	status: ContestStatusType;
}

export interface AggregatedContest {
	id: number;
	name: string;
	description: string | null;
	rules: string | null;
	prizes: string | null;
	start: string;
	end: string;
	url: string | null;
	ctftime_id: number;
	assigned_weight_points: number;
	duration: number;
	logo_url: string | null;
	rating: number | null;
	participants: number | null;
}

export const getContests = async (
	dto: ListContestsDto
): Promise<ParsedAggregatedContest[]> => {
	const params = new URLSearchParams();
	if (dto.Offset !== undefined) {
		params.append("offset", dto.Offset.toString());
	}
	if (dto.Limit !== undefined) {
		params.append("limit", dto.Limit.toString());
	}
	const url = `${BASE_URL}/api/contests?${params.toString()}`;
	console.log(`GET -> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	const { contests } = data as { contests: AggregatedContest[] };
	return contests.map((c) => ({
		...c,
		status: getStatus(new Date(c.start), new Date(c.end)),
	}));
};

export const getContest = async (contestId: number): Promise<ParsedContest> => {
	const url = `${BASE_URL}/api/contests/${encodeURIComponent(contestId)}`;
	console.log(`GET -> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	const { contest } = data as { contest: RawContest };
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return {
		...contest,
		status: getStatus(new Date(contest.start), new Date(contest.end)),
	};
};

export interface ContestRatingsResponse {
	opinion_ratings: OpinionRating[];
	weight_ratings: WeightRating[];
}

export interface OpinionRating {
	id: number;
	rating: number;
	relevant: boolean;
	comment: string | null;
	edges: RatingEdges;
}

export interface RatingEdges {
	user: User;
}

export interface WeightRating {
	id: number;
	difficulty: number;
	comment: string | null;
	edges: WeightRatingEdges;
}

export interface WeightRatingEdges {
	captains_team: Team;
}

export const getContestRatings = async (
	contestId: number
): Promise<ContestRatingsResponse> => {
	const url = `${BASE_URL}/api/contests/${encodeURIComponent(contestId)}/rating`;
	console.log(`GET -> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return data;
};

export interface RateContestOpinionDto {
	rating: number;
	comment: string | null;
}

export interface RateContestOpinionResponse {
	id: number;
	rating: number;
	relevant: boolean;
	comment: string | null;
}

export const rateContestOpinion = async (
	token: string,
	contestId: number,
	dto: RateContestOpinionDto
): Promise<RateContestOpinionResponse> => {
	const url = `${BASE_URL}/api/contests/${encodeURIComponent(contestId)}/rate-opinion`;
	console.log(`POST -> ${url}`);
	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(dto),
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return data;
};

export interface RateContestDifficultyDto {
	difficulty: number;
	comment: string | null;
}

export const rateContestWeight = async (
	token: string,
	contestId: number,
	dto: RateContestDifficultyDto
) => {
	console.log(token, contestId, dto);
	throw new Error("not implemented");
};
