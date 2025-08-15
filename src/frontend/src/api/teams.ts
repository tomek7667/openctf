import { BASE_URL } from "./constant";

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

export async function createTeam(
	token: string,
	dto: CreateTeamDto
): Promise<Team> {
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
}
