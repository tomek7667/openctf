import { LOCAL_API_BASE_URL } from "./constant";

export interface PlatformStats {
	total_users: number;
	total_teams: number;
	total_upcoming_events: number;
	total_past_events: number;
	total_live_events: number;
}

export const getPlatformStats = async (): Promise<PlatformStats> => {
	const url = `${LOCAL_API_BASE_URL}/api/statistics`;
	// console.log(`-> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return data as PlatformStats;
};
