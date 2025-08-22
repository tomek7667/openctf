import {
	GetCurrentYearLeaderboardDto,
	TeamDetails,
	TeamLeaderboardType,
} from "@/api";
import { LOCAL_API_BASE_URL } from "./constant";

export const getTeamDetails = async (teamId: number): Promise<TeamDetails> => {
	const response = await fetch(`${LOCAL_API_BASE_URL}/api/teams/${teamId}`, {
		next: {
			revalidate: 300,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		console.log(message);
		throw new Error(message ?? "unknown error occurred");
	}
	const { team } = data as { team: TeamDetails };
	return team;
};

export const getLeaderboardList = async (
	dto?: GetCurrentYearLeaderboardDto
) => {
	const params = new URLSearchParams();
	if (dto?.Offset !== undefined) {
		params.append("offset", dto?.Offset.toString());
	}
	if (dto?.Limit !== undefined) {
		params.append("limit", dto?.Limit.toString());
	}
	if (dto?.Year !== undefined) {
		params.append("year", dto?.Year.toString());
	}
	if (dto?.CountryCodes && dto?.CountryCodes.length > 0) {
		params.append("country_codes", dto?.CountryCodes.join(","));
	}
	if (dto?.Recruiting !== undefined) {
		params.append("recruiting", dto?.Recruiting.toString());
	}
	if (dto?.SortBy) {
		params.append("sort_by", dto?.SortBy);
	}
	if (dto?.MinRating !== undefined) {
		params.append("min_rating", dto?.MinRating.toString());
	}
	if (dto?.Search) {
		params.append("search", dto?.Search);
	}
	const url = `${LOCAL_API_BASE_URL}/api/teams/leaderboard?${params.toString()}`;
	const response = await fetch(url, {
		next: {
			revalidate: 300,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	const { leaderboard } = data as { leaderboard: TeamLeaderboardType[] };
	return leaderboard;
};
