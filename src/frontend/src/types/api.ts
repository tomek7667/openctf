export interface User {
	id: number;
	username: string;
	email: string;
	email_confirmed_at?: string;
	confirmation_code?: string;
	permission_level: "player" | "moderator" | "administrator";
	description?: string;
	password: string;
	created_at: string;
	logo?: string;
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

export interface Contest {
	id: number;
	name: string;
	description?: string;
	rules?: string;
	prizes?: string;
	start: string;
	end: string;
	url?: string;
	ctftime_id?: number;
	assigned_weight_points: number;
	logo?: string;
	organizers?: Team;
	places?: Place[];
	status?: ContestStatus;
	assignedWeightPoints?: number;
	averageRating?: number;
	totalRatings?: number;
	participantCount?: number;
}

export interface Place {
	id: number;
	team_name: string;
	place: number;
	ctftime_team_id?: number;
	contest_points?: number;
	openctf_points?: number;
	associated_contest_id: number;
	assigned_weight_points: number;
	associated_team?: Team;
}

export interface ContestRating {
	id: number;
	rating: number;
	relevant: boolean;
	user: User;
	contest: Contest;
}

export interface WeightRating {
	id: number;
	difficulty: number;
	captains_team: Team;
	contest: Contest;
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
	UPCOMING = "upcoming",
	ONGOING = "ongoing",
	FINISHED = "finished",
	CANCELLED = "cancelled",
}

export type ContestStatusType =
	| ContestStatus.UPCOMING
	| ContestStatus.ONGOING
	| ContestStatus.FINISHED
	| ContestStatus.CANCELLED;

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
