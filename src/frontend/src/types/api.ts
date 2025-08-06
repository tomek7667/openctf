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
	description?: string;
	role: UserRole;
	isVerified: boolean;
	avatar?: string;
	lastLoginAt?: string;
	stats?: UserStats;
}

export enum UserRole {
	USER = "user",
	MODERATOR = "moderator",
	ADMIN = "admin",
}

export interface UserStats {
	totalPoints: number;
	contestsParticipated: number;
	teamsOwned: number;
	rank?: number;
	categoryRankings: CategoryRanking[];
}

export interface CategoryRanking {
	category: CTFCategory;
	points: number;
	rank: number;
	solves: number;
}

export enum CTFCategory {
	WEB = "web",
	REVERSE = "rev",
	PWN = "pwn",
	CRYPTO = "crypto",
	MISC = "misc",
	FORENSICS = "forensics",
	OSINT = "osint",
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
	description: string;
	ctftimeId?: number;
	logo?: File | string; // File for upload, string for base64
	country?: string;
	website?: string;
	isPublic: boolean;
}

export interface Team extends BaseEntity {
	name: string;
	description?: string;
	ctftimeId?: number;
	logo?: string; // URL to logo
	country?: string;
	website?: string;
	isVerified: boolean;
	isPublic: boolean;

	// Computed fields
	points: number;
	rank?: number;
	weeklyChange?: number; // Position change in current week

	// Relations
	members: TeamMember[];
	captain: User;
	captainId: number;

	// Stats
	stats: TeamStats;
}

export interface TeamMember {
	user: User;
	userId: number;
	team: Team;
	teamId: number;
	role: TeamMemberRole;
	joinedAt: string;
	isActive: boolean;
}

export enum TeamMemberRole {
	CAPTAIN = "captain",
	MEMBER = "member",
}

export interface TeamStats {
	totalPoints: number;
	contestsParticipated: number;
	bestRank: number;
	averageRank: number;
	categoryBreakdown: Record<CTFCategory, number>;
	yearlyPoints: Record<string, number>; // year -> points
	recentPlacements: ContestPlacement[];
}

export interface VerifyTeamDto {
	teamId: number;
	verified: boolean;
	reason?: string;
}

export interface MergeTeamsDto {
	mergerId: number; // team to keep
	mergeeId: number; // team to merge into merger
	reason: string;
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
	assignedWeightPoints: number;
	logo?: string; // base64 or blob data

	// Computed fields
	status: ContestStatus;
	duration: number; // in hours
	participantCount: number;
	averagRating?: number; // average star rating from users
	totalRatings?: number; // number of ratings

	// Relations
	organizer?: Team;
	organizerId?: number;
	places: Place[];
}

export interface ContestStats {
	totalParticipants: number;
	averageScore: number;
	averagRating: number; // 1-5 stars (quality rating)
	ratingCount: number;
	assignedWeightPoints: number; // difficulty/hardness
}

export interface Place extends BaseEntity {
	teamName: string;
	place: number;
	ctftimeTeamId?: number;
	contestPoints?: number; // actual points in the CTF
	openctfPoints?: number; // normalized points
	associatedContestId: number;
	assignedWeightPoints: number;
	// Relations
	associatedTeam?: Team;
}

export interface ChallengeSolve {
	challengeName: string;
	category: CTFCategory;
	points: number;
	solvedAt: string;
	solvers: User[]; // Users who contributed to solve
}

export interface RateContestDto {
	contestId: number;
	difficulty: number; // 1-5
	quality: number; // 1-5
	comment?: string;
}

// =============================================================================
// Forum/Event Types
// =============================================================================

export interface ForumPost extends BaseEntity {
	title: string;
	content: string;
	author: User;
	authorId: number;
	contest?: Contest; // If post is about a contest
	contestId?: number;
	isPinned: boolean;
	isLocked: boolean;
	viewCount: number;

	// Relations
	comments: ForumComment[];
	tags: string[];
}

export interface ForumComment extends BaseEntity {
	content: string;
	author: User;
	authorId: number;
	post: ForumPost;
	postId: number;
	parent?: ForumComment; // For nested comments
	parentId?: number;

	// Moderation
	isDeleted: boolean;
	deletedAt?: string;
	deletedBy?: User;
}

// =============================================================================
// Filter & Search Types
// =============================================================================

export interface FilterOptions {
	countries: CountryOption[];
	years: number[];
	categories: CTFCategory[];
	contestStatuses: ContestStatus[];
}

export interface CountryOption {
	code: string; // ISO country code
	name: string;
	flag: string; // emoji or URL
}

export interface SearchFilters {
	query?: string;
	categories?: CTFCategory[];
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
// Real-time & Notification Types
// =============================================================================

export interface Notification extends BaseEntity {
	type: NotificationType;
	title: string;
	message: string;
	data?: Record<string, unknown>; // Additional context data
	isRead: boolean;
	readAt?: string;
	user: User;
	userId: number;
}

export enum NotificationType {
	CONTEST_STARTING = "contest_starting",
	CONTEST_ENDING = "contest_ending",
	TEAM_INVITATION = "team_invitation",
	TEAM_VERIFIED = "team_verified",
	RANK_CHANGE = "rank_change",
	NEW_CONTEST = "new_contest",
	SYSTEM_ANNOUNCEMENT = "system_announcement",
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
