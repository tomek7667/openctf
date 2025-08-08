import { sleep } from "@/lib/utils";
import type { Team, ListTeamsDto, CreateTeamDto, PaginatedResponse } from "@/types/api";

export const getTeams = async (params?: ListTeamsDto): Promise<PaginatedResponse<Team>> => {
	await sleep(1000);
	// TODO: implement getTeams
	const mockTeams: Team[] = [
		{
			id: 1,
			name: "r3kapig",
			description: "CTF team from China focusing on binary exploitation and reverse engineering",
			country_code: "CN",
			ctftime_id: 22319,
			verified_at: new Date().toString(),
		},
		{
			id: 2,
			name: "Kalmarunionen",
			description: "Nordic CTF team specializing in web security and cryptography",
			country_code: "DK",
			ctftime_id: 38914,
			verified_at: new Date().toString(),
		},
		{
			id: 3,
			name: "Infobahn",
			description: "German cybersecurity experts with focus on advanced persistent threats",
			country_code: "DE",
			ctftime_id: 45672,
			verified_at: new Date().toString(),
		},
		{
			id: 4,
			name: "perfect blue",
			description: "Elite US-based CTF team known for innovative exploitation techniques",
			country_code: "US",
			ctftime_id: 53370,
			verified_at: new Date().toString(),
		},
		{
			id: 5,
			name: "Shellphish",
			description: "Academic CTF team from UC Santa Barbara with strong research focus",
			country_code: "US",
			ctftime_id: 285,
			verified_at: new Date().toString(),
		},
		{
			id: 6,
			name: "Dragon Sector",
			description: "Polish CTF team with expertise in pwn and reverse engineering",
			country_code: "PL",
			ctftime_id: 3329,
			verified_at: new Date().toString(),
		},
		{
			id: 7,
			name: "HITCON",
			description: "Taiwanese security community and CTF organizers",
			country_code: "TW",
			ctftime_id: 8299,
			verified_at: new Date().toString(),
		},
		{
			id: 8,
			name: "TSJ",
			description: "Japanese CTF team specializing in crypto and forensics",
			country_code: "JP",
			ctftime_id: 12611,
			verified_at: new Date().toString(),
		},
		{
			id: 9,
			name: "LCBC",
			description: "French CTF team from various cybersecurity backgrounds",
			country_code: "FR",
			ctftime_id: 28394,
			verified_at: new Date().toString(),
		},
		{
			id: 10,
			name: "organizers",
			description: "Korean CTF team and competition organizers",
			country_code: "KR",
			ctftime_id: 4419,
			verified_at: new Date().toString(),
		},
	];

	const offset = params?.offset || 0;
	const limit = params?.limit || 30;
	const total = 2847;

	return {
		items: mockTeams.slice(offset, offset + limit),
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
	// TODO: implement createTeam
	return {
		id: Math.floor(Math.random() * 1000) + 100,
		name: teamData.name,
		description: teamData.description,
		country_code: "global",
	};
};

export const searchTeams = async (query: string, limit: number = 10): Promise<Team[]> => {
	await sleep(1000);
	// TODO: implement searchTeams
	const teams = await getTeams({ limit: 50 });
	return teams.items
		.filter((team) => team.name.toLowerCase().includes(query.toLowerCase()))
		.slice(0, limit);
};