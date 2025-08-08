import { sleep } from "@/lib/utils";

export interface PlatformStats {
	rankedTeams: number;
	teamMembers: number;
	activeContests: number;
	pastEvents: number;
}

export const getPlatformStats = async (): Promise<PlatformStats> => {
	await sleep(1000);
	// TODO: implement getPlatformStats
	return {
		rankedTeams: 2847,
		teamMembers: 18934,
		activeContests: 12,
		pastEvents: 156,
	};
};
