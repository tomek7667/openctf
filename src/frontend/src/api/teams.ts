import { BASE_URL } from "./constant";

export interface TeamLeaderboardType {
	id: number;
	name: string;
	description: string;
	country_code: string;
	team_logo_url: string | null;
	banner_image_url: string | null;
	website_url: string | null;
	discord_url: string | null;
	github_url: any;
	recruiting: boolean;
	contact_info: string | null;
	looking_for: string[];
	created_at: string;
	ctftime_id: string | null;
	ctftime_verified_at: string | null;
	verified_at: string | null;
	year: number;
	team_points: number;
	rank: number;
	members: number | null;
	avg_place: number | null;
	contests_count: number;
	contests_won: number;
}

export const DEFAULT_TEAMS_LIMIT = 30;

export interface GetCurrentYearLeaderboardDto {
	Offset?: number;
	Limit?: number;
	Year?: number;
	CountryCodes: string[];
	Recruiting?: boolean;
	SortBy?: string;
	MinRating?: number;
	Search?: string;
}

export interface LeaderboardResponse {
	leaderboard: TeamLeaderboardType[];
}

export const getLeaderboardList = async (
	dto: GetCurrentYearLeaderboardDto
): Promise<LeaderboardResponse> => {
	const params = new URLSearchParams();
	if (dto.Offset !== undefined) {
		params.append("offset", dto.Offset.toString());
	}
	if (dto.Limit !== undefined) {
		params.append("limit", dto.Limit.toString());
	}
	if (dto.Year !== undefined) {
		params.append("year", dto.Year.toString());
	}
	if (dto.CountryCodes && dto.CountryCodes.length > 0) {
		params.append("country_codes", dto.CountryCodes.join(","));
	}
	if (dto.Recruiting !== undefined) {
		params.append("recruiting", dto.Recruiting.toString());
	}
	if (dto.SortBy) {
		params.append("sort_by", dto.SortBy);
	}
	if (dto.MinRating !== undefined) {
		params.append("min_rating", dto.MinRating.toString());
	}
	if (dto.Search) {
		params.append("search", dto.Search);
	}

	const url = `${BASE_URL}/api/teams/leaderboard?${params.toString()}`;
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	return data as LeaderboardResponse;
};

export interface CreateTeamDto {
	name: string;
	description: string | null;
	country_code: string;
	team_logo_url: string | null;
	banner_image_url: string | null;
	website_url: string | null;
	discord_url: string | null;
	github_url: string | null;
	recruiting: boolean;
	contact_info: string | null;
	looking_for: string[];
	ctftime_id: number | null;
}

export interface Team {
	id: number;
	name: string;
	description: string | null;
	country_code: string;
	team_logo_url: string | null;
	banner_image_url: string | null;
	website_url: string | null;
	discord_url: string | null;
	github_url: string | null;
	recruiting: boolean;
	contact_info: string | null;
	looking_for: string[];
	ctftime_id: number | null;
	ctftime_verified_at: string | null;
	verified_at: string | null;
	edges: TeamEdges;
}

export interface TeamEdges {
	members: Member[];
	captain: Member;
}

export interface Member {
	id: number;
	username: string;
	email: string;
	email_confirmed_at: string | null;
	permission_level: string;
	created_at: string;
	logo: string | null;
	github_account_id: number;
	github_username: string;
	github_name: string;
	github_email: string;
	github_avatar_url: string;
}

export interface TeamDetails {
	id: number;
	name: string;
	description: string | null;
	ctftime_id: number | null;
	ctftime_verified_at: string | null;
	verified_at: string | null;
	country_code: string;
	team_logo_url: string | null;
	banner_image_url: string | null;
	discord_url: string | null;
	github_url: string | null;
	recruiting: boolean;
	contact_info: string | null;
	looking_for: string[];
	website_url: string | null;
	current_place: number;
	points: number | null;
	avg_place: number | null;
	years_active: number;
	contest_history: TeamsDetailsContest[];
	achievements: TeamsDetailsAchievement[];
	members: TeamsDetailsUser[];
	captain: TeamsDetailsUser;
	verified_by: TeamsDetailsUser;
}

export interface TeamsDetailsContest {
	id: number;
	name: string;
	year: number;
	start: string;
	end: string;
	place: number;
	rating: number | null;
	assigned_weight_points: number;
	participants: number;
}

export interface TeamsDetailsAchievement {
	id: number;
	name: string;
	unlocked_at: string;
}

export interface TeamsDetailsUser {
	id: number;
	username: string;
	description: string | null;
	logo_url: string | null;
	email_confirmed_at: string | null;
	created_at: string;
	email: string;
}

export const createTeam = async (
	token: string,
	dto: CreateTeamDto
): Promise<Team> => {
	const response = await fetch(`${BASE_URL}/api/teams/create`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
		body: JSON.stringify(dto),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	const { team } = data as { team: Team };
	return team;
};
