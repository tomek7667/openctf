"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Filter,
	Trophy,
	Users,
	Target,
	Star,
	Shield,
	Flag,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { TeamCard } from "@/components/teams/TeamCard";
import { getTeams, TeamWithRanking } from "@/api/teams";
import { clsx } from "clsx";

const rankingTiers = [
	{ min: 1, max: 3, label: "Top 3", color: "text-yellow-400" },
	{ min: 4, max: 10, label: "Top 10", color: "text-orange-400" },
	{ min: 11, max: 50, label: "Top 50", color: "text-blue-400" },
	{ min: 51, max: 100, label: "Top 100", color: "text-green-400" },
];

const countryOptions = [
	{ code: "US", name: "United States", flag: "🇺🇸" },
	{ code: "CN", name: "China", flag: "🇨🇳" },
	{ code: "DE", name: "Germany", flag: "🇩🇪" },
	{ code: "JP", name: "Japan", flag: "🇯🇵" },
	{ code: "KR", name: "South Korea", flag: "🇰🇷" },
	{ code: "TW", name: "Taiwan", flag: "🇹🇼" },
	{ code: "PL", name: "Poland", flag: "🇵🇱" },
	{ code: "FR", name: "France", flag: "🇫🇷" },
	{ code: "DK", name: "Denmark", flag: "🇩🇰" },
	{ code: "CA", name: "Canada", flag: "🇨🇦" },
];

interface TeamFilters {
	search: string;
	countries: string[];
	rankingTier?: { min: number; max: number };
	minRating?: number;
	verified?: boolean;
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
				<span className="text-base">{countryOptions.find(c => c.code === team.country_code)?.flag || "🌍"}</span>
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

export default function TeamsPage() {
	const [teams, setTeams] = useState<TeamWithRanking[]>([]);
	const [filteredTeams, setFilteredTeams] = useState<TeamWithRanking[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState<TeamFilters>({
		search: "",
		countries: [],
	});

	// Fetch teams on mount
	useEffect(() => {
		const fetchTeams = async () => {
			try {
				setIsLoading(true);
				const response = await getTeams({ limit: 50 });
				setTeams(response.items);
				setFilteredTeams(response.items);
			} catch (error) {
				console.error("Error fetching teams:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTeams();
	}, []);

	// Apply filters whenever filters or teams change
	useEffect(() => {
		let filtered = [...teams];

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(team) =>
					team.name.toLowerCase().includes(searchLower) ||
					team.description?.toLowerCase().includes(searchLower)
			);
		}

		// Country filter
		if (filters.countries.length > 0) {
			filtered = filtered.filter((team) =>
				filters.countries.includes(team.country_code)
			);
		}

		// Ranking tier filter
		if (filters.rankingTier) {
			filtered = filtered.filter(
				(team) =>
					team.ranking >= filters.rankingTier!.min &&
					team.ranking <= filters.rankingTier!.max
			);
		}

		// Minimum rating filter
		if (filters.minRating) {
			filtered = filtered.filter((team) => team.ratingPoints >= filters.minRating!);
		}

		// Verified filter
		if (filters.verified) {
			filtered = filtered.filter((team) => team.verified_at);
		}

		setFilteredTeams(filtered);
	}, [teams, filters]);

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
	};

	// Group teams by ranking tiers for display
	const topTeams = filteredTeams.filter((t) => t.ranking <= 5);

	// Stats
	const stats = {
		total: teams.length,
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
				{/* Compact Header */}
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
							
							{/* Compact Stats */}
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

				{/* Compact Filters */}
				<section className="py-3 px-4 bg-muted/20">
					<div className="max-w-7xl mx-auto">
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
											updateFilter("rankingTier", { min: tier.min, max: tier.max })
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

							{/* Country Filter */}
							<div className="flex flex-wrap gap-1">
								{countryOptions.slice(0, 5).map((country) => (
									<Badge
										key={country.code}
										variant={
											filters.countries.includes(country.code) ? "default" : "outline"
										}
										className="cursor-pointer text-xs font-mono h-8 px-2"
										onClick={() => toggleCountryFilter(country.code)}
									>
										{country.flag}
									</Badge>
								))}
							</div>

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

						{hasActiveFilters && (
							<div className="mt-2 text-xs text-muted-foreground font-mono">
								{filteredTeams.length} of {teams.length} teams
							</div>
						)}
					</div>
				</section>

				{/* Content */}
				<section className="py-4 px-4">
					<div className="max-w-7xl mx-auto">
						{isLoading ? (
							<div className="flex justify-center py-8">
								<LoadingSpinner size="md" />
							</div>
						) : (
							<>
								{/* Top Teams - Compact Cards */}
								{topTeams.length > 0 && (
									<div className="mb-6">
										<div className="flex items-center gap-2 mb-3">
											<Trophy className="h-4 w-4 text-yellow-400" />
											<h2 className="text-sm font-bold font-mono text-yellow-400">
												TOP 5 TEAMS
											</h2>
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
											{topTeams.map((team, index) => (
												<div
													key={team.id}
													className="p-3 bg-card/50 backdrop-blur-sm rounded-none hacker-border hover:border-primary/60 transition-colors"
												>
													<div className="flex items-center gap-2 mb-2">
														<div
															className={clsx(
																"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono",
																team.ranking <= 3
																	? "bg-yellow-400/20 text-yellow-400"
																	: "bg-orange-400/20 text-orange-400"
															)}
														>
															{team.ranking}
														</div>
														<span className="text-lg">
															{countryOptions.find(c => c.code === team.country_code)?.flag || "🌍"}
														</span>
														{team.verified_at && (
															<Shield className="h-3 w-3 text-green-400" />
														)}
													</div>
													<div className="font-bold text-sm font-mono text-foreground mb-1">
														{team.name.toUpperCase()}
													</div>
													<div className="text-xs text-muted-foreground mb-2 truncate">
														{team.description}
													</div>
													<div className="space-y-1">
														<div className="flex justify-between text-xs">
															<span className="text-muted-foreground">Rating:</span>
															<span className="font-bold font-mono text-primary">
																{team.ratingPoints.toLocaleString()}
															</span>
														</div>
														<div className="flex justify-between text-xs">
															<span className="text-muted-foreground">Contests:</span>
															<span className="font-mono">{team.contestsCount}</span>
														</div>
														<div className="flex justify-between text-xs">
															<span className="text-muted-foreground">Avg:</span>
															<span className="font-mono">{team.avgPlace.toFixed(1)}</span>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* All Teams Table - More Compact */}
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
												{filteredTeams.slice(0, 50).map((team) => (
													<TeamTableRow key={team.id} team={team} />
												))}
											</tbody>
										</table>
									</div>

									{filteredTeams.length > 50 && (
										<div className="p-3 bg-muted/20 border-t border-border">
											<p className="text-xs text-muted-foreground font-mono text-center">
												Showing first 50 of {filteredTeams.length} teams
											</p>
										</div>
									)}
								</div>

								{/* No Results */}
								{filteredTeams.length === 0 && (
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
