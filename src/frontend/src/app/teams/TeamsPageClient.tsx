"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Users,
	Shield,
	Star,
	Trophy,
	ChevronLeft,
	ChevronRight,
	Globe,
	Lock,
	Plus,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getPopularCountries, COUNTRIES } from "@/lib/countries";
import { getTeams, TeamFilters } from "@/api/teams_mock";
import { useAuthStore } from "@/store/authStore";
import { clsx } from "clsx";
import { Flag } from "@/components/ui/Flag";
import { TeamLeaderboard } from "@/api";

interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	total: number;
}

interface TeamFiltersState {
	search: string;
	countries: string[];
	privacy?: string;
	minRating?: number;
	recruiting?: boolean;
}

const getPrivacyIcon = (recruiting: boolean) => {
	if (recruiting) return Shield;
	return Lock;
};

const getPrivateColor = (recruiting: boolean) => {
	if (recruiting) return "text-green-400";
	return "text-red-400";
};

const CompactStatCard = ({
	icon: Icon,
	label,
	value,
	isLoading = false,
}: {
	icon: React.ComponentType<{ className?: string | undefined }>;
	label: string;
	value: string | number;
	isLoading?: boolean;
}) => (
	<div className="flex items-center gap-2 p-2 bg-muted/30 rounded border border-border/50">
		<Icon className="h-4 w-4 text-primary" />
		<div className="flex items-center gap-2">
			<span className="text-xs font-mono text-muted-foreground">{label}:</span>
			{isLoading ? (
				<span className="text-sm font-bold font-mono text-primary animate-pulse">
					--
				</span>
			) : (
				<span className="text-sm font-bold font-mono text-primary">
					{value}
				</span>
			)}
		</div>
	</div>
);

const CountryFilter = ({
	selectedCountries,
	onToggle,
	showAll,
	onToggleShowAll,
}: {
	selectedCountries: string[];
	onToggle: (code: string) => void;
	showAll: boolean;
	onToggleShowAll: () => void;
}) => {
	const popularCountries = getPopularCountries();
	const displayCountries = showAll ? COUNTRIES : popularCountries;

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="text-xs font-mono text-muted-foreground">
					Countries ({selectedCountries.length} selected)
				</span>
				<Button
					variant="outline"
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
							<div className="text-sm">
								<Flag code={country.code} />
							</div>
							<div className="text-xs truncate">{country.code}</div>
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

const TeamTableRow = ({ team }: { team: TeamLeaderboard }) => {
	const PrivacyIcon = getPrivacyIcon(team.recruiting);

	return (
		<tr
			className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
			onClick={() => (window.location.href = `/teams/${team.id}`)}
		>
			<td className="p-3">
				<div className="flex items-center gap-3">
					<div
						className={clsx(
							"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
							team.rank <= 10
								? "bg-yellow-400/20 text-yellow-400"
								: team.rank <= 50
									? "bg-orange-400/20 text-orange-400"
									: "bg-primary/20 text-primary"
						)}
					>
						{team.rank}
					</div>
					<div>
						<div className="flex items-center gap-2">
							<span className="font-bold text-foreground font-mono text-base">
								{team.name}
							</span>
							<PrivacyIcon
								className={`h-3 w-3 ${getPrivateColor(team.recruiting)}`}
							/>
							{team.recruiting && (
								<Badge
									variant="outline"
									className="text-xs font-mono text-green-400 border-green-400"
								>
									RECRUITING
								</Badge>
							)}
						</div>
						<div className="text-sm text-muted-foreground truncate">
							{team.description} Lorem ipsum dolor sit amet consectetur
							adipisicing elit. Illo tenetur molestias accusamus exercitationem
							ex aliquam maxime aspernatur, iste pariatur sed mollitia nobis.
							Voluptatum, vitae dolores praesentium deleniti excepturi pariatur
							reprehenderit blanditiis molestiae consequuntur aut amet odit
							nostrum commodi, expedita cupiditate.
						</div>
					</div>
				</div>
			</td>
			<td className="p-3">
				<div className="flex items-center gap-2">
					<span className="text-base">
						<Flag code={team.country_code} />
					</span>
					<span className="font-mono text-sm">{team.country_code || "US"}</span>
				</div>
			</td>
			<td className="p-3 font-mono text-sm font-bold text-primary">
				{team.team_points.toLocaleString()}
			</td>
			<td className="p-3 font-mono text-sm">{team.members}</td>
			<td className="p-3 font-mono text-sm">{team.contests_count}</td>
			<td className="p-3 font-mono text-sm">{team.contests_won}</td>
		</tr>
	);
};

const Pagination = ({
	pagination,
	onPageChange,
	isLoading,
}: {
	pagination: PaginationState;
	onPageChange: (page: number) => void;
	isLoading: boolean;
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
				Page {currentPage} of {totalPages} ({pagination.total} teams)
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
								variant={currentPage === page ? "primary" : "outline"}
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

export default function TeamsPageClient({
	teamsList,
}: {
	teamsList: TeamLeaderboard[];
}) {
	const { user, isAuthenticated } = useAuthStore();
	const [teams, setTeams] = useState<TeamLeaderboard[]>(teamsList);
	// const [userTeams, setUserTeams] = useState<Team[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCountryFilter, setShowCountryFilter] = useState(false);
	const [showAllCountries, setShowAllCountries] = useState(false);
	const [filters, setFilters] = useState<TeamFiltersState>({
		search: "",
		countries: [],
	});
	const [pagination, setPagination] = useState<PaginationState>({
		currentPage: 1,
		pageSize: 25,
		totalPages: 1,
		total: 0,
	});

	// Fetch teams with pagination and filters
	// const fetchTeams = useCallback(
	// 	async (page: number = 1, resetFilters = false) => {
	// 		try {
	// 			setIsLoading(true);

	// 			const teamFilters: TeamFilters = {};
	// 			if (filters.search) teamFilters.search = filters.search;
	// 			if (
	// 				filters.countries.length > 0 &&
	// 				!resetFilters &&
	// 				filters.countries[0]
	// 			)
	// 				teamFilters.country = filters.countries[0];
	// 			if (filters.minRating) teamFilters.minRating = filters.minRating;
	// 			if (filters.isRecruiting !== undefined)
	// 				teamFilters.isRecruiting = filters.isRecruiting;
	// 			teamFilters.sortBy = "rating";

	// 			const response = await getTeams(teamFilters, page, pagination.pageSize);
	// 			if (response.success && response.data) {
	// 				// Add ranking to teams based on rating
	// 				const teamsWithRanking: TeamLeaderboard[] = response.data.teams.map(
	// 					(team, index) => ({
	// 						...team,
	// 						rank: (page - 1) * pagination.pageSize + index + 1,
	// 					})
	// 				);

	// 				setTeams(teamsWithRanking);
	// 				setPagination({
	// 					currentPage: page,
	// 					pageSize: pagination.pageSize,
	// 					totalPages: response.data.totalPages,
	// 					total: response.data.total,
	// 				});
	// 			}

	// 			// Load user's teams if authenticated
	// 			if (isAuthenticated && user?.id) {
	// 				// TODO: implement getting user teams
	// 				// const userTeamsResponse = await getUserTeams(user.id.toString());
	// 				// if (userTeamsResponse.success && userTeamsResponse.data) {
	// 				// 	setUserTeams(userTeamsResponse.data);
	// 				// }
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching teams:", error);
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	},
	// 	[
	// 		pagination.pageSize,
	// 		filters.countries,
	// 		filters.search,
	// 		filters.minRating,
	// 		filters.isRecruiting,
	// 		isAuthenticated,
	// 		user?.id,
	// 	]
	// );

	// Initial load
	// useEffect(() => {
	// 	fetchTeams(1);
	// }, [fetchTeams]);

	// Handle filter changes
	// useEffect(() => {
	// 	fetchTeams(1); // Reset to first page when filters change
	// }, [
	// 	filters.countries,
	// 	filters.search,
	// 	filters.minRating,
	// 	filters.isRecruiting,
	// 	fetchTeams,
	// ]);

	const updateFilter = (key: keyof TeamFiltersState, value: any) => {
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
		// fetchTeams(1, true);
	};

	const handlePageChange = (page: number) => {
		// fetchTeams(page);
	};

	const filteredTeams = teams.filter((team) => {
		if (filters.recruiting && team.recruiting !== filters.recruiting) {
			return false;
		}
		return true;
	});

	// Get top 5 teams
	const topTeams = filteredTeams.slice(0, 5);

	// Stats
	const stats = {
		total: pagination.total,
		recruiting: teams.filter((t) => t.recruiting).length,
		withOpenSlots: teams.filter((t) => t.recruiting).length,
		countries: new Set(teams.map((t) => t.country_code).filter(Boolean)).size,
	};

	const hasActiveFilters =
		filters.search ||
		filters.countries.length > 0 ||
		filters.privacy ||
		filters.minRating ||
		filters.recruiting !== undefined;

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
									TEAM_RANKINGS
								</h1>
								<span className="text-sm text-muted-foreground font-mono">
									{stats.total} teams registered
								</span>
							</div>

							{/* Stats */}
							<div className="flex flex-wrap gap-2">
								<CompactStatCard
									icon={Shield}
									label="Recruiting"
									value={stats.recruiting}
									isLoading={isLoading}
								/>
								<CompactStatCard
									icon={Trophy}
									label="Open Slots"
									value={stats.withOpenSlots}
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
										placeholder="Search teams..."
										value={filters.search}
										onChange={(e) => updateFilter("search", e.target.value)}
										className="pl-7 py-1 text-sm font-mono h-8"
									/>
								</div>

								{/* Quick Filters */}
								<div className="flex flex-wrap gap-1">
									<Badge
										variant={
											filters.privacy === "public" ? "default" : "outline"
										}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter(
												"privacy",
												filters.privacy === "public" ? undefined : "public"
											)
										}
									>
										<Globe className="h-3 w-3 mr-1" />
										Public
									</Badge>
									<Badge
										variant={
											filters.recruiting === true ? "default" : "outline"
										}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter(
												"recruiting",
												filters.recruiting === true ? undefined : true
											)
										}
									>
										<Shield className="h-3 w-3 mr-1" />
										Recruiting
									</Badge>
									<Badge
										variant={filters.minRating ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() =>
											updateFilter(
												"minRating",
												filters.minRating ? undefined : 2000
											)
										}
									>
										<Star className="h-3 w-3 mr-1" />
										2K+
									</Badge>
								</div>

								{/* Country Filter Toggle */}
								<Button
									variant={showCountryFilter ? "primary" : "outline"}
									size="sm"
									onClick={() => setShowCountryFilter(!showCountryFilter)}
									className="font-mono text-xs h-8 px-2"
								>
									<Globe className="h-3 w-3 mr-1" />
									Countries{" "}
									{filters.countries.length > 0 &&
										`(${filters.countries.length})`}
								</Button>

								{/* Create Team Button */}
								{isAuthenticated && (
									<Link href="/teams/create">
										<Button className="font-mono text-xs h-8 px-2">
											<Plus className="h-3 w-3 mr-1" />
											CREATE
										</Button>
									</Link>
								)}

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
												onToggleShowAll={() =>
													setShowAllCountries(!showAllCountries)
												}
											/>
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							{hasActiveFilters && (
								<div className="text-xs text-muted-foreground font-mono">
									{filteredTeams.length} of {teams.length} teams shown
								</div>
							)}
						</div>
					</div>
				</section>

				{/* Content */}
				<section className="py-4 px-4">
					<div className="max-w-7xl mx-auto">
						{isLoading && teams.length === 0 ? (
							<div className="flex justify-center py-8">
								<LoadingSpinner size="md" />
							</div>
						) : (
							<>
								{/* Top 5 Teams */}
								{topTeams.length > 0 && (
									<div className="mb-8">
										<h2 className="text-xl font-bold font-mono mb-4 text-yellow-400">
											🏆 TOP 5 TEAMS
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
											{topTeams.map((team, index) => (
												<div
													key={team.id}
													onClick={() =>
														(window.location.href = `/teams/${team.id}`)
													}
													className={`p-4 rounded-lg border transition-all hover:scale-105 cursor-pointer ${
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
															<Flag code={team.country_code} />
														</div>
														<div className="text-lg font-bold mb-1">
															#{team.rank}
														</div>
														<h3 className="font-bold text-sm mb-2 flex items-center justify-center gap-1">
															{team.name}
															{team.recruiting && (
																<Shield className="h-3 w-3 text-green-400" />
															)}
														</h3>
														<p className="text-xs text-muted-foreground mb-2 line-clamp-2">
															{team.description}
														</p>
														<div className="text-xs space-y-1">
															<div>
																Rating: {team.team_points.toLocaleString()}
															</div>
															<div>Members: {team.members}</div>
															<div>Contests: {team.contests_count}</div>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* All Teams Table */}
								<div className="bg-card/30 rounded-none hacker-border overflow-hidden">
									<div className="p-3 bg-muted/50 border-b border-border">
										<div className="flex items-center gap-2">
											<Users className="h-4 w-4 text-blue-400" />
											<h2 className="text-sm font-bold font-mono text-blue-400">
												ALL TEAMS ({filteredTeams.length})
											</h2>
										</div>
									</div>
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-muted/30">
												<tr className="border-b border-border/50">
													<th className="p-3 text-left font-mono text-sm font-bold w-auto">
														Team
													</th>
													<th className="p-3 text-left font-mono text-sm font-bold w-24">
														Country
													</th>
													<th className="p-3 text-left font-mono text-sm font-bold w-24">
														Rating
													</th>
													<th className="p-3 text-left font-mono text-sm font-bold w-20">
														Members
													</th>
													<th className="p-3 text-left font-mono text-sm font-bold w-20">
														Contests
													</th>
													<th className="p-3 text-left font-mono text-sm font-bold w-16">
														Wins
													</th>
												</tr>
											</thead>
											<tbody>
												{filteredTeams.map((team) => (
													<TeamTableRow key={team.id} team={team} />
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
								{filteredTeams.length === 0 && !isLoading && (
									<div className="text-center py-8">
										<div className="text-muted-foreground font-mono text-sm">
											No teams found.{" "}
											<button
												disabled={isLoading}
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
