import { ContestRatingsResponse, getStatus, ParsedContest } from "@/api";
import { LOCAL_API_BASE_URL } from "./constant";
import { RawContest } from "@/types/api";

export const getContestRatings = async (
	contestId: number
): Promise<ContestRatingsResponse> => {
	const url = `${LOCAL_API_BASE_URL}/api/contests/${encodeURIComponent(contestId)}/rating`;
	console.log(`GET -> ${url}`);
	const response = await fetch(url, {
		next: {
			revalidate: 300,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return data;
};

export const getContest = async (contestId: number): Promise<ParsedContest> => {
	const url = `${LOCAL_API_BASE_URL}/api/contests/${encodeURIComponent(contestId)}`;
	console.log(`GET -> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	const { contest } = data as { contest: RawContest };
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return {
		...contest,
		status: getStatus(new Date(contest.start), new Date(contest.end)),
	};
};
