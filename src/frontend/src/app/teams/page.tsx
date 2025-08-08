"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Search,
	Filter,
	Trophy,
	Users,
	Target,
	Star,
	Shield,
	Flag,
	ChevronLeft,
	ChevronRight,
	Globe,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getTeams, TeamWithRanking } from "@/api/teams";
import { COUNTRIES, getCountryByCode, getPopularCountries } from "@/lib/countries";
import { clsx } from "clsx";

const rankingTiers = [
	{ min: 1, max: 3, label: "Top 3", color: "text-yellow-400" },
	{ min: 4, max: 10, label: "Top 10", color: "text-orange-400" },
	{ min: 11, max: 50, label: "Top 50", color: "text-blue-400" },
	{ min: 51, max: 100, label: "Top 100", color: "text-green-400" },
];

interface TeamFilters {
	search: string;
	countries: string[];
	rankingTier?: { min: number; max: number };
	minRating?: number;
	verified?: boolean;
}

interface PaginationState {
	currentPage: number;
	pageSize: number;
	totalPages: number;
	total: number;
}

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

// Country Filter Component
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

const TeamTableRow = ({ team }: { team: TeamWithRanking }) => (
	<tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
		<td className="p-3">
			<div className="flex items-center gap-3">
				<div
					className={clsx(
						"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
						team.ranking <= 3
							? "bg-yellow-400/20 text-yellow-400"
							: team.ranking <= 10
								? "bg-orange-400/20 text-orange-400"
								: "bg-primary/20 text-primary"
					)}
				>
					{team.ranking}
				</div>
				<div>
					<div className="font-bold text-foreground font-mono text-sm">
						{team.name.toUpperCase()}
					</div>
					<div className="text-xs text-muted-foreground truncate max-w-xs">
						{team.description}
					</div>
				</div>
			</div>
		</td>
		<td className="p-3">
			<div className="flex items-center gap-2">
				<span className="text-base">{getCountryByCode(team.country_code)?.flag || "🌍"}</span>
				<span className="font-mono text-xs">{team.country_code}</span>
			</div>
		</td>
		<td className="p-3 font-mono text-xs font-bold text-primary">
			{team.ratingPoints.toLocaleString()}
		</td>
		<td className="p-3 font-mono text-xs">
			{team.contestsCount}
		</td>
		<td className="p-3 font-mono text-xs">
			{team.avgPlace.toFixed(1)}
		</td>
		<td className="p-3 font-mono text-xs">
			<div className="flex items-center gap-1">
				<Users className="h-3 w-3 text-muted-foreground" />
				{team.memberCount}
			</div>
		</td>
		<td className="p-3">
			<div className="flex items-center gap-1">
				{team.verified_at && (
					<Shield className="h-3 w-3 text-green-400" />
				)}
				{team.ctftime_id && (
					<a
						href={`https://ctftime.org/team/${team.ctftime_id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
					>
						<svg
							className="h-3 w-3"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</a>
				)}
				<a
					href={`/teams/${team.id}`}
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

export default function TeamsPage() {
	const [teams, setTeams] = useState<TeamWithRanking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showCountryFilter, setShowCountryFilter] = useState(false);
	const [showAllCountries, setShowAllCountries] = useState(false);
	const [filters, setFilters] = useState<TeamFilters>({
		search: "",
		countries: [],
	});
	const [pagination, setPagination] = useState<PaginationState>({
		currentPage: 1,
		pageSize: 20,
		totalPages: 1,
		total: 0,
	});

	// Fetch teams with pagination and filters
	const fetchTeams = useCallback(async (page: number = 1, resetFilters = false) => {
		try {
			setIsLoading(true);
			const offset = (page - 1) * pagination.pageSize;
			
			const params = {
				offset,
				limit: pagination.pageSize,
				...(filters.countries.length > 0 && !resetFilters ? { countryCodes: filters.countries } : {}),
			};
			
			const response = await getTeams(params);
			setTeams(response.items);
			setPagination({
				currentPage: page,
				pageSize: pagination.pageSize,
				totalPages: response.pagination.totalPages,
				total: response.pagination.total,
			});
		} catch (error) {
			console.error("Error fetching teams:", error);
		} finally {
			setIsLoading(false);
		}
	}, [pagination.pageSize, filters.countries]);

	// Initial load
	useEffect(() => {
		fetchTeams(1);
	}, [fetchTeams]);

	// Handle filter changes
	useEffect(() => {
		fetchTeams(1); // Reset to first page when filters change
	}, [filters.countries, fetchTeams]);

	const updateFilter = (key: keyof TeamFilters, value: any) => {
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
		fetchTeams(1, true);
	};

	const handlePageChange = (page: number) => {
		fetchTeams(page);
	};

	// Apply client-side search filter
	const filteredTeams = teams.filter((team) => {
		if (!filters.search) return true;
		const searchLower = filters.search.toLowerCase();
		return (
			team.name.toLowerCase().includes(searchLower) ||
			team.description?.toLowerCase().includes(searchLower)
		);
	});

	// Apply ranking tier filter
	const tierFilteredTeams = filteredTeams.filter((team) => {
		if (!filters.rankingTier) return true;
		return team.ranking >= filters.rankingTier.min && team.ranking <= filters.rankingTier.max;
	});

	// Apply rating filter
	const ratingFilteredTeams = tierFilteredTeams.filter((team) => {
		if (!filters.minRating) return true;
		return team.ratingPoints >= filters.minRating;
	});

	// Apply verified filter
	const finalFilteredTeams = ratingFilteredTeams.filter((team) => {
		if (!filters.verified) return true;
		return team.verified_at;
	});

	// Get top 5 teams
	const topTeams = finalFilteredTeams.slice(0, 5);

	// Stats
	const stats = {
		total: pagination.total,
		verified: teams.filter((t) => t.verified_at).length,
		active: teams.filter((t) => {
			const lastActive = new Date(t.lastActive);
			const daysSince = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
			return daysSince <= 30;
		}).length,
		countries: new Set(teams.map((t) => t.country_code)).size,
	};

	const hasActiveFilters =
		filters.search ||
		filters.countries.length > 0 ||
		filters.rankingTier ||
		filters.minRating ||
		filters.verified;

	return (
		<MainLayout>
			<div className="min-h-screen">
				{/* Header */}
				<section className="py-4 px-4 border-b border-border/50">
					<div className="max-w-7xl mx-auto">
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								<Trophy className="h-5 w-5 text-primary" />
								<h1 className="text-xl font-bold font-mono text-foreground">
									TEAM_RANKINGS
								</h1>
								<span className="text-sm text-muted-foreground font-mono">
									{stats.total} teams indexed
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
									icon={Target}
									label="Active"
									value={stats.active}
									isLoading={isLoading}
								/>
								<CompactStatCard
									icon={Flag}
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
									{rankingTiers.slice(0, 2).map((tier) => (
										<Badge
											key={`${tier.min}-${tier.max}`}
											variant={
												filters.rankingTier?.min === tier.min ? "default" : "outline"
											}
											className="cursor-pointer text-xs font-mono h-8 px-2"
											onClick={() =>
												updateFilter("rankingTier", 
													filters.rankingTier?.min === tier.min ? undefined : { min: tier.min, max: tier.max }
												)
											}
										>
											{tier.label}
										</Badge>
									))}
									<Badge
										variant={filters.verified ? "default" : "outline"}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() => updateFilter("verified", !filters.verified)}
									>
										<Shield className="h-3 w-3 mr-1" />
										Verified
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
									{finalFilteredTeams.length} of {teams.length} teams shown
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
											🏆 TOP 5 CHAMPIONS
										</h2>
										<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
											{topTeams.map((team, index) => (
												<div
													key={team.id}
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
															{getCountryByCode(team.country_code)?.flag || "🌍"}
														</div>
														<div className="text-lg font-bold mb-1">
															#{team.ranking}
														</div>
														<h3 className="font-bold text-sm mb-2">
															{team.name.toUpperCase()}
														</h3>
														<p className="text-xs text-muted-foreground mb-2">
															{team.description}
														</p>
														<div className="text-xs space-y-1">
															<div>Rating: {team.ratingPoints.toLocaleString()}</div>
															<div>Contests: {team.contestsCount}</div>
															<div>Avg: {team.avgPlace.toFixed(1)}</div>
														</div>
														{team.verified_at && (
															<Shield className="h-4 w-4 text-green-400 mx-auto mt-2" />
														)}
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
												ALL TEAMS ({finalFilteredTeams.length})
											</h2>
										</div>
									</div>
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-muted/30">
												<tr className="border-b border-border/50">
													<th className="p-3 text-left font-mono text-xs font-bold">Team</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Country</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Rating</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Contests</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Avg</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Members</th>
													<th className="p-3 text-left font-mono text-xs font-bold">Links</th>
												</tr>
											</thead>
											<tbody>
												{finalFilteredTeams.map((team) => (
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
								{finalFilteredTeams.length === 0 && !isLoading && (
									<div className="text-center py-8">
										<div className="text-muted-foreground font-mono text-sm">
											No teams found. <button
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
