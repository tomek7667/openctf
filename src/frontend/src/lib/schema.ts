/**
 * Database Schema Types
 *
 * Generated from backend ent schema definitions
 * These types represent the actual database structure
 */

export interface User {
	id: number;
	username: string;
	email: string;
	email_confirmed_at?: string | null;
	confirmation_code?: string | null;
	permission_level: "player" | "moderator" | "administrator";
	description?: string;
	password: string;
	created_at: string;
	logo?: Uint8Array;
	// Relations
	teams?: Team[];
}

export interface Team {
	id: number;
	name: string;
	description?: string;
	ctftime_id?: number | null;
	ctftime_verified_at?: string | null;
	logo?: Uint8Array;
	verified_at?: string | null;
	country_code: string;
	// Relations
	captain?: User;
	verified_by?: User;
	members?: User[];
}

export interface Contest {
	id: number;
	name: string;
	description?: string | null;
	rules?: string | null;
	prizes?: string | null;
	start: string;
	end: string;
	url?: string | null;
	ctftime_id?: number | null;
	assigned_weight_points: number;
	logo?: Uint8Array;
	// Relations
	organizers?: Team;
	places?: Place[];
}

export interface Place {
	id: number;
	team_name: string;
	place: number;
	ctftime_team_id?: number | null;
	contest_points?: number | null;
	openctf_points?: number | null;
	associated_contest_id: number;
	assigned_weight_points: number;
	// Relations
	associated_team?: Team;
}

export interface ContestRating {
	id: number;
	rating: number; // 0-5
	relevant: boolean;
	// Relations
	user: User;
	contest: Contest;
}

export interface WeightRating {
	id: number;
	difficulty: number; // 0-100
	// Relations
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

// Enums
export enum PermissionLevel {
	PLAYER = "player",
	MODERATOR = "moderator",
	ADMINISTRATOR = "administrator",
}

export enum ContestStatus {
	UPCOMING = "upcoming",
	ONGOING = "ongoing",
	FINISHED = "finished",
	CANCELLED = "cancelled",
}

// API DTOs
export interface CreateUserDto {
	username: string;
	email: string;
	password: string;
	description?: string;
}

export interface CreateTeamDto {
	name: string;
	description?: string;
	ctftime_id?: number;
	logo?: Uint8Array;
	country_code?: string;
}

export interface CreateContestDto {
	name: string;
	description?: string;
	rules?: string;
	prizes?: string;
	start: string;
	end: string;
	url?: string;
	ctftime_id?: number;
	logo?: Uint8Array;
}

export interface CreatePlaceDto {
	team_name: string;
	place: number;
	ctftime_team_id?: number;
	contest_points?: number;
	associated_contest_id: number;
}

export interface CreateContestRatingDto {
	rating: number;
	user_id: number;
	contest_id: number;
}

export interface CreateWeightRatingDto {
	difficulty: number;
	captains_team_id: number;
	contest_id: number;
}
