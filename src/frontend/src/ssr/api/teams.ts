import { TeamDetails } from "@/api";
import { LOCAL_API_BASE_URL } from "./constant";

export const getTeamDetails = async (teamId: number): Promise<TeamDetails> => {
	const response = await fetch(`${LOCAL_API_BASE_URL}/api/teams/${teamId}`);
	const { data, success, message } = await response.json();
	if (!success) {
		console.log(message);
		throw new Error(message ?? "unknown error occurred");
	}
	const { team } = data as { team: TeamDetails };
	return team;
};
