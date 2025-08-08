import { sleep } from "@/lib/utils";
import type { Contest, ListContestsDto, CreateContestDto, RateContestDto, PaginatedResponse, ContestStatus } from "@/types/api";

export const getContests = async (params?: ListContestsDto): Promise<PaginatedResponse<Contest>> => {
	await sleep(1000);
	// TODO: implement getContests
	const mockContests: Contest[] = [
		{
			id: 1,
			name: "cybersec-challenge-2025",
			description: "International cybersecurity competition featuring advanced exploitation challenges",
			rules: "Team-based competition with maximum 4 members per team",
			prizes: "$10,000 for first place, $5,000 for second, $2,500 for third",
			start: "2025-01-15T14:00:00Z",
			end: "2025-01-17T14:00:00Z",
			url: "https://cybersec.example.com",
			ctftime_id: 2847,
			assigned_weight_points: 85,
			status: "ongoing" as ContestStatus,
			participantCount: 287,
			averageRating: 4.5,
			totalRatings: 156,
			places: [],
		},
		{
			id: 2,
			name: "university-ctf-2025",
			description: "Annual university-level competition with beginner-friendly challenges",
			start: "2025-02-10T16:00:00Z",
			end: "2025-02-12T16:00:00Z",
			url: "https://uni-ctf.example.com",
			assigned_weight_points: 35,
			status: "upcoming" as ContestStatus,
			participantCount: 0,
			totalRatings: 0,
			places: [],
		},
		{
			id: 3,
			name: "bsidessf-2024-ctf",
			description: "BSides San Francisco annual security competition",
			start: "2024-05-18T18:00:00Z",
			end: "2024-05-20T06:00:00Z",
			url: "https://bsidessf.org/ctf",
			ctftime_id: 2456,
			assigned_weight_points: 75,
			status: "finished" as ContestStatus,
			participantCount: 342,
			averageRating: 4.3,
			totalRatings: 189,
			places: [],
		},
		{
			id: 4,
			name: "picoctf-2024",
			description: "Educational CTF for beginners and advanced players",
			start: "2024-03-12T12:00:00Z",
			end: "2024-03-26T12:00:00Z",
			url: "https://picoctf.org",
			ctftime_id: 2234,
			assigned_weight_points: 25,
			status: "finished" as ContestStatus,
			participantCount: 8934,
			averageRating: 4.6,
			totalRatings: 1247,
			places: [],
		},
		{
			id: 5,
			name: "defcon-quals-2024",
			description: "DEF CON CTF Qualifier - Elite level competition",
			start: "2024-05-04T20:00:00Z",
			end: "2024-05-06T20:00:00Z",
			url: "https://oooverflow.io",
			ctftime_id: 1895,
			assigned_weight_points: 95,
			status: "finished" as ContestStatus,
			participantCount: 1247,
			averageRating: 4.8,
			totalRatings: 423,
			places: [],
		},
		{
			id: 6,
			name: "google-ctf-2024",
			description: "Google's annual cybersecurity competition",
			start: "2024-06-21T18:00:00Z",
			end: "2024-06-23T18:00:00Z",
			url: "https://capturetheflag.withgoogle.com",
			ctftime_id: 2156,
			assigned_weight_points: 88,
			status: "finished" as ContestStatus,
			participantCount: 892,
			averageRating: 4.7,
			totalRatings: 312,
			places: [],
		},
		{
			id: 7,
			name: "plaidctf-2025",
			description: "Carnegie Mellon's premier CTF competition",
			start: "2025-04-11T21:00:00Z",
			end: "2025-04-13T21:00:00Z",
			url: "https://plaidctf.com",
			ctftime_id: 3001,
			assigned_weight_points: 92,
			status: "upcoming" as ContestStatus,
			participantCount: 0,
			totalRatings: 0,
			places: [],
		},
		{
			id: 8,
			name: "midnight-sun-ctf-2025",
			description: "Swedish CTF with challenging reverse engineering",
			start: "2025-03-29T10:00:00Z",
			end: "2025-03-30T10:00:00Z",
			url: "https://midnightsunctf.se",
			ctftime_id: 2987,
			assigned_weight_points: 78,
			status: "upcoming" as ContestStatus,
			participantCount: 0,
			totalRatings: 0,
			places: [],
		},
	];

	const offset = params?.offset || 0;
	const limit = params?.limit || 20;
	const total = 156;

	return {
		items: mockContests.slice(offset, offset + limit),
		pagination: {
			offset,
			limit,
			total,
			hasNext: offset + limit < total,
			hasPrev: offset > 0,
			totalPages: Math.ceil(total / limit),
			currentPage: Math.floor(offset / limit),
		},
	};
};

export const getContest = async (contestId: number): Promise<Contest> => {
	await sleep(1000);
	// TODO: implement getContest
	const allContests = await getContests({ limit: 50 });
	const contest = allContests.items.find(c => c.id === contestId);
	
	if (!contest) {
		throw new Error(`Contest with ID ${contestId} not found`);
	}
	
	return contest;
};

export const createContest = async (contestData: CreateContestDto): Promise<Contest> => {
	await sleep(1000);
	// TODO: implement createContest
	return {
		id: Math.floor(Math.random() * 1000) + 100,
		name: contestData.name,
		description: contestData.description,
		rules: contestData.rules,
		prizes: contestData.prizes,
		start: contestData.start,
		end: contestData.end,
		url: contestData.url,
		ctftime_id: contestData.ctftimeId,
		assigned_weight_points: 0,
		status: "upcoming" as ContestStatus,
		participantCount: 0,
		places: [],
	} as Contest;
};

export const rateContest = async (_data: RateContestDto): Promise<{ success: boolean }> => {
	await sleep(1000);
	// TODO: implement rateContest
	return { success: true };
};