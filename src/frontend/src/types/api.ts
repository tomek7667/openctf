export interface User {
	id: number;
	username: string;
	email: string;
	email_confirmed_at: string | null;
	confirmation_code?: string;
	permission_level: "player" | "moderator" | "administrator";
	description?: string;
	password: string;
	created_at: string;
	logo?: string;

	// optional after gh connection
	github_account_id?: number;
	github_username?: string;
	github_name?: string;
	github_email?: string;
	github_avatar_url?: string;
}

export interface RawContest {
	id: number;
	name: string;
	description: string;
	rules: string;
	prizes: string;
	start: string;
	end: string;
	duration: number;
	url: string;
	ctftime_id: number;
	assigned_weight_points: number;
	logo: string | null;
	edges?: contestEdges;
}

export interface contestEdges {
	places?: Place[];
}

export interface Place {
	id: number;
	team_name: string;
	place: number;
	ctftime_team_id: number | null;
	contest_points: number;
	openctf_points: number | null;
	associated_contest_id: number;
	assigned_weight_points: number;
}

export interface Team {
	id: number;
	name: string;
	description?: string;
	ctftime_id?: number;
	ctftime_verified_at?: string;
	logo?: string;
	verified_at?: string;
	country_code: string;
	captain?: User;
	verified_by?: User;
	members?: User[];
}

export interface ContestRating {
	id: number;
	rating: number;
	relevant: boolean;
	user: User;
	contest: RawContest;
}

export interface WeightRating {
	id: number;
	difficulty: number;
	captains_team: Team;
	contest: RawContest;
}

export interface AggregatedContestsDifficulties {
	contest_id: number;
	contest_name: string;
	end: string;
	organizers_id: number;
	avg_difficulty: number;
	participants: number;
}

export enum ContestStatus {
	Upcoming = "upcoming",
	Ongoing = "ongoing",
	Finished = "finished",
	Cancelled = "cancelled",
}

export type ContestStatusType =
	| ContestStatus.Upcoming
	| ContestStatus.Ongoing
	| ContestStatus.Finished
	| ContestStatus.Cancelled;

export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
	error?: string;
	data?: T;
}

export interface PaginatedResponse<T = unknown> {
	items: T[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasNext: boolean;
		hasPrev: boolean;
		totalPages: number;
		currentPage: number;
	};
}

export interface LoginDto {
	identity: string;
	password: string;
}

export interface RegisterDto {
	username: string;
	email: string;
	password: string;
	description: string;
}

export interface AuthResponse {
	user: User;
	token: string;
	expiresAt?: string;
}

export interface ListTeamsDto {
	offset?: number;
	limit?: number;
	countryCodes?: string[];
}

export interface CreateTeamDto {
	name: string;
	description: string;
	ctftimeId?: number;
	logo?: Uint8Array;
}

export interface ListContestsDto {
	offset?: number;
	limit?: number;
}

export interface CreateContestDto {
	name: string;
	description: string;
	rules: string;
	prizes: string;
	start: string;
	end: string;
	url: string;
	ctftimeId?: number;
}

export interface RateContestDto {
	contestId: number;
	rating: number;
}

export interface RateContestWeightDto {
	contestId: number;
	difficulty: number;
}
