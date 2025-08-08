import { sleep } from "@/lib/utils";
import type { Team, ListTeamsDto, CreateTeamDto, PaginatedResponse } from "@/types/api";

// Extended Team interface for rankings display
export interface TeamWithRanking extends Team {
	ranking: number;
	ratingPoints: number;
	contestsCount: number;
	avgPlace: number;
	lastActive: string;
	memberCount: number;
}

export const getTeams = async (params?: ListTeamsDto): Promise<PaginatedResponse<TeamWithRanking>> => {
	await sleep(1000);
	
	const mockTeams: TeamWithRanking[] = [
		{
			id: 1,
			name: "r3kapig",
			description: "CTF team from China focusing on binary exploitation and reverse engineering",
			country_code: "CN",
			ctftime_id: 22319,
			verified_at: new Date().toString(),
			ranking: 1,
			ratingPoints: 2847,
			contestsCount: 127,
			avgPlace: 3.2,
			lastActive: "2024-01-15T10:30:00Z",
			memberCount: 12,
		},
		{
			id: 2,
			name: "Kalmarunionen",
			description: "Nordic CTF team specializing in web security and cryptography",
			country_code: "DK",
			ctftime_id: 38914,
			verified_at: new Date().toString(),
			ranking: 2,
			ratingPoints: 2734,
			contestsCount: 89,
			avgPlace: 4.1,
			lastActive: "2024-01-14T14:22:00Z",
			memberCount: 8,
		},
		{
			id: 3,
			name: "Infobahn",
			description: "German cybersecurity experts with focus on advanced persistent threats",
			country_code: "DE",
			ctftime_id: 45672,
			verified_at: new Date().toString(),
			ranking: 3,
			ratingPoints: 2689,
			contestsCount: 156,
			avgPlace: 5.8,
			lastActive: "2024-01-13T09:15:00Z",
			memberCount: 15,
		},
		{
			id: 4,
			name: "perfect blue",
			description: "Elite US-based CTF team known for innovative exploitation techniques",
			country_code: "US",
			ctftime_id: 53370,
			verified_at: new Date().toString(),
			ranking: 4,
			ratingPoints: 2634,
			contestsCount: 98,
			avgPlace: 2.9,
			lastActive: "2024-01-15T16:45:00Z",
			memberCount: 9,
		},
		{
			id: 5,
			name: "Shellphish",
			description: "Academic CTF team from UC Santa Barbara with strong research focus",
			country_code: "US",
			ctftime_id: 285,
			verified_at: new Date().toString(),
			ranking: 5,
			ratingPoints: 2567,
			contestsCount: 203,
			avgPlace: 6.2,
			lastActive: "2024-01-12T11:30:00Z",
			memberCount: 22,
		},
		{
			id: 6,
			name: "Dragon Sector",
			description: "Polish CTF team with expertise in pwn and reverse engineering",
			country_code: "PL",
			ctftime_id: 3329,
			verified_at: new Date().toString(),
			ranking: 6,
			ratingPoints: 2489,
			contestsCount: 134,
			avgPlace: 7.1,
			lastActive: "2024-01-14T08:20:00Z",
			memberCount: 11,
		},
		{
			id: 7,
			name: "HITCON",
			description: "Taiwanese security community and CTF organizers",
			country_code: "TW",
			ctftime_id: 8299,
			verified_at: new Date().toString(),
			ranking: 7,
			ratingPoints: 2423,
			contestsCount: 78,
			avgPlace: 8.5,
			lastActive: "2024-01-13T19:10:00Z",
			memberCount: 18,
		},
		{
			id: 8,
			name: "TSJ",
			description: "Japanese CTF team specializing in crypto and forensics",
			country_code: "JP",
			ctftime_id: 12611,
			verified_at: new Date().toString(),
			ranking: 8,
			ratingPoints: 2387,
			contestsCount: 67,
			avgPlace: 9.2,
			lastActive: "2024-01-11T13:45:00Z",
			memberCount: 7,
		},
		{
			id: 9,
			name: "LCBC",
			description: "French CTF team from various cybersecurity backgrounds",
			country_code: "FR",
			ctftime_id: 28394,
			verified_at: new Date().toString(),
			ranking: 9,
			ratingPoints: 2298,
			contestsCount: 92,
			avgPlace: 12.4,
			lastActive: "2024-01-15T07:30:00Z",
			memberCount: 13,
		},
		{
			id: 10,
			name: "organizers",
			description: "Korean CTF team and competition organizers",
			country_code: "KR",
			ctftime_id: 4419,
			verified_at: new Date().toString(),
			ranking: 10,
			ratingPoints: 2245,
			contestsCount: 145,
			avgPlace: 11.8,
			lastActive: "2024-01-10T20:15:00Z",
			memberCount: 16,
		},
		{
			id: 11,
			name: "TokyoWesterns",
			description: "Japanese university CTF team with strong academic background",
			country_code: "JP",
			ctftime_id: 12345,
			verified_at: new Date().toString(),
			ranking: 11,
			ratingPoints: 2189,
			contestsCount: 83,
			avgPlace: 13.2,
			lastActive: "2024-01-14T12:00:00Z",
			memberCount: 10,
		},
		{
			id: 12,
			name: "Balsn",
			description: "Elite Taiwanese CTF team known for creative solutions",
			country_code: "TW",
			ctftime_id: 67890,
			verified_at: new Date().toString(),
			ranking: 12,
			ratingPoints: 2134,
			contestsCount: 72,
			avgPlace: 14.5,
			lastActive: "2024-01-13T15:30:00Z",
			memberCount: 8,
		},
		{
			id: 13,
			name: "ENOFLAG",
			description: "German CTF team focusing on attack and defense competitions",
			country_code: "DE",
			ctftime_id: 54321,
			verified_at: new Date().toString(),
			ranking: 13,
			ratingPoints: 2078,
			contestsCount: 95,
			avgPlace: 16.1,
			lastActive: "2024-01-12T09:45:00Z",
			memberCount: 14,
		},
		{
			id: 14,
			name: "Tea Deliverers",
			description: "Canadian CTF team with diverse security expertise",
			country_code: "CA",
			ctftime_id: 98765,
			verified_at: new Date().toString(),
			ranking: 14,
			ratingPoints: 2023,
			contestsCount: 68,
			avgPlace: 17.8,
			lastActive: "2024-01-15T11:20:00Z",
			memberCount: 9,
		},
		{
			id: 15,
			name: "Plaid Parliament of Pwning",
			description: "University-based US CTF team with academic research focus",
			country_code: "US",
			ctftime_id: 13579,
			verified_at: new Date().toString(),
			ranking: 15,
			ratingPoints: 1967,
			contestsCount: 112,
			avgPlace: 19.3,
			lastActive: "2024-01-11T16:10:00Z",
			memberCount: 17,
		},
	];

	const offset = params?.offset || 0;
	const limit = params?.limit || 30;
	const total = 2847;

	// Filter by country codes if provided
	let filteredTeams = mockTeams;
	if (params?.countryCodes && params.countryCodes.length > 0) {
		filteredTeams = mockTeams.filter(team => 
			params.countryCodes!.includes(team.country_code)
		);
	}

	return {
		items: filteredTeams.slice(offset, offset + limit),
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

export const createTeam = async (teamData: CreateTeamDto): Promise<Team> => {
	await sleep(1000);
	return {
		id: Math.floor(Math.random() * 1000) + 100,
		name: teamData.name,
		description: teamData.description,
		country_code: "global",
	};
};

export const searchTeams = async (query: string, limit: number = 10): Promise<TeamWithRanking[]> => {
	await sleep(1000);
	const teams = await getTeams({ limit: 50 });
	return teams.items
		.filter((team) => team.name.toLowerCase().includes(query.toLowerCase()))
		.slice(0, limit);
};
