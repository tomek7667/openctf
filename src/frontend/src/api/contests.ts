import { sleep } from "@/lib/utils";
import { ApiResponse } from "@/types/api";

export interface ContestChallenge {
	id: string;
	name: string;
	category:
		| "web"
		| "crypto"
		| "reverse"
		| "pwn"
		| "forensics"
		| "misc"
		| "hardware";
	points: number;
	solves: number;
	difficulty: "Easy" | "Medium" | "Hard" | "Insane";
	description?: string;
	tags: string[];
	firstBloodTeam?: string;
	firstBloodTime?: string;
}

export interface ContestParticipant {
	id: string;
	type: "team" | "individual";
	name: string;
	members?: string[];
	country?: string;
	registeredAt: string;
	isActive: boolean;
}

export interface ContestRegistration {
	id: string;
	contestId: string;
	participantId: string;
	participantType: "team" | "individual";
	participantName: string;
	registeredAt: string;
	status: "registered" | "confirmed" | "cancelled";
	metadata?: {
		contactEmail?: string;
		additionalInfo?: string;
	};
}

export interface ContestResult {
	id: string;
	contestId: string;
	participantId: string;
	participantName: string;
	participantType: "team" | "individual";
	rank: number;
	score: number;
	solves: Array<{
		challengeId: string;
		challengeName: string;
		points: number;
		solvedAt: string;
		timeToSolve: number; // in minutes
	}>;
	country?: string;
	finalRank: number;
	ratingChange?: number;
}

export interface LiveLeaderboard {
	contestId: string;
	lastUpdated: string;
	entries: Array<{
		rank: number;
		participantId: string;
		participantName: string;
		participantType: "team" | "individual";
		score: number;
		solves: number;
		lastSolve?: string;
		country?: string;
		isActive: boolean;
	}>;
	totalParticipants: number;
	totalChallenges: number;
}

export interface Contest {
	id: string;
	name: string;
	description: string;
	format: "jeopardy" | "attack-defense" | "king-of-the-hill" | "mixed";
	difficulty: "beginner" | "intermediate" | "advanced" | "expert";

	// Timing
	startTime: string;
	endTime: string;
	duration: number; // in hours
	timezone: string;

	// Registration
	registrationStart: string;
	registrationEnd: string;
	maxParticipants?: number;
	allowIndividuals: boolean;
	allowTeams: boolean;
	maxTeamSize: number;
	minTeamSize: number;

	// Organization
	organizer: string;
	organizerLogo?: string;
	organizerWebsite?: string;
	logoUrl?: string;
	bannerUrl?: string;
	website?: string;

	// Pricing & Prizes
	entryFee?: number;
	currency?: string;
	prizes: Array<{
		rank: number;
		description: string;
		value?: number;
		currency?: string;
	}>;

	// Status
	status:
		| "upcoming"
		| "registration-open"
		| "registration-closed"
		| "live"
		| "finished"
		| "cancelled";
	visibility: "public" | "private" | "invite-only";

	// Participation
	participantCount: number;
	teamCount: number;
	individualCount: number;
	registeredParticipants?: ContestParticipant[];

	// Challenges & Scoring
	challenges?: ContestChallenge[];
	totalChallenges: number;
	scoringMode: "static" | "dynamic" | "custom";

	// CTFtime Integration
	ctftimeId?: number;
	ctftimeUrl?: string;
	weight?: number; // CTFtime weight

	// Metadata
	tags: string[];
	country?: string;
	language: string;
	rulesUrl?: string;
	discordUrl?: string;

	// Statistics
	statistics: {
		totalSolves: number;
		avgScore: number;
		topScore: number;
		challengeStats: Array<{
			category: string;
			count: number;
			avgSolves: number;
		}>;
	};

	// Timestamps
	createdAt: string;
	updatedAt: string;
}

export interface ContestFilters {
	search?: string;
	format?: string;
	difficulty?: string;
	status?: string;
	upcoming?: boolean;
	live?: boolean;
	finished?: boolean;
	organizer?: string;
	country?: string;
	hasRegOpen?: boolean;
	hasPrizes?: boolean;
	freeEntry?: boolean;
	dateRange?: {
		start?: string;
		end?: string;
	};
	tags?: string[];
	sortBy?: "newest" | "oldest" | "start-time" | "participants" | "prizes";
}

export interface ContestListResponse {
	contests: Contest[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Base mock contests data
const mockContests: Contest[] = [
	{
		id: "contest-001",
		name: "CyberDefenders Global CTF 2024",
		description:
			"The premier international cybersecurity competition featuring challenges across all domains. Join teams from around the world competing for $50,000 in prizes.",
		format: "jeopardy",
		difficulty: "advanced",

		startTime: "2024-03-15T18:00:00Z",
		endTime: "2024-03-17T18:00:00Z",
		duration: 48,
		timezone: "UTC",

		registrationStart: "2024-02-01T00:00:00Z",
		registrationEnd: "2024-03-14T23:59:59Z",
		maxParticipants: 500,
		allowIndividuals: false,
		allowTeams: true,
		maxTeamSize: 5,
		minTeamSize: 1,

		organizer: "CyberDefenders Alliance",
		organizerLogo:
			"https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=64&h=64&fit=crop",
		organizerWebsite: "https://cyberdefenders.org",
		logoUrl:
			"https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop",
		bannerUrl:
			"https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop",
		website: "https://ctf.cyberdefenders.org",

		entryFee: 0,
		currency: "USD",
		prizes: [
			{ rank: 1, description: "First Place", value: 25000, currency: "USD" },
			{ rank: 2, description: "Second Place", value: 15000, currency: "USD" },
			{ rank: 3, description: "Third Place", value: 10000, currency: "USD" },
			{ rank: 4, description: "Fourth Place", value: 5000, currency: "USD" },
			{ rank: 5, description: "Fifth Place", value: 2500, currency: "USD" },
		],

		status: "registration-open",
		visibility: "public",

		participantCount: 156,
		teamCount: 156,
		individualCount: 0,

		totalChallenges: 25,
		scoringMode: "dynamic",

		ctftimeId: 2024001,
		ctftimeUrl: "https://ctftime.org/event/2024001",
		weight: 25.0,

		tags: ["international", "jeopardy", "prizes", "ctftime"],
		country: "US",
		language: "English",
		rulesUrl: "https://ctf.cyberdefenders.org/rules",
		discordUrl: "https://discord.gg/cyberdefenders",

		statistics: {
			totalSolves: 0,
			avgScore: 0,
			topScore: 0,
			challengeStats: [
				{ category: "web", count: 5, avgSolves: 0 },
				{ category: "crypto", count: 5, avgSolves: 0 },
				{ category: "pwn", count: 4, avgSolves: 0 },
				{ category: "reverse", count: 4, avgSolves: 0 },
				{ category: "forensics", count: 4, avgSolves: 0 },
				{ category: "misc", count: 3, avgSolves: 0 },
			],
		},

		createdAt: "2024-01-15T00:00:00Z",
		updatedAt: "2024-01-20T12:00:00Z",
	},

	{
		id: "contest-002",
		name: "NorthSec 2024",
		description:
			"Canada's premier cybersecurity conference and CTF competition. Two days of intense competition in beautiful Montreal.",
		format: "jeopardy",
		difficulty: "intermediate",

		startTime: "2024-05-17T13:00:00Z",
		endTime: "2024-05-18T21:00:00Z",
		duration: 32,
		timezone: "America/Montreal",

		registrationStart: "2024-03-01T00:00:00Z",
		registrationEnd: "2024-05-10T23:59:59Z",
		maxParticipants: 200,
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 4,
		minTeamSize: 1,

		organizer: "NorthSec Organization",
		organizerWebsite: "https://nsec.io",
		logoUrl:
			"https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=200&h=200&fit=crop",
		bannerUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=200&fit=crop",
		website: "https://ctf.nsec.io",

		entryFee: 50,
		currency: "CAD",
		prizes: [
			{
				rank: 1,
				description: "Winner Trophy + Conference Tickets",
				value: 2000,
				currency: "CAD",
			},
			{
				rank: 2,
				description: "Runner-up Trophy + Conference Tickets",
				value: 1000,
				currency: "CAD",
			},
			{
				rank: 3,
				description: "Third Place Trophy + Conference Tickets",
				value: 500,
				currency: "CAD",
			},
		],

		status: "upcoming",
		visibility: "public",

		participantCount: 0,
		teamCount: 0,
		individualCount: 0,

		totalChallenges: 20,
		scoringMode: "static",

		ctftimeId: 2024002,
		ctftimeUrl: "https://ctftime.org/event/2024002",
		weight: 23.5,

		tags: ["conference", "canada", "on-site", "ctftime"],
		country: "CA",
		language: "English",
		rulesUrl: "https://ctf.nsec.io/rules",

		statistics: {
			totalSolves: 0,
			avgScore: 0,
			topScore: 0,
			challengeStats: [],
		},

		createdAt: "2024-01-10T00:00:00Z",
		updatedAt: "2024-01-15T10:00:00Z",
	},

	{
		id: "contest-003",
		name: "picoCTF 2024",
		description:
			"Educational CTF designed for high school students and beginners. Perfect for learning cybersecurity fundamentals.",
		format: "jeopardy",
		difficulty: "beginner",

		startTime: "2024-03-12T00:00:00Z",
		endTime: "2024-03-26T23:59:59Z",
		duration: 336, // 14 days
		timezone: "UTC",

		registrationStart: "2024-02-01T00:00:00Z",
		registrationEnd: "2024-03-25T23:59:59Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 5,
		minTeamSize: 1,

		organizer: "Carnegie Mellon University",
		organizerLogo:
			"https://images.unsplash.com/photo-1562774053-701939374585?w=64&h=64&fit=crop",
		organizerWebsite: "https://cmu.edu",
		logoUrl:
			"https://images.unsplash.com/photo-1509909756405-be0199881695?w=200&h=200&fit=crop",
		bannerUrl:
			"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop",
		website: "https://picoctf.org",

		entryFee: 0,
		currency: "USD",
		prizes: [
			{ rank: 1, description: "picoCTF Champions", value: 0, currency: "USD" },
			{
				rank: 2,
				description: "Runner-up Certificate",
				value: 0,
				currency: "USD",
			},
			{
				rank: 3,
				description: "Third Place Certificate",
				value: 0,
				currency: "USD",
			},
		],

		status: "live",
		visibility: "public",

		participantCount: 2847,
		teamCount: 1203,
		individualCount: 1644,

		totalChallenges: 50,
		scoringMode: "static",

		ctftimeId: 2024003,
		ctftimeUrl: "https://ctftime.org/event/2024003",
		weight: 0, // Educational, not rated

		tags: ["educational", "beginner", "students", "free"],
		country: "US",
		language: "English",
		rulesUrl: "https://picoctf.org/rules",

		statistics: {
			totalSolves: 45267,
			avgScore: 2341,
			topScore: 8950,
			challengeStats: [
				{ category: "web", count: 8, avgSolves: 156 },
				{ category: "crypto", count: 10, avgSolves: 89 },
				{ category: "forensics", count: 8, avgSolves: 134 },
				{ category: "reverse", count: 8, avgSolves: 67 },
				{ category: "pwn", count: 6, avgSolves: 34 },
				{ category: "misc", count: 10, avgSolves: 203 },
			],
		},

		createdAt: "2023-12-01T00:00:00Z",
		updatedAt: "2024-01-20T15:30:00Z",
	},

	{
		id: "contest-004",
		name: "BSides SF CTF 2024",
		description:
			"Annual CTF competition held alongside BSides San Francisco. Challenging problems for security professionals.",
		format: "jeopardy",
		difficulty: "advanced",

		startTime: "2024-04-27T17:00:00Z",
		endTime: "2024-04-28T17:00:00Z",
		duration: 24,
		timezone: "America/Los_Angeles",

		registrationStart: "2024-04-01T00:00:00Z",
		registrationEnd: "2024-04-27T16:00:00Z",
		maxParticipants: 300,
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 6,
		minTeamSize: 1,

		organizer: "BSides San Francisco",
		organizerWebsite: "https://bsidessf.org",
		logoUrl:
			"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop",
		website: "https://ctf.bsidessf.net",

		entryFee: 0,
		currency: "USD",
		prizes: [
			{
				rank: 1,
				description: "BSides SF CTF Champions",
				value: 0,
				currency: "USD",
			},
			{
				rank: 2,
				description: "Second Place Recognition",
				value: 0,
				currency: "USD",
			},
			{
				rank: 3,
				description: "Third Place Recognition",
				value: 0,
				currency: "USD",
			},
		],

		status: "finished",
		visibility: "public",

		participantCount: 267,
		teamCount: 189,
		individualCount: 78,

		totalChallenges: 18,
		scoringMode: "dynamic",

		ctftimeId: 2024004,
		ctftimeUrl: "https://ctftime.org/event/2024004",
		weight: 22.3,

		tags: ["conference", "san-francisco", "free", "ctftime"],
		country: "US",
		language: "English",
		rulesUrl: "https://ctf.bsidessf.net/rules",

		statistics: {
			totalSolves: 1456,
			avgScore: 1247,
			topScore: 4567,
			challengeStats: [
				{ category: "web", count: 4, avgSolves: 45 },
				{ category: "crypto", count: 3, avgSolves: 23 },
				{ category: "pwn", count: 3, avgSolves: 12 },
				{ category: "reverse", count: 3, avgSolves: 18 },
				{ category: "forensics", count: 3, avgSolves: 34 },
				{ category: "misc", count: 2, avgSolves: 67 },
			],
		},

		createdAt: "2023-11-15T00:00:00Z",
		updatedAt: "2024-04-28T18:00:00Z",
	},

	{
		id: "contest-005",
		name: "DEFCON CTF Quals 2024",
		description: "The legendary DEFCON CTF qualifiers. Only the best teams advance to compete at DEFCON in Las Vegas.",
		format: "jeopardy",
		difficulty: "expert",
		startTime: "2024-05-04T00:00:00Z",
		endTime: "2024-05-06T00:00:00Z",
		duration: 48,
		timezone: "UTC",
		registrationStart: "2024-04-01T00:00:00Z",
		registrationEnd: "2024-05-03T23:59:59Z",
		allowIndividuals: false,
		allowTeams: true,
		maxTeamSize: 8,
		minTeamSize: 3,
		organizer: "DEFCON",
		organizerWebsite: "https://defcon.org",
		website: "https://oooverflow.io",
		entryFee: 0,
		prizes: [{ rank: 1, description: "DEFCON Finals Qualification", value: 0 }],
		status: "upcoming",
		visibility: "public",
		participantCount: 0,
		teamCount: 0,
		individualCount: 0,
		totalChallenges: 15,
		scoringMode: "dynamic",
		ctftimeId: 2024005,
		weight: 100.0,
		tags: ["defcon", "elite", "qualifiers", "ctftime"],
		country: "US",
		language: "English",
		statistics: { totalSolves: 0, avgScore: 0, topScore: 0, challengeStats: [] },
		createdAt: "2024-01-01T00:00:00Z",
		updatedAt: "2024-01-01T00:00:00Z",
	},

	{
		id: "contest-006",
		name: "Google CTF 2024",
		description: "Google's annual cybersecurity competition featuring cutting-edge challenges and innovative problem-solving.",
		format: "jeopardy",
		difficulty: "advanced",
		startTime: "2024-06-21T18:00:00Z",
		endTime: "2024-06-23T18:00:00Z",
		duration: 48,
		timezone: "UTC",
		registrationStart: "2024-05-01T00:00:00Z",
		registrationEnd: "2024-06-21T17:00:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 4,
		minTeamSize: 1,
		organizer: "Google",
		organizerWebsite: "https://google.com",
		website: "https://capturetheflag.withgoogle.com",
		entryFee: 0,
		prizes: [
			{ rank: 1, description: "Google CTF Champions", value: 13370, currency: "USD" },
			{ rank: 2, description: "Second Place", value: 7331, currency: "USD" },
			{ rank: 3, description: "Third Place", value: 3133, currency: "USD" }
		],
		status: "upcoming",
		visibility: "public",
		participantCount: 0,
		teamCount: 0,
		individualCount: 0,
		totalChallenges: 20,
		scoringMode: "static",
		ctftimeId: 2024006,
		weight: 37.5,
		tags: ["google", "international", "prizes", "ctftime"],
		country: "US",
		language: "English",
		statistics: { totalSolves: 0, avgScore: 0, topScore: 0, challengeStats: [] },
		createdAt: "2024-01-05T00:00:00Z",
		updatedAt: "2024-01-05T00:00:00Z",
	},

	{
		id: "contest-007",
		name: "HackTheBox University CTF 2024",
		description: "University-focused CTF competition designed for students and academic teams worldwide.",
		format: "jeopardy",
		difficulty: "intermediate",
		startTime: "2024-04-12T16:00:00Z",
		endTime: "2024-04-14T16:00:00Z",
		duration: 48,
		timezone: "UTC",
		registrationStart: "2024-03-01T00:00:00Z",
		registrationEnd: "2024-04-11T23:59:59Z",
		allowIndividuals: false,
		allowTeams: true,
		maxTeamSize: 5,
		minTeamSize: 2,
		organizer: "HackTheBox",
		organizerWebsite: "https://hackthebox.com",
		website: "https://ctf.hackthebox.com",
		entryFee: 0,
		prizes: [
			{ rank: 1, description: "HTB VIP+ Subscriptions", value: 2000, currency: "USD" },
			{ rank: 2, description: "HTB VIP Subscriptions", value: 1000, currency: "USD" },
			{ rank: 3, description: "HTB Swag Package", value: 500, currency: "USD" }
		],
		status: "finished",
		visibility: "public",
		participantCount: 423,
		teamCount: 423,
		individualCount: 0,
		totalChallenges: 22,
		scoringMode: "dynamic",
		ctftimeId: 2024007,
		weight: 28.7,
		tags: ["university", "students", "hackthebox", "ctftime"],
		country: "UK",
		language: "English",
		statistics: {
			totalSolves: 2341,
			avgScore: 1876,
			topScore: 5432,
			challengeStats: [
				{ category: "web", count: 5, avgSolves: 67 },
				{ category: "crypto", count: 4, avgSolves: 34 },
				{ category: "pwn", count: 4, avgSolves: 23 },
				{ category: "reverse", count: 4, avgSolves: 28 },
				{ category: "forensics", count: 3, avgSolves: 45 },
				{ category: "misc", count: 2, avgSolves: 89 }
			]
		},
		createdAt: "2024-02-01T00:00:00Z",
		updatedAt: "2024-04-14T17:00:00Z",
	},

	{
		id: "contest-008",
		name: "PlaidCTF 2024",
		description: "Carnegie Mellon's Plaid Parliament of Pwning presents their annual high-quality CTF competition.",
		format: "jeopardy",
		difficulty: "expert",
		startTime: "2024-04-19T21:00:00Z",
		endTime: "2024-04-21T21:00:00Z",
		duration: 48,
		timezone: "America/New_York",
		registrationStart: "2024-04-01T00:00:00Z",
		registrationEnd: "2024-04-19T20:00:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 6,
		minTeamSize: 1,
		organizer: "Plaid Parliament of Pwning",
		organizerWebsite: "https://pwning.net",
		website: "https://plaidctf.com",
		entryFee: 0,
		prizes: [{ rank: 1, description: "PlaidCTF Champions", value: 0 }],
		status: "finished",
		visibility: "public",
		participantCount: 1247,
		teamCount: 892,
		individualCount: 355,
		totalChallenges: 16,
		scoringMode: "dynamic",
		ctftimeId: 2024008,
		weight: 45.2,
		tags: ["plaid", "cmu", "expert", "ctftime"],
		country: "US",
		language: "English",
		statistics: {
			totalSolves: 3456,
			avgScore: 987,
			topScore: 3421,
			challengeStats: [
				{ category: "pwn", count: 5, avgSolves: 12 },
				{ category: "crypto", count: 4, avgSolves: 18 },
				{ category: "web", count: 3, avgSolves: 34 },
				{ category: "reverse", count: 2, avgSolves: 8 },
				{ category: "misc", count: 2, avgSolves: 67 }
			]
		},
		createdAt: "2024-01-20T00:00:00Z",
		updatedAt: "2024-04-21T22:00:00Z",
	},

	// 6 LIVE CONTESTS
	{
		id: "live-001",
		name: "CyberApocalypse CTF 2024",
		description: "HackTheBox's flagship CTF event with space-themed challenges.",
		format: "jeopardy",
		difficulty: "intermediate",
		startTime: "2024-03-09T14:00:00Z",
		endTime: "2024-03-14T14:00:00Z",
		duration: 120,
		timezone: "UTC",
		registrationStart: "2024-02-01T00:00:00Z",
		registrationEnd: "2024-03-09T13:00:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 4,
		minTeamSize: 1,
		organizer: "HackTheBox",
		organizerWebsite: "https://hackthebox.com",
		website: "https://ctf.hackthebox.com",
		entryFee: 0,
		prizes: [{ rank: 1, description: "HTB Swag + VIP", value: 1000, currency: "USD" }],
		status: "live",
		visibility: "public",
		participantCount: 8934,
		teamCount: 3421,
		individualCount: 5513,
		totalChallenges: 28,
		scoringMode: "dynamic",
		ctftimeId: 2024101,
		weight: 32.1,
		tags: ["hackthebox", "space", "intermediate", "ctftime"],
		country: "UK",
		language: "English",
		statistics: { totalSolves: 12456, avgScore: 1234, topScore: 4567, challengeStats: [] },
		createdAt: "2024-02-01T00:00:00Z",
		updatedAt: "2024-03-12T10:00:00Z",
	},
	{
		id: "live-002",
		name: "VolgaCTF 2024 Qualifier",
		description: "Russian CTF competition with high-quality challenges.",
		format: "jeopardy",
		difficulty: "advanced",
		startTime: "2024-03-11T12:00:00Z",
		endTime: "2024-03-13T12:00:00Z",
		duration: 48,
		timezone: "Europe/Moscow",
		registrationStart: "2024-02-15T00:00:00Z",
		registrationEnd: "2024-03-11T11:00:00Z",
		allowIndividuals: false,
		allowTeams: true,
		maxTeamSize: 5,
		minTeamSize: 2,
		organizer: "VolgaCTF",
		organizerWebsite: "https://volgactf.ru",
		website: "https://volgactf.ru",
		entryFee: 0,
		prizes: [{ rank: 1, description: "VolgaCTF Champions", value: 0 }],
		status: "live",
		visibility: "public",
		participantCount: 567,
		teamCount: 567,
		individualCount: 0,
		totalChallenges: 24,
		scoringMode: "dynamic",
		ctftimeId: 2024102,
		weight: 28.9,
		tags: ["volga", "russia", "qualifier", "ctftime"],
		country: "RU",
		language: "English",
		statistics: { totalSolves: 3456, avgScore: 987, topScore: 2345, challengeStats: [] },
		createdAt: "2024-02-10T00:00:00Z",
		updatedAt: "2024-03-12T15:00:00Z",
	},
	{
		id: "live-003",
		name: "ASIS CTF Quals 2024",
		description: "Iranian CTF team's annual qualification round.",
		format: "jeopardy",
		difficulty: "expert",
		startTime: "2024-03-10T20:30:00Z",
		endTime: "2024-03-12T20:30:00Z",
		duration: 48,
		timezone: "Asia/Tehran",
		registrationStart: "2024-02-20T00:00:00Z",
		registrationEnd: "2024-03-10T19:30:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 4,
		minTeamSize: 1,
		organizer: "ASIS CTF Team",
		organizerWebsite: "https://asisctf.com",
		website: "https://asisctf.com",
		entryFee: 0,
		prizes: [{ rank: 1, description: "ASIS Finals Qualification", value: 0 }],
		status: "live",
		visibility: "public",
		participantCount: 892,
		teamCount: 634,
		individualCount: 258,
		totalChallenges: 18,
		scoringMode: "dynamic",
		ctftimeId: 2024103,
		weight: 41.2,
		tags: ["asis", "iran", "qualifier", "expert", "ctftime"],
		country: "IR",
		language: "English",
		statistics: { totalSolves: 1234, avgScore: 567, topScore: 1890, challengeStats: [] },
		createdAt: "2024-02-15T00:00:00Z",
		updatedAt: "2024-03-11T22:00:00Z",
	},
	{
		id: "live-004",
		name: "0CTF/TCTF 2024 Quals",
		description: "Chinese top-tier CTF qualification round.",
		format: "jeopardy",
		difficulty: "expert",
		startTime: "2024-03-11T02:00:00Z",
		endTime: "2024-03-13T02:00:00Z",
		duration: 48,
		timezone: "Asia/Shanghai",
		registrationStart: "2024-02-25T00:00:00Z",
		registrationEnd: "2024-03-11T01:00:00Z",
		allowIndividuals: false,
		allowTeams: true,
		maxTeamSize: 6,
		minTeamSize: 3,
		organizer: "0ops Team",
		organizerWebsite: "https://0ops.sjtu.edu.cn",
		website: "https://ctf.0ops.sjtu.edu.cn",
		entryFee: 0,
		prizes: [{ rank: 1, description: "0CTF Finals Qualification", value: 0 }],
		status: "live",
		visibility: "public",
		participantCount: 445,
		teamCount: 445,
		individualCount: 0,
		totalChallenges: 15,
		scoringMode: "dynamic",
		ctftimeId: 2024104,
		weight: 52.3,
		tags: ["0ctf", "china", "qualifier", "expert", "ctftime"],
		country: "CN",
		language: "English",
		statistics: { totalSolves: 789, avgScore: 234, topScore: 1456, challengeStats: [] },
		createdAt: "2024-02-20T00:00:00Z",
		updatedAt: "2024-03-12T08:00:00Z",
	},
	{
		id: "live-005",
		name: "LINE CTF 2024",
		description: "Japanese messaging company's annual CTF competition.",
		format: "jeopardy",
		difficulty: "advanced",
		startTime: "2024-03-12T05:00:00Z",
		endTime: "2024-03-13T05:00:00Z",
		duration: 24,
		timezone: "Asia/Tokyo",
		registrationStart: "2024-03-01T00:00:00Z",
		registrationEnd: "2024-03-12T04:00:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 4,
		minTeamSize: 1,
		organizer: "LINE Corporation",
		organizerWebsite: "https://linecorp.com",
		website: "https://linectf.me",
		entryFee: 0,
		prizes: [{ rank: 1, description: "LINE Swag Package", value: 500, currency: "USD" }],
		status: "live",
		visibility: "public",
		participantCount: 1234,
		teamCount: 789,
		individualCount: 445,
		totalChallenges: 20,
		scoringMode: "static",
		ctftimeId: 2024105,
		weight: 25.7,
		tags: ["line", "japan", "corporate", "ctftime"],
		country: "JP",
		language: "English",
		statistics: { totalSolves: 2345, avgScore: 678, topScore: 1789, challengeStats: [] },
		createdAt: "2024-02-28T00:00:00Z",
		updatedAt: "2024-03-12T12:00:00Z",
	},
	{
		id: "live-006",
		name: "Midnight Sun CTF 2024 Quals",
		description: "Swedish CTF team's qualification round with Nordic themes.",
		format: "jeopardy",
		difficulty: "advanced",
		startTime: "2024-03-11T18:00:00Z",
		endTime: "2024-03-13T18:00:00Z",
		duration: 48,
		timezone: "Europe/Stockholm",
		registrationStart: "2024-02-28T00:00:00Z",
		registrationEnd: "2024-03-11T17:00:00Z",
		allowIndividuals: true,
		allowTeams: true,
		maxTeamSize: 5,
		minTeamSize: 1,
		organizer: "Midnight Sun CTF",
		organizerWebsite: "https://midnightsunctf.se",
		website: "https://midnightsunctf.se",
		entryFee: 0,
		prizes: [{ rank: 1, description: "Nordic Champions", value: 0 }],
		status: "live",
		visibility: "public",
		participantCount: 678,
		teamCount: 456,
		individualCount: 222,
		totalChallenges: 22,
		scoringMode: "dynamic",
		ctftimeId: 2024106,
		weight: 31.4,
		tags: ["midnight", "sweden", "nordic", "qualifier", "ctftime"],
		country: "SE",
		language: "English",
		statistics: { totalSolves: 1567, avgScore: 445, topScore: 1234, challengeStats: [] },
		createdAt: "2024-02-25T00:00:00Z",
		updatedAt: "2024-03-12T20:00:00Z",
	}
];

// Generate 40 upcoming contests
const upcomingContests = Array.from({ length: 40 }, (_, i) => {
	const startHour = Math.floor(Math.random() * 24);
	const startDate = new Date(2024, 2, 15 + i, startHour); // Starting from March 15, 2024, each contest on different day with random hour
	const duration = 24 + Math.floor(Math.random() * 48);
	const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);
	const regStart = new Date(startDate.getTime() - (7 + Math.random() * 14) * 24 * 60 * 60 * 1000);
	const regEnd = new Date(startDate.getTime() - 60 * 60 * 1000);
	
	const organizers = ["CyberSec Corp", "HackLab", "SecureNet", "CyberGuards", "InfoSec Alliance", "TechDefenders", "CyberWarriors", "SecureTech"];
	const countries = ["US", "UK", "DE", "FR", "JP", "KR", "CA", "AU", "NL", "SE"];
	const difficulties = ["beginner", "intermediate", "advanced", "expert"];
	const formats = ["jeopardy", "attack-defense", "king-of-the-hill", "mixed"];
	
	const selectedOrganizer = organizers[i % organizers.length];
	
	return {
		id: `upcoming-${String(i + 1).padStart(3, '0')}`,
		name: `${selectedOrganizer} CTF ${2024 + Math.floor(i / 20)}`,
		description: `Cybersecurity competition featuring diverse challenges across multiple categories. Join teams worldwide in this exciting event.`,
		format: formats[i % formats.length] as any,
		difficulty: difficulties[i % difficulties.length] as any,
		startTime: startDate.toISOString(),
		endTime: endDate.toISOString(),
		duration: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)),
		timezone: "UTC",
		registrationStart: regStart.toISOString(),
		registrationEnd: regEnd.toISOString(),
		maxParticipants: Math.floor(Math.random() * 500) + 100,
		allowIndividuals: Math.random() > 0.3,
		allowTeams: true,
		maxTeamSize: 3 + Math.floor(Math.random() * 4),
		minTeamSize: 1,
		organizer: selectedOrganizer || "Unknown Organizer",
		organizerWebsite: `https://${(selectedOrganizer || "unknown").toLowerCase().replace(/\s+/g, '')}.com`,
		website: `https://ctf.${(selectedOrganizer || "unknown").toLowerCase().replace(/\s+/g, '')}.com`,
		entryFee: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0,
		prizes: [{ rank: 1, description: "Champion Trophy", value: Math.floor(Math.random() * 5000), currency: "USD" }],
		status: "upcoming" as any,
		visibility: "public" as any,
		participantCount: 0,
		teamCount: 0,
		individualCount: 0,
		totalChallenges: 15 + Math.floor(Math.random() * 20),
		scoringMode: Math.random() > 0.5 ? "dynamic" : "static" as any,
		ctftimeId: 2024200 + i,
		weight: Math.round((Math.random() * 50 + 10) * 10) / 10,
		tags: ["upcoming", "ctftime", (countries[i % countries.length] || "us").toLowerCase()],
		country: countries[i % countries.length] || "US",
		language: "English",
		statistics: { totalSolves: 0, avgScore: 0, topScore: 0, challengeStats: [] },
		createdAt: new Date(2024, 1, 1 + i).toISOString(),
		updatedAt: new Date(2024, 1, 1 + i).toISOString(),
	};
});

// Generate 150 finished contests
const finishedContests = Array.from({ length: 150 }, (_, i) => {
	const endDate = new Date(2024, 1, 1 + Math.floor(i / 3)); // Ending from Feb 1, 2024
	const startDate = new Date(endDate.getTime() - (24 + Math.random() * 48) * 60 * 60 * 1000);
	const regStart = new Date(startDate.getTime() - (7 + Math.random() * 14) * 24 * 60 * 60 * 1000);
	const regEnd = new Date(startDate.getTime() - 60 * 60 * 1000);
	
	const organizers = ["SecureCorp", "CyberLabs", "InfoDefense", "TechSec", "CyberElite", "SecureHack", "DefenseTech", "CyberPro"];
	const countries = ["US", "UK", "DE", "FR", "JP", "KR", "CA", "AU", "NL", "SE", "IT", "ES", "BR", "IN"];
	const difficulties = ["beginner", "intermediate", "advanced", "expert"];
	const formats = ["jeopardy", "attack-defense", "king-of-the-hill", "mixed"];
	
	const participants = Math.floor(Math.random() * 2000) + 50;
	const teamRatio = Math.random() * 0.8 + 0.2;
	const teamCount = Math.floor(participants * teamRatio);
	const individualCount = participants - teamCount;
	
	return {
		id: `finished-${String(i + 1).padStart(3, '0')}`,
		name: `${organizers[i % organizers.length]} CTF ${2023 + Math.floor(i / 35)}`,
		description: `Completed cybersecurity competition with ${participants} participants. Featured challenges across web, crypto, pwn, reverse, forensics, and misc categories.`,
		format: formats[i % formats.length] as any,
		difficulty: difficulties[i % difficulties.length] as any,
		startTime: startDate.toISOString(),
		endTime: endDate.toISOString(),
		duration: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)),
		timezone: "UTC",
		registrationStart: regStart.toISOString(),
		registrationEnd: regEnd.toISOString(),
		maxParticipants: participants + Math.floor(Math.random() * 200),
		allowIndividuals: Math.random() > 0.3,
		allowTeams: true,
		maxTeamSize: 3 + Math.floor(Math.random() * 4),
		minTeamSize: 1,
		organizer: organizers[i % organizers.length] || "Unknown Organizer",
		organizerWebsite: `https://${(organizers[i % organizers.length] || "unknown").toLowerCase().replace(/\s+/g, '')}.com`,
		website: `https://ctf.${(organizers[i % organizers.length] || "unknown").toLowerCase().replace(/\s+/g, '')}.com`,
		entryFee: Math.random() > 0.8 ? Math.floor(Math.random() * 100) : 0,
		prizes: [{ rank: 1, description: "Winner", value: Math.floor(Math.random() * 10000), currency: "USD" }],
		status: "finished" as any,
		visibility: "public" as any,
		participantCount: participants,
		teamCount: teamCount,
		individualCount: individualCount,
		totalChallenges: 15 + Math.floor(Math.random() * 25),
		scoringMode: Math.random() > 0.5 ? "dynamic" : "static" as any,
		ctftimeId: 2023000 + i,
		weight: Math.round((Math.random() * 60 + 5) * 10) / 10,
		tags: ["finished", "ctftime", (countries[i % countries.length] || "us").toLowerCase()],
		country: countries[i % countries.length] || "US",
		language: "English",
		rulesUrl: `https://ctf.${(organizers[i % organizers.length] || "unknown").toLowerCase().replace(/\s+/g, '')}.com/rules`,
		statistics: {
			totalSolves: Math.floor(Math.random() * participants * 10),
			avgScore: Math.floor(Math.random() * 2000) + 500,
			topScore: Math.floor(Math.random() * 5000) + 2000,
			challengeStats: [
				{ category: "web", count: 3 + Math.floor(Math.random() * 5), avgSolves: Math.floor(Math.random() * 100) + 20 },
				{ category: "crypto", count: 3 + Math.floor(Math.random() * 4), avgSolves: Math.floor(Math.random() * 80) + 15 },
				{ category: "pwn", count: 2 + Math.floor(Math.random() * 4), avgSolves: Math.floor(Math.random() * 50) + 5 },
				{ category: "reverse", count: 2 + Math.floor(Math.random() * 4), avgSolves: Math.floor(Math.random() * 60) + 10 },
				{ category: "forensics", count: 2 + Math.floor(Math.random() * 4), avgSolves: Math.floor(Math.random() * 70) + 25 },
				{ category: "misc", count: 1 + Math.floor(Math.random() * 3), avgSolves: Math.floor(Math.random() * 90) + 30 }
			]
		},
		createdAt: new Date(2023, 10, 1 + i).toISOString(),
		updatedAt: endDate.toISOString(),
	};
});

// Combine all contests
const allMockContests = [...mockContests, ...upcomingContests, ...finishedContests];

const mockRegistrations: ContestRegistration[] = [
	{
		id: "reg-001",
		contestId: "contest-001",
		participantId: "team-001",
		participantType: "team",
		participantName: "CyberSamurai",
		registeredAt: "2024-02-15T10:30:00Z",
		status: "confirmed",
		metadata: {
			contactEmail: "captain@cybersamurai.team",
			additionalInfo: "Looking forward to the competition!",
		},
	},
];

const mockLiveLeaderboard: LiveLeaderboard = {
	contestId: "contest-003",
	lastUpdated: "2024-03-20T15:30:00Z",
	entries: [
		{
			rank: 1,
			participantId: "team-elite",
			participantName: "Elite Hackers",
			participantType: "team",
			score: 8950,
			solves: 47,
			lastSolve: "2024-03-20T15:25:00Z",
			country: "US",
			isActive: true,
		},
		{
			rank: 2,
			participantId: "team-cyber",
			participantName: "CyberNinjas",
			participantType: "team",
			score: 8234,
			solves: 45,
			lastSolve: "2024-03-20T14:50:00Z",
			country: "KR",
			isActive: true,
		},
		{
			rank: 3,
			participantId: "user-master",
			participantName: "HackMaster",
			participantType: "individual",
			score: 7890,
			solves: 44,
			lastSolve: "2024-03-20T15:10:00Z",
			country: "DE",
			isActive: false,
		},
	],
	totalParticipants: 2847,
	totalChallenges: 50,
};

// API Functions
export async function getContests(
	filters: ContestFilters = {},
	page = 1,
	limit = 12
): Promise<ApiResponse<ContestListResponse>> {
	await sleep(1000);
	// TODO: implement getContests with backend API

	let filteredContests = [...allMockContests];

	// Apply filters
	if (filters.search) {
		const search = filters.search.toLowerCase();
		filteredContests = filteredContests.filter(
			(contest) =>
				contest.name.toLowerCase().includes(search) ||
				contest.description.toLowerCase().includes(search) ||
				contest.organizer.toLowerCase().includes(search) ||
				contest.tags.some((tag) => tag.toLowerCase().includes(search))
		);
	}

	if (filters.format) {
		filteredContests = filteredContests.filter(
			(contest) => contest.format === filters.format
		);
	}

	if (filters.difficulty) {
		filteredContests = filteredContests.filter(
			(contest) => contest.difficulty === filters.difficulty
		);
	}

	if (filters.status) {
		filteredContests = filteredContests.filter(
			(contest) => contest.status === filters.status
		);
	}

	if (filters.upcoming) {
		const now = new Date();
		filteredContests = filteredContests.filter(
			(contest) => new Date(contest.startTime) > now
		);
	}

	if (filters.live) {
		const now = new Date();
		filteredContests = filteredContests.filter(
			(contest) =>
				new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
		);
	}

	if (filters.finished) {
		const now = new Date();
		filteredContests = filteredContests.filter(
			(contest) => new Date(contest.endTime) < now
		);
	}

	if (filters.organizer) {
		filteredContests = filteredContests.filter((contest) =>
			contest.organizer.toLowerCase().includes(filters.organizer!.toLowerCase())
		);
	}

	if (filters.country) {
		filteredContests = filteredContests.filter(
			(contest) => contest.country === filters.country
		);
	}

	if (filters.hasRegOpen) {
		const now = new Date();
		filteredContests = filteredContests.filter(
			(contest) =>
				new Date(contest.registrationStart) <= now &&
				new Date(contest.registrationEnd) >= now
		);
	}

	if (filters.hasPrizes) {
		filteredContests = filteredContests.filter((contest) =>
			contest.prizes.some((prize) => prize.value && prize.value > 0)
		);
	}

	if (filters.freeEntry) {
		filteredContests = filteredContests.filter(
			(contest) => !contest.entryFee || contest.entryFee === 0
		);
	}

	if (filters.tags && filters.tags.length > 0) {
		filteredContests = filteredContests.filter((contest) =>
			filters.tags!.some((tag) => contest.tags.includes(tag))
		);
	}

	// Apply sorting
	switch (filters.sortBy) {
		case "oldest":
			filteredContests.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
			break;
		case "start-time":
			filteredContests.sort(
				(a, b) =>
					new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
			);
			break;
		case "participants":
			filteredContests.sort((a, b) => b.participantCount - a.participantCount);
			break;
		case "prizes":
			filteredContests.sort((a, b) => {
				const aMaxPrize = Math.max(...a.prizes.map((p) => p.value || 0));
				const bMaxPrize = Math.max(...b.prizes.map((p) => p.value || 0));
				return bMaxPrize - aMaxPrize;
			});
			break;
		case "newest":
		default:
			filteredContests.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			break;
	}

	// Pagination
	const total = filteredContests.length;
	const totalPages = Math.ceil(total / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedContests = filteredContests.slice(startIndex, endIndex);

	return {
		success: true,
		data: {
			contests: paginatedContests,
			total,
			page,
			limit,
			totalPages,
		},
	};
}

export async function getContest(id: string): Promise<ApiResponse<Contest>> {
	await sleep(1000);
	// TODO: implement getContest with backend API

	const contest = allMockContests.find((c) => c.id === id);

	if (!contest) {
		return {
			success: false,
			error: "Contest not found",
		};
	}

	return {
		success: true,
		data: contest,
	};
}

export async function registerForContest(
	contestId: string,
	participantId: string,
	participantType: "team" | "individual",
	metadata?: any
): Promise<ApiResponse<ContestRegistration>> {
	await sleep(1000);
	// TODO: implement registerForContest with backend API

	const contest = allMockContests.find((c) => c.id === contestId);
	if (!contest) {
		return {
			success: false,
			error: "Contest not found",
		};
	}

	const now = new Date();
	if (new Date(contest.registrationEnd) < now) {
		return {
			success: false,
			error: "Registration has closed",
		};
	}

	if (
		contest.maxParticipants &&
		contest.participantCount >= contest.maxParticipants
	) {
		return {
			success: false,
			error: "Contest is full",
		};
	}

	const newRegistration: ContestRegistration = {
		id: `reg-${Date.now()}`,
		contestId,
		participantId,
		participantType,
		participantName:
			participantType === "team" ? "Team Name" : "Individual Name",
		registeredAt: new Date().toISOString(),
		status: "registered",
		metadata,
	};

	mockRegistrations.push(newRegistration);

	// Update contest participant count
	const contestIndex = allMockContests.findIndex((c) => c.id === contestId);
	if (contestIndex !== -1) {
		const targetContest = allMockContests[contestIndex];
		if (targetContest) {
			targetContest.participantCount++;
			if (participantType === "team") {
				targetContest.teamCount++;
			} else {
				targetContest.individualCount++;
			}
		}
	}

	return {
		success: true,
		data: newRegistration,
	};
}

export async function unregisterFromContest(
	contestId: string,
	participantId: string
): Promise<ApiResponse<void>> {
	await sleep(1000);
	// TODO: implement unregisterFromContest with backend API

	const registrationIndex = mockRegistrations.findIndex(
		(reg) => reg.contestId === contestId && reg.participantId === participantId
	);

	if (registrationIndex === -1) {
		return {
			success: false,
			error: "Registration not found",
		};
	}

	const registration = mockRegistrations[registrationIndex];
	mockRegistrations.splice(registrationIndex, 1);

	// Update contest participant count
	const contestIndex = allMockContests.findIndex((c) => c.id === contestId);
	if (contestIndex !== -1) {
		const targetContest = allMockContests[contestIndex];
		if (targetContest && registration) {
			targetContest.participantCount--;
			if (registration.participantType === "team") {
				targetContest.teamCount--;
			} else {
				targetContest.individualCount--;
			}
		}
	}

	return {
		success: true,
		data: undefined,
	};
}

export async function getLiveLeaderboard(
	contestId: string
): Promise<ApiResponse<LiveLeaderboard>> {
	await sleep(1000);
	// TODO: implement getLiveLeaderboard with backend API

	// Mock live data - in real app this would come from real-time API
	return {
		success: true,
		data: {
			...mockLiveLeaderboard,
			contestId,
			lastUpdated: new Date().toISOString(),
		},
	};
}

export async function getContestResults(
	contestId: string
): Promise<ApiResponse<ContestResult[]>> {
	await sleep(1000);
	// TODO: implement getContestResults with backend API

	// Mock final results
	const mockResults: ContestResult[] = [
		{
			id: "result-001",
			contestId,
			participantId: "team-elite",
			participantName: "Elite Hackers",
			participantType: "team",
			rank: 1,
			score: 8950,
			solves: [
				{
					challengeId: "chall-001",
					challengeName: "Web Admin Panel",
					points: 500,
					solvedAt: "2024-03-12T10:30:00Z",
					timeToSolve: 45,
				},
			],
			country: "US",
			finalRank: 1,
			ratingChange: 156,
		},
	];

	return {
		success: true,
		data: mockResults,
	};
}

export async function getUserRegistrations(
	userId: string
): Promise<ApiResponse<ContestRegistration[]>> {
	await sleep(1000);
	// TODO: implement getUserRegistrations with backend API

	const userRegistrations = mockRegistrations.filter(
		(reg) => reg.participantId === userId
	);

	return {
		success: true,
		data: userRegistrations,
	};
}

export async function getUpcomingContests(
	limit = 5
): Promise<ApiResponse<Contest[]>> {
	await sleep(1000);
	// TODO: implement getUpcomingContests with backend API

	const now = new Date();
	const upcoming = allMockContests
		.filter((contest) => new Date(contest.startTime) > now)
		.sort(
			(a, b) =>
				new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
		)
		.slice(0, limit);

	return {
		success: true,
		data: upcoming,
	};
}

export async function getLiveContests(): Promise<ApiResponse<Contest[]>> {
	await sleep(1000);
	// TODO: implement getLiveContests with backend API

	const now = new Date();
	const live = allMockContests.filter(
		(contest) =>
			new Date(contest.startTime) <= now && new Date(contest.endTime) >= now
	);

	return {
		success: true,
		data: live,
	};
}
