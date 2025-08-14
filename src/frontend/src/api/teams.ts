import { ApiResponse } from "@/types/api";
import { Team as SchemaTeam } from "@/lib/schema";

// Extended team interface for frontend use
export interface Team extends SchemaTeam {
	// Additional computed fields for frontend
	memberCount: number;
	captainId?: string; // For backward compatibility
	statistics: {
		contestsParticipated: number;
		contestsWon: number;
		totalPoints: number;
		averageRating: number;
		bestRanking: number;
		currentRating: number;
		ratingHistory: Array<{
			date: string;
			rating: number;
			contest: string;
		}>;
	};
	recruitment: {
		isRecruiting: boolean;
		description?: string;
		requiredSkills: string[];
		preferredSkills: string[];
		minExperience?: string;
		timeCommitment?: string;
		contactMethod: "application" | "invitation_only";
		applicationDeadline?: string;
	};
	settings: {
		allowApplications: boolean;
		requireApproval: boolean;
		visibilityLevel: "public" | "members_only" | "captain_only";
	};
	socialLinks: {
		website?: string;
		discord?: string;
		slack?: string;
		github?: string;
	};
	privacy: "public" | "invite-only";
	createdAt: string;
	updatedAt: string;
}

export interface TeamFilters {
	search?: string;
	country?: string;
	minRating?: number;
	maxRating?: number;
	isRecruiting?: boolean;
	memberCount?: {
		min?: number;
		max?: number;
	};
	lastActive?: "week" | "month" | "year";
	contestsParticipated?: {
		min?: number;
		max?: number;
	};
	skills?: string[];
	sortBy?: "newest" | "oldest" | "rating" | "members" | "activity" | "contests";
}

export interface TeamListResponse {
	teams: Team[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface TeamApplication {
	id: string;
	teamId: string;
	userId: string;
	username: string;
	email: string;
	message: string;
	skills: string[];
	status: "pending" | "accepted" | "rejected";
	createdAt: string;
	reviewedAt?: string;
	reviewedByUserId?: string;
	rejectionReason?: string;
}

// Mock teams data using schema-based structure
const mockTeams: Team[] = [
	{
		id: 1,
		name: "CyberSamurai",
		description:
			"Elite cybersecurity team specializing in advanced persistent threat hunting and zero-day research.",
		ctftime_id: 12345,
		country_code: "US",
		members: [
			{
				id: 1,
				username: "CyberNinja",
				email: "ninja@cybersamurai.team",
				permission_level: "player",
				password: "hashed",
				created_at: "2022-01-15T00:00:00Z",
			},
			{
				id: 10,
				username: "BinaryMaster",
				email: "binary@cybersamurai.team",
				permission_level: "player",
				password: "hashed",
				created_at: "2022-02-20T00:00:00Z",
			},
		],
		memberCount: 3,
		statistics: {
			contestsParticipated: 28,
			contestsWon: 8,
			totalPoints: 15420,
			averageRating: 1892,
			bestRanking: 1,
			currentRating: 1943,
			ratingHistory: [
				{ date: "2024-01-15", rating: 1943, contest: "picoCTF 2024" },
				{ date: "2023-12-10", rating: 1867, contest: "ASIS CTF Finals" },
			],
		},
		recruitment: {
			isRecruiting: true,
			description:
				"Looking for experienced players with strong crypto and pwn skills.",
			requiredSkills: ["Cryptography", "Binary Exploitation"],
			preferredSkills: ["Reverse Engineering", "Web Security"],
			minExperience: "2+ years",
			timeCommitment: "15+ hours/week",
			contactMethod: "application",
		},
		settings: {
			allowApplications: true,
			requireApproval: true,
			visibilityLevel: "public",
		},
		socialLinks: {
			website: "https://cybersamurai.team",
			discord: "https://discord.gg/cybersamurai",
			github: "https://github.com/cybersamurai-team",
		},
		privacy: "public",
		captainId: "1",
		createdAt: "2022-01-15T00:00:00Z",
		updatedAt: "2024-01-20T00:00:00Z",
	},
	{
		id: 2,
		name: "Digital Ronin",
		description:
			"International team of security researchers and penetration testers.",
		country_code: "DE",
		members: [
			{
				id: 45,
				username: "ShadowHacker",
				email: "shadow@digitalronin.org",
				permission_level: "player",
				password: "hashed",
				created_at: "2021-06-01T00:00:00Z",
			},
		],
		memberCount: 2,
		statistics: {
			contestsParticipated: 35,
			contestsWon: 12,
			totalPoints: 18750,
			averageRating: 2034,
			bestRanking: 3,
			currentRating: 2156,
			ratingHistory: [
				{ date: "2024-01-10", rating: 2156, contest: "InsomniHack CTF" },
			],
		},
		recruitment: {
			isRecruiting: false,
			requiredSkills: [],
			preferredSkills: [],
			contactMethod: "invitation_only",
		},
		settings: {
			allowApplications: false,
			requireApproval: true,
			visibilityLevel: "public",
		},
		socialLinks: {
			discord: "https://discord.gg/digitalronin",
		},
		privacy: "invite-only",
		captainId: "45",
		createdAt: "2021-06-01T00:00:00Z",
		updatedAt: "2024-01-18T00:00:00Z",
	},
	{
		id: 3,
		name: "NullPointer Academy",
		description: "Student-led team focusing on learning and skill development.",
		country_code: "CA",
		members: [
			{
				id: 156,
				username: "StudentHacker",
				email: "student@nullpointer.academy",
				permission_level: "player",
				password: "hashed",
				created_at: "2023-09-01T00:00:00Z",
			},
		],
		memberCount: 8,
		statistics: {
			contestsParticipated: 12,
			contestsWon: 0,
			totalPoints: 5420,
			averageRating: 1245,
			bestRanking: 45,
			currentRating: 1267,
			ratingHistory: [
				{ date: "2024-01-15", rating: 1267, contest: "NorthSec CTF" },
			],
		},
		recruitment: {
			isRecruiting: true,
			description: "Welcoming students and beginners!",
			requiredSkills: [],
			preferredSkills: ["Programming", "Linux"],
			minExperience: "Beginner friendly",
			timeCommitment: "5-10 hours/week",
			contactMethod: "application",
		},
		settings: {
			allowApplications: true,
			requireApproval: false,
			visibilityLevel: "public",
		},
		socialLinks: {
			website: "https://nullpointer.academy",
			discord: "https://discord.gg/nullpointer",
		},
		privacy: "public",
		captainId: "156",
		createdAt: "2023-09-01T00:00:00Z",
		updatedAt: "2024-01-19T00:00:00Z",
	},
];

// Add a few more teams for pagination
for (let i = 4; i <= 25; i++) {
	const countries = [
		"US",
		"GB",
		"DE",
		"FR",
		"CA",
		"AU",
		"JP",
		"KR",
		"NL",
		"SE",
	];
	const categories = ["Web", "Crypto", "Pwn", "Reverse", "Forensics", "Misc"];
	const privacyLevels = ["public", "invite-only"] as const;

	const country = countries[i % countries.length] || "US";
	const category = categories[i % categories.length] || "Security";
	const privacy = privacyLevels[i % privacyLevels.length] || "public";
	const rating = 1000 + Math.floor(Math.random() * 1500);
	const memberCount = 2 + Math.floor(Math.random() * 8);
	const contestsParticipated = Math.floor(Math.random() * 50) + 5;
	const contestsWon = Math.floor(contestsParticipated * Math.random() * 0.3);

	mockTeams.push({
		id: i,
		name: `${category} ${["Elite", "Masters", "Legends", "Champions", "Experts", "Pros"][i % 6]}`,
		description: `Professional ${category.toLowerCase()} security team with focus on competitive CTF participation.`,
		country_code: country,
		members: [
			{
				id: i * 100,
				username: `Captain${i}`,
				email: `captain${i}@team.com`,
				permission_level: "player",
				password: "hashed",
				created_at: "2023-01-01T00:00:00Z",
			},
		],
		captainId: (i * 100).toString(),
		memberCount,
		statistics: {
			contestsParticipated,
			contestsWon,
			totalPoints: rating * 5 + Math.floor(Math.random() * 2000),
			averageRating: rating,
			bestRanking: Math.floor(Math.random() * 50) + 1,
			currentRating: rating,
			ratingHistory: [{ date: "2024-01-15", rating, contest: "Recent CTF" }],
		},
		recruitment: {
			isRecruiting: Math.random() > 0.5,
			description: `Looking for ${category.toLowerCase()} specialists.`,
			requiredSkills: [category],
			preferredSkills: ["Linux", "Python"],
			minExperience: "1+ years",
			timeCommitment: "10+ hours/week",
			contactMethod: "application",
		},
		settings: {
			allowApplications: true,
			requireApproval: true,
			visibilityLevel: "public",
		},
		socialLinks: {
			discord: `https://discord.gg/team${i}`,
		},
		privacy,
		createdAt: "2023-01-01T00:00:00Z",
		updatedAt: new Date().toISOString(),
	});
}

// API Functions
export async function getTeams(
	filters: TeamFilters = {},
	page = 1,
	limit = 12
): Promise<ApiResponse<TeamListResponse>> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	let filteredTeams = [...mockTeams];

	// Apply filters
	if (filters.search) {
		const search = filters.search.toLowerCase();
		filteredTeams = filteredTeams.filter(
			(team) =>
				team.name.toLowerCase().includes(search) ||
				team.description?.toLowerCase().includes(search) ||
				team.members?.some((member) =>
					member.username.toLowerCase().includes(search)
				)
		);
	}

	if (filters.country) {
		filteredTeams = filteredTeams.filter(
			(team) => team.country_code === filters.country
		);
	}

	if (filters.isRecruiting !== undefined) {
		filteredTeams = filteredTeams.filter(
			(team) => team.recruitment.isRecruiting === filters.isRecruiting
		);
	}

	if (filters.minRating) {
		filteredTeams = filteredTeams.filter(
			(team) => team.statistics.currentRating >= filters.minRating!
		);
	}

	if (filters.maxRating) {
		filteredTeams = filteredTeams.filter(
			(team) => team.statistics.currentRating <= filters.maxRating!
		);
	}

	if (filters.memberCount) {
		filteredTeams = filteredTeams.filter((team) => {
			const count = team.memberCount;
			return (
				(!filters.memberCount!.min || count >= filters.memberCount!.min) &&
				(!filters.memberCount!.max || count <= filters.memberCount!.max)
			);
		});
	}

	if (filters.skills && filters.skills.length > 0) {
		filteredTeams = filteredTeams.filter(
			(team) =>
				team.recruitment.requiredSkills.some((skill) =>
					filters.skills!.includes(skill)
				) ||
				team.recruitment.preferredSkills.some((skill) =>
					filters.skills!.includes(skill)
				)
		);
	}

	// Apply sorting
	switch (filters.sortBy) {
		case "oldest":
			filteredTeams.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
			);
			break;
		case "rating":
			filteredTeams.sort(
				(a, b) => b.statistics.currentRating - a.statistics.currentRating
			);
			break;
		case "members":
			filteredTeams.sort((a, b) => b.memberCount - a.memberCount);
			break;
		case "activity":
			filteredTeams.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			);
			break;
		case "contests":
			filteredTeams.sort(
				(a, b) =>
					b.statistics.contestsParticipated - a.statistics.contestsParticipated
			);
			break;
		case "newest":
		default:
			filteredTeams.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
			);
			break;
	}

	// Pagination
	const total = filteredTeams.length;
	const totalPages = Math.ceil(total / limit);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedTeams = filteredTeams.slice(startIndex, endIndex);

	return {
		success: true,
		data: {
			teams: paginatedTeams,
			total,
			page,
			limit,
			totalPages,
		},
	};
}

export async function getTeam(id: string): Promise<ApiResponse<Team>> {
	await new Promise((resolve) => setTimeout(resolve, 200));

	const team = mockTeams.find((t) => t.id.toString() === id);

	if (!team) {
		return {
			success: false,
			error: "Team not found",
		};
	}

	return {
		success: true,
		data: team,
	};
}

export async function createTeam(
	teamData: Partial<Team>,
	userId: string
): Promise<ApiResponse<Team>> {
	await new Promise((resolve) => setTimeout(resolve, 500));

	if (!userId) {
		return {
			success: false,
			error: "Authentication required",
		};
	}

	const newTeam: Team = {
		id: Date.now(),
		name: teamData.name || "",
		description: teamData.description || "",
		country_code: teamData.country_code || "US",
		members: [
			{
				id: parseInt(userId),
				username: "CurrentUser",
				email: "current@example.com",
				permission_level: "player",
				password: "hashed",
				created_at: new Date().toISOString(),
			},
		],
		memberCount: 1,
		statistics: {
			contestsParticipated: 0,
			contestsWon: 0,
			totalPoints: 0,
			averageRating: 1000,
			bestRanking: 0,
			currentRating: 1000,
			ratingHistory: [],
		},
		recruitment: teamData.recruitment || {
			isRecruiting: false,
			requiredSkills: [],
			preferredSkills: [],
			contactMethod: "application",
		},
		settings: {
			allowApplications: true,
			requireApproval: true,
			visibilityLevel: "public",
		},
		socialLinks: teamData.socialLinks || {},
		privacy: teamData.privacy || "public",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	mockTeams.unshift(newTeam);

	return {
		success: true,
		data: newTeam,
	};
}

// Placeholder functions for team management
export async function getTeamApplications(
	_teamId: string | number,
	_userId?: string
): Promise<ApiResponse<TeamApplication[]>> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	return {
		success: true,
		data: [],
	};
}

export async function inviteToTeam(
	_teamId: string,
	_email: string
): Promise<ApiResponse<any>> {
	await new Promise((resolve) => setTimeout(resolve, 200));
	return {
		success: true,
		data: { message: "Invitation sent" },
	};
}
