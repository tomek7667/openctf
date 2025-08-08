"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	User,
	Users,
	Shield,
	Star,
	Trophy,
	Target,
	ChevronLeft,
	ChevronRight,
	Globe,
	Mail,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getCountryByCode, getPopularCountries, COUNTRIES } from "@/lib/countries";
import { clsx } from "clsx";

// Extended User interface for display
interface UserWithStats {
	id: number;
	username: string;
	email: string;
	description?: string;
	permission_level: "player" | "moderator" | "administrator";
	country_code: string;
	rating: number;
	contestsParticipated: number;
	averagePlace: number;
	teamId?: number;
	teamName?: string;
	lastActive: string;
	created_at: string;
	verified: boolean;
	ranking: number;
}

interface UserFilters {
	search: string;
	countries: string[];
	permissionLevel?: string;
	minRating?: number;
	verified?: boolean;
	hasTeam?: boolean;
}

interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	total: number;
}

// Mock users API function
const getUsers = async (params?: {
	offset?: number;
	limit?: number;
	countryCodes?: string[];
}): Promise<{
	items: UserWithStats[];
	pagination: {
		offset: number;
		limit: number;
		total: number;
		hasNext: boolean;
		hasPrev: boolean;
		totalPages: number;
		currentPage: number;
	};
}> => {
	await Promise.resolve(); // Simulate API delay
	
	const mockUsers: UserWithStats[] = [
		{
			id: 1,
			username: "cyberninja",
			email: "ninja@cyberspace.com",
			description: "Elite hacker specializing in web exploitation",
			permission_level: "player",
			country_code: "JP",
			rating: 2847,
			contestsParticipated: 67,
			averagePlace: 12.4,
			teamId: 1,
			teamName: "zer0pts",
			lastActive: "2024-01-15T10:30:00Z",
			created_at: "2023-03-15T08:00:00Z",
			verified: true,
			ranking: 1,
		},
		{
			id: 2,
			username: "pwn_master",
			email: "pwn@perfectblue.team",
			description: "Binary exploitation expert and CTF veteran",
			permission_level: "player",
			country_code: "US",
			rating: 2734,
			contestsParticipated: 89,
			averagePlace: 8.7,
			teamId: 2,
			teamName: "perfect blue",
			lastActive: "2024-01-14T14:22:00Z",
			created_at: "2022-11-20T12:00:00Z",
			verified: true,
			ranking: 2,
		},
		{
			id: 3,
			username: "cryptoking",
			email: "crypto@r3kapig.team",
			description: "Cryptography specialist and mathematics PhD",
			permission_level: "player",
			country_code: "CN",
			rating: 2689,
			contestsParticipated: 123,
			averagePlace: 6.3,
			teamId: 3,
			teamName: "r3kapig",
			lastActive: "2024-01-13T09:15:00Z",
			created_at: "2022-06-10T16:30:00Z",
			verified: true,
			ranking: 3,
		},
		{
			id: 4,
			username: "reverse_wizard",
			email: "reverse@kalmar.dk",
			description: "Reverse engineering and malware analysis expert",
			permission_level: "moderator",
			country_code: "DK",
			rating: 2634,
			contestsParticipated: 78,
			averagePlace: 9.1,
			teamId: 4,
			teamName: "Kalmarunionen",
			lastActive: "2024-01-15T16:45:00Z",
			created_at: "2023-01-05T10:15:00Z",
			verified: true,
			ranking: 4,
		},
		{
			id: 5,
			username: "web_slayer",
			email: "web@dragonsec.pl",
			description: "Web application penetration testing specialist",
			permission_level: "player",
			country_code: "PL",
			rating: 2567,
			contestsParticipated: 134,
			averagePlace: 15.2,
			teamId: 5,
			teamName: "Dragon Sector",
			lastActive: "2024-01-12T11:30:00Z",
			created_at: "2023-08-22T14:45:00Z",
			verified: true,
			ranking: 5,
		},
		{
			id: 6,
			username: "forensic_ace",
			email: "forensics@hitcon.tw",
			description: "Digital forensics and incident response expert",
			permission_level: "player",
			country_code: "TW",
			rating: 2489,
			contestsParticipated: 56,
			averagePlace: 18.7,
			teamId: 6,
			teamName: "HITCON",
			lastActive: "2024-01-14T08:20:00Z",
			created_at: "2023-05-18T11:20:00Z",
			verified: true,
			ranking: 6,
		},
		{
			id: 7,
			username: "network_ghost",
			email: "network@shellphish.net",
			description: "Network security and infrastructure hacking",
			permission_level: "player",
			country_code: "US",
			rating: 2423,
			contestsParticipated: 167,
			averagePlace: 22.1,
			teamId: 7,
			teamName: "Shellphish",
			lastActive: "2024-01-13T19:10:00Z",
			created_at: "2022-09-30T09:30:00Z",
			verified: true,
			ranking: 7,
		},
		{
			id: 8,
			username: "steganographer",
			email: "steg@tsj.jp",
			description: "Steganography and hidden data analysis expert",
			permission_level: "player",
			country_code: "JP",
			rating: 2387,
			contestsParticipated: 43,
			averagePlace: 25.8,
			teamId: 8,
			teamName: "TSJ",
			lastActive: "2024-01-11T13:45:00Z",
			created_at: "2023-12-01T13:00:00Z",
			verified: true,
			ranking: 8,
		},
		{
			id: 9,
			username: "exploit_dev",
			email: "exploit@p4team.pl",
			description: "Zero-day exploit development and research",
			permission_level: "administrator",
			country_code: "PL",
			rating: 2298,
			contestsParticipated: 91,
			averagePlace: 19.4,
			teamId: 9,
			teamName: "p4",
			lastActive: "2024-01-15T07:30:00Z",
			created_at: "2022-04-15T15:45:00Z",
			verified: true,
			ranking: 9,
		},
		{
			id: 10,
			username: "hardware_hacker",
			email: "hw@organizers.kr",
			description: "Hardware security and embedded systems expert",
			permission_level: "player",
			country_code: "KR",
			rating: 2245,
			contestsParticipated: 112,
			averagePlace: 28.3,
			teamId: 10,
			teamName: "organizers",
			lastActive: "2024-01-10T20:15:00Z",
			created_at: "2023-07-10T12:15:00Z",
			verified: true,
			ranking: 10,
		},
		// Add more users...
		{
			id: 11,
			username: "rookie_hacker",
			email: "rookie@example.com",
			description: "New to CTFs but eager to learn",
			permission_level: "player",
			country_code: "US",
			rating: 1456,
			contestsParticipated: 12,
			averagePlace: 45.2,
			lastActive: "2024-01-14T12:00:00Z",
			created_at: "2024-01-01T10:00:00Z",
			verified: false,
			ranking: 156,
		},
		{
			id: 12,
			username: "solo_player",
			email: "solo@freelance.com",
			description: "Independent researcher working alone",
			permission_level: "player",
			country_code: "DE",
			rating: 1823,
			contestsParticipated: 34,
			averagePlace: 32.1,
			lastActive: "2024-01-13T15:30:00Z",
			created_at: "2023-09-12T14:20:00Z",
			verified: true,
			ranking: 67,
		},
	];

	const offset = params?.offset || 0;
	const limit = params?.limit || 20;
	
	// Filter by country if provided
	let filteredUsers = mockUsers;
	if (params?.countryCodes && params.countryCodes.length > 0) {
		filteredUsers = mockUsers.filter(user => 
			params.countryCodes!.includes(user.country_code)
		);
	}

	const paginatedUsers = filteredUsers.slice(offset, offset + limit);

	return {
		items: paginatedUsers,
		pagination: {
			offset,
			limit,
			total: filteredUsers.length,
			hasNext: offset + limit < filteredUsers.length,
			hasPrev: offset > 0,
			totalPages: Math.ceil(filteredUsers.length / limit),
			currentPage: Math.floor(offset / limit) + 1,
		},
	};
};

const CompactStatCard = ({
	icon: Icon,
	label,
	value,
	isLoading = false,
}: {
	icon: React.ComponentType<{ className?: undefined | string }>;
	label: string;
	value: string | number;
	isLoading?: boolean;
}) => (
	<div className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/50">
		<Icon className="h-4 w-4 text-primary" />
		<div className="flex items-center gap-2">
			<span className="text-xs font-mono text-muted-foreground">{label}:</span>
			{isLoading ? (
				<span className="text-sm font-bold font-mono text-primary animate-pulse">--</span>
			) : (
				<span className="text-sm font-bold font-mono text-primary">{value}</span>
			)}
		</div>
	</div>
);

const CountryFilter = ({ 
	selectedCountries, 
	onToggle, 
	showAll, 
	onToggleShowAll 
}: { 
	selectedCountries: string[], 
	onToggle: (code: string) => void,
	showAll: boolean,
	onToggleShowAll: () => void
}) => {
	const popularCountries = getPopularCountries();
	const displayCountries = showAll ? COUNTRIES : popularCountries;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-mono text-muted-foreground">Countries ({selectedCountries.length} selected)</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={onToggleShowAll}
					className="text-xs font-mono h-6 px-2"
				>
					{showAll ? "Popular" : `All ${COUNTRIES.length}`}
				</Button>
			</div>
			
			<div className="max-h-48 overflow-y-auto">
				<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1">
					{displayCountries.map((country) => (
						<button
							key={country.code}
							onClick={() => onToggle(country.code)}
							className={clsx(
								"p-1 rounded text-xs font-mono border transition-all hover:scale-105",
								selectedCountries.includes(country.code)
									? "bg-primary text-primary-foreground border-primary"
									: "bg-muted/50 border-border/50 hover:bg-muted"
							)}
							title={country.name}
						>
							<div className="text-sm">{country.flag}</div>
							<div className="text-xs truncate">{country.code}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

const UserTableRow = ({ user }: { user: UserWithStats }) => (
	<tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
		<td className="p-3">
			<div className="flex items-center gap-3">
				<div
					className={clsx(
						"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
						user.ranking <= 10
							? "bg-yellow-400/20 text-yellow-400"
							: user.ranking <= 50
								? "bg-orange-400/20 text-orange-400"
								: "bg-primary/20 text-primary"
					)}
				>
					{user.ranking}
				</div>
				<div>
					<div className="flex items-center gap-2">
						<span className="font-bold text-foreground font-mono text-sm">
							{user.username}
						</span>
						{user.permission_level === "administrator" && (
							<Star className="h-3 w-3 text-yellow-400" />
						)}
						{user.permission_level === "moderator" && (
							<Shield className="h-3 w-3 text-blue-400" />
						)}
						{user.verified && (
							<Shield className="h-3 w-3 text-green-400" />
						)}
					</div>
					<div className="text-xs text-muted-foreground truncate max-w-xs">
						{user.description}
					</div>
				</div>
			</div>
		</td>
		<td className="p-3">
			<div className="flex items-center gap-2">
				<span className="text-base">{getCountryByCode(user.country_code)?.flag || "🌍"}</span>
				<span className="font-mono text-xs">{user.country_code}</span>
			</div>
		</td>
		<td className="p-3 font-mono text-xs font-bold text-primary">
			{user.rating.toLocaleString()}
		</td>
		<td className="p-3 font-mono text-xs">
			{user.contestsParticipated}
		</td>
		<td className="p-3 font-mono text-xs">
			{user.averagePlace.toFixed(1)}
		</td>
		<td className="p-3 font-mono text-xs">
			{user.teamName ? (
				<a href={`/teams/${user.teamId}`} className="text-primary hover:underline">
					{user.teamName}
				</a>
			) : (
				<span className="text-muted-foreground">Solo</span>
			)}
		</td>
		<td className="p-3">
			<div className="flex items-center gap-1">
				<a
					href={`mailto:${user.email}`}
					className="p-1 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
				>
					<Mail className="h-3 w-3" />
				</a>
				<a
					href={`/users/${user.id}`}
					className="btn-terminal px-1.5 py-0.5 text-xs font-mono font-bold"
				>
					VIEW
				</a>
			</div>
		</td>
	</tr>
);

const Pagination = ({ 
	pagination, 
	onPageChange,
	isLoading 
}: { 
	pagination: PaginationState, 
	onPageChange: (page: number) => void,
	isLoading: boolean 
}) => {
	const { currentPage, totalPages } = pagination;
	
	const generatePageNumbers = () => {
		const pages = [];
		const maxVisible = 7;
		
		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 4) {
				for (let i = 1; i <= 5; i++) pages.push(i);
				pages.push("...");
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 3) {
				pages.push(1);
				pages.push("...");
				for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
			} else {
				pages.push(1);
				pages.push("...");
				for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
				pages.push("...");
				pages.push(totalPages);
			}
		}
		
		return pages;
	};

	return (
		<div className="flex items-center justify-between py-4">
			<div className="text-xs text-muted-foreground font-mono">
				Page {currentPage} of {totalPages} ({pagination.total} users)
			</div>
			
			<div className="flex items-center gap-1">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1 || isLoading}
					className="font-mono text-xs h-8 px-2"
				>
					<ChevronLeft className="h-3 w-3" />
				</Button>
				
				{generatePageNumbers().map((page, index) => (
					<React.Fragment key={index}>
						{page === "..." ? (
							<span className="px-2 text-xs text-muted-foreground">...</span>
						) : (
							<Button
								variant={currentPage === page ? "default" : "ghost"}
								size="sm"
								onClick={() => onPageChange(page as number)}
								disabled={isLoading}
								className="font-mono text-xs h-8 w-8 p-0"
							>
								{page}
							</Button>
						)}
					</React.Fragment>
				))}
				
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages || isLoading}
					className="font-mono text-xs h-8 px-2"
				>
					<ChevronRight className="h-3 w-3" />
				</Button>
			</div>
		</div>
	);
};

export default function UsersPage() {
	const [users, setUsers] = useState<UserWithStats[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCountryFilter, setShowCountryFilter] = useState(false);
	const [showAllCountries, setShowAllCountries] = useState(false);
	const [filters, setFilters] = useState<UserFilters>({
		search: "",
		countries: [],
	});
	const [pagination, setPagination] = useState<PaginationState>({
		currentPage: 1,
		pageSize: 20,
		totalPages: 1,
		total: 0,
	});

	// Fetch users with pagination and filters
	const fetchUsers = useCallback(async (page: number = 1, resetFilters = false) => {
		try {
			setIsLoading(true);
			const offset = (page - 1) * pagination.pageSize;
			
			const params = {
				offset,
				limit: pagination.pageSize,
				...(filters.countries.length > 0 && !resetFilters ? { countryCodes: filters.countries } : {}),
			};
			
			const response = await getUsers(params);
			setUsers(response.items);
			setPagination({
				currentPage: page,
				pageSize: pagination.pageSize,
				totalPages: response.pagination.totalPages,
				total: response.pagination.total,
			});
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setIsLoading(false);
		}
	}, [pagination.pageSize, filters.countries]);

	// Initial load
	useEffect(() => {
		fetchUsers(1);
	}, [fetchUsers]);

	// Handle filter changes
	useEffect(() => {
		fetchUsers(1); // Reset to first page when filters change
	}, [filters.countries, fetchUsers]);

	const updateFilter = (key: keyof UserFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const toggleCountryFilter = (countryCode: string) => {
		setFilters((prev) => ({
			...prev,
			countries: prev.countries.includes(countryCode)
				? prev.countries.filter((c) => c !== countryCode)
				: [...prev.countries, countryCode],
		}));
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			countries: [],
		});
		fetchUsers(1, true);
	};

	const handlePageChange = (page: number) => {
		fetchUsers(page);
	};

	// Apply client-side filters
	const filteredUsers = users.filter((user) => {
		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			if (
				!user.username.toLowerCase().includes(searchLower) &&
				!user.email.toLowerCase().includes(searchLower) &&
				!user.description?.toLowerCase().includes(searchLower)
			) {
				return false;
			}
		}

		// Permission level filter
		if (filters.permissionLevel && user.permission_level !== filters.permissionLevel) {
			return false;
		}

		// Rating filter
		if (filters.minRating && user.rating < filters.minRating) {
			return false;
		}

		// Verified filter
		if (filters.verified !== undefined && user.verified !== filters.verified) {
			return false;
		}

		// Team filter
		if (filters.hasTeam !== undefined) {
			const hasTeam = Boolean(user.teamId);
			if (hasTeam !== filters.hasTeam) {
				return false;
			}
		}

		return true;
	});

	// Get top 5 users
	const topUsers = filteredUsers.slice(0, 5);

	// Stats
	const stats = {
		total: pagination.total,
		verified: users.filter((u) => u.verified).length,
		withTeams: users.filter((u) => u.teamId).length,
		countries: new Set(users.map((u) => u.country_code)).size,
	};

	const hasActiveFilters =
		filters.search ||
		filters.countries.length > 0 ||
		filters.permissionLevel ||
		filters.minRating ||
		filters.verified !== undefined ||
		filters.hasTeam !== undefined;

	return (
		<MainLayout>
			<div className="min-h-screen">
				{/* Header */}
				<section className="py-4 px-4 border-b border-border/50">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<Users className="h-5 w-5 text-primary" />
								<h1 className="text-xl font-bold font-mono text-foreground">
									USER_RANKINGS
								</h1>
								<span className="text-sm text-muted-foreground font-mono">
									{stats.total} users registered
								</span>
							</div>
							
							{/* Stats */}
							<div className="flex flex-wrap gap-2">
								<CompactStatCard
									icon={Shield}
									label="Verified"
									value={stats.verified}
									isLoading={isLoading}
								/>
								<CompactStatCard
									icon={Trophy}
									label="In Teams"
									value={stats.withTeams}
									isLoading={isLoading}
								/>
								<CompactStatCard
									icon={Globe}
									label="Countries"
									value={stats.countries}
									isLoading={isLoading}
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Filters */}
				<section className="py-3 px-4 bg-muted/20">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col gap-3">
							<div className="flex flex-col md:flex-row gap-3">
								{/* Search */}
								<div className="flex-1 relative">
									<Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
									<Input
										placeholder="Search users..."
										value={filters.search}
										onChange={(e) => updateFilter("search", e.target.value)}
										className="pl-7 py-1 text-sm font-mono h-8"
									/>
								</div>

								{/* Quick Filters */}
								<div className="flex flex-wrap gap-1">
									<Badge
										variant={filters.permissionLevel === "administrator" ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter("permissionLevel",
												filters.permissionLevel === "administrator" ? undefined : "administrator"
											)
										}
									>
										<Star className="h-3 w-3 mr-1" />
										Admins
									</Badge>
									<Badge
										variant={filters.permissionLevel === "moderator" ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter("permissionLevel", 
												filters.permissionLevel === "moderator" ? undefined : "moderator"
											)
										}
									>
										<Shield className="h-3 w-3 mr-1" />
										Mods
									</Badge>
									<Badge
										variant={filters.verified === true ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() => updateFilter("verified", filters.verified === true ? undefined : true)}
									>
										<Shield className="h-3 w-3 mr-1" />
										Verified
									</Badge>
									<Badge
										variant={filters.hasTeam === true ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() => updateFilter("hasTeam", filters.hasTeam === true ? undefined : true)}
									>
										<Trophy className="h-3 w-3 mr-1" />
										In Team
									</Badge>
									<Badge
										variant={filters.minRating ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter("minRating", filters.minRating ? undefined : 2000)
										}
									>
										<Star className="h-3 w-3 mr-1" />
										2K+
									</Badge>
								</div>

								{/* Country Filter Toggle */}
								<Button
									variant={showCountryFilter ? "default" : "outline"}
									size="sm"
									onClick={() => setShowCountryFilter(!showCountryFilter)}
									className="font-mono text-xs h-8 px-2"
								>
									<Globe className="h-3 w-3 mr-1" />
									Countries {filters.countries.length > 0 && `(${filters.countries.length})`}
								</Button>

								{hasActiveFilters && (
									<Button
										variant="outline"
										size="sm"
										onClick={clearFilters}
										className="font-mono text-xs h-8 px-2"
									>
										Clear
									</Button>
								)}
							</div>

							{/* Country Filter Panel */}
							<AnimatePresence>
								{showCountryFilter && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
										className="overflow-hidden"
									>
										<div className="p-3 bg-card/50 rounded border border-border/50">
											<CountryFilter
												selectedCountries={filters.countries}
												onToggle={toggleCountryFilter}
												showAll={showAllCountries}
												onToggleShowAll={() => setShowAllCountries(!showAllCountries)}
											/>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{hasActiveFilters && (
								<div className="text-xs text-muted-foreground font-mono">
									{filteredUsers.length} of {users.length} users shown
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Content */}
				<section className="py-4 px-4">
					<div className="max-w-7xl mx-auto">
						{isLoading && users.length === 0 ? (
							<div className="flex justify-center py-8">
								<LoadingSpinner size="md" />
							</div>
						) : (
							<>
								{/* Top 5 Users */}
								{topUsers.length > 0 && (
									<div className="mb-8">
										<h2 className="text-xl font-bold font-mono mb-4 text-yellow-400">
											🏆 TOP 5 HACKERS
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
											{topUsers.map((user, index) => (
												<div
													key={user.id}
													className={`p-4 rounded-lg border transition-all hover:scale-105 ${
														index === 0
															? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400"
															: index === 1
															? "bg-gradient-to-br from-gray-300/20 to-gray-500/20 border-gray-400"
															: index === 2
															? "bg-gradient-to-br from-amber-600/20 to-yellow-700/20 border-amber-600"
															: "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400"
													}`}
												>
													<div className="text-center">
														<div className="text-2xl mb-2">
															{getCountryByCode(user.country_code)?.flag || "🌍"}
														</div>
														<div className="text-lg font-bold mb-1">
															#{user.ranking}
														</div>
														<h3 className="font-bold text-sm mb-2 flex items-center justify-center gap-1">
															{user.username}
															{user.permission_level === "administrator" && (
																<Crown className="h-3 w-3 text-yellow-400" />
															)}
															{user.permission_level === "moderator" && (
																<Shield className="h-3 w-3 text-blue-400" />
															)}
														</h3>
														<p className="text-xs text-muted-foreground mb-2">
															{user.description}
														</p>
														<div className="text-xs space-y-1">
															<div>Rating: {user.rating.toLocaleString()}</div>
															<div>Contests: {user.contestsParticipated}</div>
															<div>Avg: {user.averagePlace.toFixed(1)}</div>
														</div>
														{user.teamName && (
															<div className="mt-2 text-xs text-primary">
																{user.teamName}
															</div>
														)}
														{user.verified && (
															<Shield className="h-4 w-4 text-green-400 mx-auto mt-2" />
														)}
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* All Users Table */}
								<div className="bg-card/30 rounded-none hacker-border overflow-hidden">
									<div className="p-3 bg-muted/50 border-b border-border">
										<div className="flex items-center gap-2">
											<User className="h-4 w-4 text-blue-400" />
											<h2 className="text-sm font-bold font-mono text-blue-400">
												ALL USERS ({filteredUsers.length})
											</h2>
										</div>
									</div>
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-muted/30">
												<tr className="border-b border-border/50">
													<th className="p-3 text-left font-mono text-xs font-bold">User</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Country</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Rating</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Contests</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Avg</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Team</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Actions</th>
												</tr>
											</thead>
											<tbody>
												{filteredUsers.map((user) => (
													<UserTableRow key={user.id} user={user} />
												))}
											</tbody>
										</table>
									</div>

									{/* Pagination */}
									<div className="p-3 bg-muted/20 border-t border-border">
										<Pagination
											pagination={pagination}
											onPageChange={handlePageChange}
											isLoading={isLoading}
										/>
									</div>
								</div>

								{/* No Results */}
								{filteredUsers.length === 0 && !isLoading && (
									<div className="text-center py-8">
										<div className="text-muted-foreground font-mono text-sm">
											No users found. <button
												onClick={clearFilters}
												className="text-primary hover:underline"
											>
												Clear filters
											</button>
										</div>
									</div>
								)}
							</>
						)}
					</div>
				</section>
			</div>
		</MainLayout>
	);
}
