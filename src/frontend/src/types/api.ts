/**
 * OpenCTF API Type Definitions
 *
 * This file contains all TypeScript types for the OpenCTF API.
 * These types are derived from the backend DTOs and database schemas.
 */

// =============================================================================
// Base Types & Utilities
// =============================================================================

export interface ApiResponse<T = unknown> {
	success: boolean;
	message?: string;
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

export interface BaseEntity {
	id: number;
	createdAt: string;
	updatedAt: string;
}

// =============================================================================
// Authentication Types
// =============================================================================

export interface LoginDto {
	identity: string; // username or email
	password: string;
}

export interface RegisterDto {
	username: string;
	email: string;
	password: string;
	description: string;
}

export interface User extends BaseEntity {
	username: string;
	email: string;
	emailConfirmedAt?: string;
	confirmationCode?: string;
	permissionLevel: "player" | "moderator" | "administrator";
	description?: string;
	password: string; // sensitive
	logo?: string; // base64/blob data up to 50MB
}

export interface AuthResponse {
	user: User;
	token: string;
	expiresAt: string;
}

// =============================================================================
// Team Types
// =============================================================================

export interface ListTeamsDto {
	offset?: number;
	limit?: number;
	countryCodes?: string[];
	search?: string;
	year?: number;
	sortBy?: TeamSortField;
	sortOrder?: SortOrder;
	minPoints?: number;
	verified?: boolean;
}

export enum TeamSortField {
	NAME = "name",
	POINTS = "points",
	RANK = "rank",
	CREATED_AT = "createdAt",
	COUNTRY = "country",
}

export enum SortOrder {
	ASC = "asc",
	DESC = "desc",
}

export interface CreateTeamDto {
	name: string;
	description?: string;
	ctftimeId?: number;
	logo?: File | string; // File for upload, string for base64
	countryCode?: string;
}

export interface Team extends BaseEntity {
	name: string;
	description?: string;
	ctftimeId?: number;
	ctftimeVerifiedAt?: string;
	logo?: string; // base64/blob data up to 50MB
	verifiedAt?: string | undefined;
	countryCode: string; // defaults to "global"

	// Relations
	captain?: User;
	verifiedBy?: User;
	members?: User[];

	// Computed fields (not in schema but calculated)
	points?: number;
	rank?: number;
	weeklyChange?: number;
}

// =============================================================================
// Contest Types
// =============================================================================

export interface ListContestsDto {
	offset?: number;
	limit?: number;
	search?: string;
	status?: ContestStatus;
	year?: number;
	minWeightPoints?: number;
	maxWeightPoints?: number;
	minRating?: number; // 1-5 stars
	maxRating?: number;
	sortBy?: ContestSortField;
	sortOrder?: SortOrder;
	organizerId?: number;
}

export enum ContestStatus {
	UPCOMING = "upcoming",
	ONGOING = "ongoing",
	FINISHED = "finished",
	CANCELLED = "cancelled",
}

export type ContestStatusType =
	| ContestStatus.CANCELLED
	| ContestStatus.FINISHED
	| ContestStatus.ONGOING
	| ContestStatus.UPCOMING;

export enum ContestSortField {
	NAME = "name",
	START = "start",
	END = "end",
	PARTICIPANTS = "participants",
	CREATED_AT = "createdAt",
}

export interface CreateContestDto {
	name: string;
	description?: string;
	rules?: string;
	prizes?: string;
	start: string; // ISO date
	end: string; // ISO date
	url?: string;
	ctftimeId?: number;
	assignedWeightPoints?: number;
	logo?: File | string; // File upload or base64
}

export interface Contest extends BaseEntity {
	name: string;
	description?: string;
	rules?: string;
	prizes?: string;
	start: string;
	end: string;
	url?: string;
	ctftimeId?: number;
	assignedWeightPoints: number; // defaults to 0
	logo?: string; // base64/blob data up to 50MB

	// Computed fields (not in schema)
	status: ContestStatus;
	duration: number; // in hours
	participantCount?: number;
	averageRating?: number; // calculated from ContestRating
	totalRatings?: number; // count of ContestRating

	// Relations
	organizer?: Team;
	places: Place[];
}

// =============================================================================
// Place Types (Contest Results)
// =============================================================================

export interface Place extends BaseEntity {
	teamName: string;
	place: number; // minimum 1
	ctftimeTeamId?: number;
	contestPoints?: number; // actual points in the CTF
	openctfPoints?: number; // normalized points based on contest weight
	associatedContestId: number;
	assignedWeightPoints: number; // defaults to 0

	// Relations
	associatedTeam?: Team;
}

// =============================================================================
// Rating Types
// =============================================================================

export interface ContestRating extends BaseEntity {
	rating: number; // 0-5
	relevant: boolean; // true if user's team was in top 15%

	// Relations
	user: User;
	contest: Contest;
}

export interface WeightRating extends BaseEntity {
	difficulty: number; // 0-100 difficulty rating

	// Relations
	captainsTeam: Team;
	contest: Contest;
}

export interface RateContestDto {
	contestId: number;
	rating: number; // 1-5 stars
}

export interface RateContestWeightDto {
	contestId: number;
	difficulty: number; // 0-100
}

// =============================================================================
// Aggregated Contest Data (Database View)
// =============================================================================

export interface AggregatedContestsDifficulties {
	contestId: number;
	contestName: string;
	end: string;
	organizersId: number;
	avgDifficulty: number;
	participants: number;
}

// =============================================================================
// Filter & Search Types
// =============================================================================

export interface FilterOptions {
	countries: CountryOption[];
	years: number[];
	contestStatuses: ContestStatus[];
}

export interface CountryOption {
	code: string; // ISO country code
	name: string;
	flag: string; // emoji or URL
}

export interface SearchFilters {
	query?: string;
	countries?: string[];
	dateRange?: {
		start: string;
		end: string;
	};
	pointsRange?: {
		min: number;
		max: number;
	};
	verified?: boolean;
}

// =============================================================================
// Error Types
// =============================================================================

export interface ApiError {
	code: string;
	message: string;
	details?: Record<string, unknown>;
	statusCode: number;
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

// =============================================================================
// Utility Types
// =============================================================================

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Helper type for form data
export type FormData<T> = {
	[K in keyof T]: T[K] extends File ? File : T[K] extends Date ? string : T[K];
};
