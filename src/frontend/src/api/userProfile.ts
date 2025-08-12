import { BASE_URL } from "./constant";

export interface UserProfileResponse {
	userProfile: UserProfile;
	lastActivities: LastActivity[];
	achievements: Achievement[];
	statistics: UserStatistics;
}

export interface UserStatistics {
	total_views: number;
	writeups_authored: number;
	contests_participated: number;
	user_id: number;
}

export interface Achievement {
	id: number;
	name: string;
	description: string;
	rarity: string;
	unlocked_at: string;
}

export const skillsNames = ["web", "rev", "pwn", "crypto", "misc"];

export interface UserProfile {
	id: number;
	location: string | null;
	github_link: string | null;
	linkedin_link: string | null;
	twitter_link: string | null;
	website_link: string | null;
	web_skill_level: number;
	rev_skill_level: number;
	pwn_skill_level: number;
	crypto_skill_level: number;
	misc_skill_level: number;
	show_email: boolean;
	show_location: boolean;
}

export enum Activity {
	Welcome = "welcome",
	Contest = "contest",
	Writeup = "writeup",
	Team = "team",
	Achievement = "achievement",
}

export type ActivityType =
	| Activity.Welcome
	| Activity.Contest
	| Activity.Writeup
	| Activity.Team
	| Activity.Achievement;

export const activityTypeToColor = (activityType: ActivityType): string => {
	switch (activityType) {
		case Activity.Welcome:
			return "green";
		case Activity.Contest:
			return "purple";
		case Activity.Writeup:
			return "cyan";
		case Activity.Team:
			return "blue";
		case Activity.Achievement:
			return "yellow";
		default:
			return "gray";
	}
};

export interface LastActivity {
	id: number;
	type: ActivityType;
	title: string;
	description: string;
	date: string;
}

export const getUserProfile = async (
	token: string
): Promise<UserProfileResponse> => {
	const response = await fetch(`${BASE_URL}/api/profiles/me`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	return data;
};
