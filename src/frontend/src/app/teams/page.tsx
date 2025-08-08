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

const StatCard = ({
	icon: Icon,
	label,
	value,
	description,
	isLoading = false,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | number;
	description?: string;
	isLoading?: boolean;
}) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="p-6 bg-card/50 backdrop-blur-sm rounded-none hacker-border"
	>
		<div className="flex items-center gap-3 mb-3">
			<div className="p-2 bg-primary/10 rounded">
				<Icon className="h-5 w-5 text-primary" />
			</div>
			<h3 className="font-mono font-bold text-foreground">{label}</h3>
		</div>

		{isLoading ? (
			<div className="text-2xl font-bold text-primary mb-1 font-mono animate-pulse">
				---
			</div>
		) : (
			<div className="text-2xl font-bold text-primary mb-1 font-mono glow-text">
				{value}
			</div>
		)}

		{description && (
			<p className="text-xs text-muted-foreground font-mono">{description}</p>
		)}
	</motion.div>
);

const TeamTableRow = ({ team }: { team: TeamWithRanking }) => (
	<tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
		<td className="p-4">
			<div className="flex items-center gap-3">
				<div
					className={clsx(
						"w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-mono",
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
					<div className="font-bold text-foreground font-mono">
						{team.name.toUpperCase()}
					</div>
					<div className="text-sm text-muted-foreground truncate max-w-xs">
						{team.description}
					</div>
				</div>
			</div>
		</td>
		<td className="p-4">
			<div className="flex items-center gap-2">
				<span className="text-lg">{countryOptions.find(c => c.code === team.country_code)?.flag || "🌍"}</span>
				<span className="font-mono text-sm">{team.country_code}</span>
			</div>
		</td>
		<td className="p-4 font-mono text-sm font-bold text-primary">
			{team.ratingPoints.toLocaleString()}
		</td>
		<td className="p-4 font-mono text-sm">
			{team.contestsCount}
		</td>
		<td className="p-4 font-mono text-sm">
			{team.avgPlace.toFixed(1)}
		</td>
		<td className="p-4 font-mono text-sm">
			<div className="flex items-center gap-1">
				<Users className="h-4 w-4 text-muted-foreground" />
				{team.memberCount}
			</div>
		</td>
		<td className="p-4">
			<div className="flex items-center gap-2">
				{team.verified_at && (
					<Shield className="h-4 w-4 text-green-400" />
				)}
				{team.ctftime_id && (
					<a
						href={`https://ctftime.org/team/${team.ctftime_id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1.5 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
					>
						<svg
							className="h-4 w-4"
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
					className="btn-terminal px-2 py-1 text-xs font-mono font-bold"
				>
					PROFILE
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
	const topTeams = filteredTeams.filter((t) => t.ranking <= 10);
	const otherTeams = filteredTeams.filter((t) => t.ranking > 10);

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
				{/* Hero Section */}
				<section className="py-16 px-4 relative overflow-hidden">
					<div className="absolute inset-0 matrix-bg opacity-20" />
					<div className="relative max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center mb-12"
						>
							<h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
								<span className="terminal-prompt">$ </span>
								<span className="hacker-gradient-text glow-text">
									CTF_TEAMS
								</span>
								<span className="animate-pulse text-primary">_</span>
							</h1>

							<div className="terminal glass-terminal p-6 max-w-3xl mx-auto text-left">
								<div className="text-primary mb-2">
									root@openctf:~# cat teams.txt
								</div>
								<p className="text-green-400 leading-relaxed">
									{"// Global rankings of Capture The Flag teams"}
									<br />
									{"// Real-time leaderboard with team statistics and performance"}
									<br />
									<span className="text-yellow-400">
										{"// Live tracking and contest participation | Total teams: " +
											stats.total}
									</span>
								</p>
							</div>
						</motion.div>

						{/* Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
							<StatCard
								icon={Trophy}
								label="Total Teams"
								value={stats.total}
								description="Ranked globally"
								isLoading={isLoading}
							/>
							<StatCard
								icon={Shield}
								label="Verified Teams"
								value={stats.verified}
								description="CTFtime verified"
								isLoading={isLoading}
							/>
							<StatCard
								icon={Target}
								label="Active Teams"
								value={stats.active}
								description="Last 30 days"
								isLoading={isLoading}
							/>
							<StatCard
								icon={Flag}
								label="Countries"
								value={stats.countries}
								description="Represented"
								isLoading={isLoading}
							/>
						</div>
					</div>
				</section>

				{/* Filters Section */}
				<section className="py-8 px-4 bg-muted/30">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6"
						>
							{/* Search */}
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search teams..."
										value={filters.search}
										onChange={(e) => updateFilter("search", e.target.value)}
										className="pl-10 font-mono"
									/>
								</div>
							</div>

							{/* Advanced Filters */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Filter className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-mono text-muted-foreground">
										Filters:
									</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* Ranking Tier Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Ranking Tier:
										</label>
										<div className="flex flex-wrap gap-1">
											{rankingTiers.map((tier) => (
												<Badge
													key={`${tier.min}-${tier.max}`}
													variant={
														filters.rankingTier?.min === tier.min
															? "default"
															: "outline"
													}
													className="cursor-pointer transition-colors font-mono"
													onClick={() =>
														updateFilter("rankingTier", {
															min: tier.min,
															max: tier.max,
														})
													}
												>
													{tier.label}
												</Badge>
											))}
										</div>
									</div>

									{/* Country Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Countries:
										</label>
										<div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
											{countryOptions.map((country) => (
												<Badge
													key={country.code}
													variant={
														filters.countries.includes(country.code)
															? "default"
															: "outline"
													}
													className="cursor-pointer transition-colors font-mono"
													onClick={() => toggleCountryFilter(country.code)}
												>
													{country.flag} {country.code}
												</Badge>
											))}
										</div>
									</div>

									{/* Options Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Options:
										</label>
										<div className="flex flex-wrap gap-1">
											<Badge
												variant={filters.verified ? "default" : "outline"}
												className="cursor-pointer transition-colors font-mono"
												onClick={() => updateFilter("verified", !filters.verified)}
											>
												<Shield className="h-3 w-3 mr-1" />
												Verified Only
											</Badge>
											<Badge
												variant={filters.minRating ? "default" : "outline"}
												className="cursor-pointer transition-colors font-mono"
												onClick={() =>
													updateFilter("minRating", filters.minRating ? undefined : 2000)
												}
											>
												<Star className="h-3 w-3 mr-1" />
												2000+ Rating
											</Badge>
										</div>
									</div>
								</div>
							</div>

							{/* Clear Filters */}
							{hasActiveFilters && (
								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground font-mono">
										Showing {filteredTeams.length} of {teams.length} teams
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={clearFilters}
										className="font-mono"
									>
										Clear Filters
									</Button>
								</div>
							)}
						</motion.div>
					</div>
				</section>

				{/* Teams Section */}
				<section className="py-12 px-4">
					<div className="max-w-7xl mx-auto space-y-16">
						{isLoading ? (
							<div className="flex justify-center py-12">
								<LoadingSpinner size="lg" />
							</div>
						) : (
							<>
								{/* Top Teams Cards */}
								{topTeams.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="space-y-6"
									>
										<div className="flex items-center gap-3">
											<Trophy className="h-6 w-6 text-yellow-400" />
											<h2 className="text-2xl font-bold font-mono text-yellow-400 glow-text">
												&gt; TOP_TEAMS ({topTeams.length})
											</h2>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
											{topTeams.map((team, index) => (
												<TeamCard key={team.id} team={team} index={index} />
											))}
										</div>
									</motion.div>
								)}

								{/* Other Teams Table */}
								{otherTeams.length > 0 && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
										className="space-y-6"
									>
										<div className="flex items-center gap-3">
											<Users className="h-6 w-6 text-blue-400" />
											<h2 className="text-2xl font-bold font-mono text-blue-400">
												&gt; ALL_TEAMS ({otherTeams.length})
											</h2>
										</div>

										<div className="bg-card/30 rounded-none hacker-border overflow-hidden">
											<div className="overflow-x-auto">
												<table className="w-full">
													<thead className="bg-muted/50">
														<tr className="border-b border-border">
															<th className="p-4 text-left font-mono text-sm font-bold">
																Team
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Country
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Rating
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Contests
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Avg Place
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Members
															</th>
															<th className="p-4 text-left font-mono text-sm font-bold">
																Links
															</th>
														</tr>
													</thead>
													<tbody>
														{filteredTeams.slice(0, 30).map((team) => (
															<TeamTableRow key={team.id} team={team} />
														))}
													</tbody>
												</table>
											</div>

											{filteredTeams.length > 30 && (
												<div className="p-4 bg-muted/20 border-t border-border">
													<p className="text-sm text-muted-foreground font-mono text-center">
														Showing first 30 of {filteredTeams.length} teams
													</p>
												</div>
											)}
										</div>
									</motion.div>
								)}

								{/* No Results */}
								{filteredTeams.length === 0 && !isLoading && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-center py-16"
									>
										<div className="terminal glass-terminal p-8 max-w-lg mx-auto">
											<div className="text-primary mb-2">
												root@openctf:~# find teams
											</div>
											<p className="text-yellow-400 mb-4">
												{"// No teams found matching your criteria"}
												<br />
												{"// Try adjusting your filters or search terms"}
											</p>
											<Button onClick={clearFilters} className="font-mono">
												&gt; CLEAR_FILTERS
											</Button>
										</div>
									</motion.div>
								)}
							</>
						)}
					</div>
				</section>
			</div>
		</MainLayout>
	);
}
