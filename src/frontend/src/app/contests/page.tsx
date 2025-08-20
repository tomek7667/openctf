"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	Search,
	Filter,
	Calendar,
	Trophy,
	Clock,
	Users,
	Target,
	Shield,
	Star,
} from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContestCard } from "@/components/contests/ContestCard";
import { LiveCTFWidget } from "@/components/contests/LiveCTFWidget";
import { getContests, ParsedAggregatedContest } from "@/api/contests";
import { ContestStatus, ContestStatusType } from "@/types/api";
import { clsx } from "clsx";

const contestStatuses: {
	status: ContestStatusType | "all";
	label: string;
	icon: React.ComponentType<{ className?: undefined | string }>;
}[] = [
	{ status: "all", label: "All Contests", icon: Calendar },
	{ status: ContestStatus.Ongoing, label: "Live Now", icon: Target },
	{ status: ContestStatus.Upcoming, label: "Upcoming", icon: Clock },
	{ status: ContestStatus.Finished, label: "Finished", icon: Trophy },
];

const ratingOptions = [
	{ min: 4, max: 5, label: "4+ Stars" },
	{ min: 3, max: 5, label: "3+ Stars" },
	{ min: 2, max: 5, label: "2+ Stars" },
	{ min: 1, max: 5, label: "1+ Stars" },
];

const weightOptions = [
	{ min: 80, max: 100, label: "Extreme (80+)" },
	{ min: 50, max: 79, label: "Hard (50-79)" },
	{ min: 20, max: 49, label: "Medium (20-49)" },
	{ min: 0, max: 19, label: "Easy (0-19)" },
];

const getCurrentYear = () => new Date().getFullYear();
const getYearOptions = () => {
	const currentYear = getCurrentYear();
	return Array.from({ length: 5 }, (_, i) => currentYear - i);
};

interface ContestFilters {
	search: string;
	status: ContestStatus | "all";
	minRating?: undefined | number;
	maxRating?: undefined | number;
	minWeight?: undefined | number;
	maxWeight?: undefined | number;
	year?: undefined | number;
}

const ContestTableRow = ({ contest }: { contest: ParsedAggregatedContest }) => (
	<tr
		className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer max-h-[500px] overflow-y-auto"
		onClick={() => (window.location.href = `/contests/${contest.id}`)}
	>
		<td className="p-4 font-mono max-w-[400px]">
			<div>
				<div className="font-bold text-foreground">
					{contest.name.replace(/-/g, " ").toUpperCase()}
				</div>
				<div className="text-sm text-muted-foreground truncate">
					{contest.description}
				</div>
			</div>
		</td>
		<td className="p-4 font-mono text-xs">
			{new Date(contest.start).toLocaleDateString()}
			<br />
			{new Date(contest.start).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}
		</td>
		<td className="p-4 font-mono text-xs">
			{new Date(contest.end).toLocaleDateString()}
			<br />
			{new Date(contest.end).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			})}
		</td>
		<td className="p-4 font-mono text-xs">{contest.duration}h</td>
		<td className="p-4 font-mono text-sm">
			<div className="flex items-center gap-1">
				<Shield className="h-4 w-4 text-muted-foreground" />
				<span
					className={clsx(
						"font-bold",
						(contest.assigned_weight_points || 0) >= 80
							? "text-red-400"
							: (contest.assigned_weight_points || 0) >= 50
								? "text-yellow-400"
								: (contest.assigned_weight_points || 0) >= 20
									? "text-blue-400"
									: "text-green-400"
					)}
				>
					{contest.assigned_weight_points || 0}
				</span>
			</div>
		</td>
		<td className="p-4 font-mono text-sm">
			<div className="flex items-center gap-1">
				<Users className="h-4 w-4 text-muted-foreground" />
				{contest.participants ?? "---"}
			</div>
		</td>
		<td className="p-4 font-mono text-sm">
			<div className="flex items-center gap-1">
				{Array.from({ length: 5 }, (_, i) => (
					<Star
						key={i}
						className={clsx(
							"h-4 w-4",
							i < (contest?.rating ?? 0)
								? "text-yellow-400 fill-yellow-400"
								: "text-gray-600"
						)}
					/>
				))}
			</div>
		</td>
	</tr>
);

export default function ContestsPage() {
	const [contests, setContests] = useState<ParsedAggregatedContest[]>([]);
	const [filteredContests, setFilteredContests] = useState<
		ParsedAggregatedContest[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filters, setFilters] = useState<ContestFilters>({
		search: "",
		status: "all",
	});

	// Fetch contests on mount
	useEffect(() => {
		const fetchContests = async () => {
			try {
				setIsLoading(true);
				const contests = await getContests({
					Offset: 0,
					Limit: 50,
				});
				setContests(contests || []);
				setFilteredContests(contests || []);
			} catch (error) {
				console.error("Error fetching contests:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchContests();
	}, []);

	// Apply filters whenever filters or contests change
	useEffect(() => {
		let filtered = [...contests];

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(contest) =>
					contest.name.toLowerCase().includes(searchLower) ||
					contest.description?.toLowerCase().includes(searchLower)
			);
		}

		// Status filter
		if (filters.status !== "all") {
			filtered = filtered.filter(
				(contest) => contest.status === filters.status
			);
		}

		// Rating filter
		if (filters.minRating !== undefined) {
			filtered = filtered.filter(
				(contest) => (contest.rating ?? 0) >= (filters.minRating ?? 0)
			);
		}
		if (filters.maxRating !== undefined) {
			filtered = filtered.filter(
				(contest) => (contest.rating ?? 0) <= (filters.maxRating ?? 0)
			);
		}

		// Weight filter
		if (filters.minWeight !== undefined && filters.maxWeight !== undefined) {
			filtered = filtered.filter((contest) => {
				const weight = contest.assigned_weight_points || 0;
				return weight >= filters.minWeight! && weight <= filters.maxWeight!;
			});
		}

		// Year filter
		if (filters.year) {
			filtered = filtered.filter(
				(contest) => new Date(contest.start).getFullYear() === filters.year
			);
		}

		setFilteredContests(filtered);
	}, [contests, filters]);

	const updateFilter = (key: keyof ContestFilters, value: any) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const setRatingFilter = (
		min?: undefined | number,
		max?: undefined | number
	) => {
		setFilters((prev) => ({ ...prev, minRating: min, maxRating: max }));
	};

	const setWeightFilter = (
		min?: undefined | number,
		max?: undefined | number
	) => {
		setFilters((prev) => ({ ...prev, minWeight: min, maxWeight: max }));
	};

	const clearFilters = () => {
		setFilters({
			search: "",
			status: "all",
		});
	};

	const OngoingContestsSection = ({
		contests,
	}: {
		contests: ParsedAggregatedContest[];
	}) => {
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 6;
		const totalPages = Math.ceil(contests.length / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const currentContests = contests.slice(
			startIndex,
			startIndex + itemsPerPage
		);

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="space-y-6"
			>
				<div className="flex items-center gap-3">
					<Target className="h-6 w-6 text-green-400" />
					<h2 className="text-2xl font-bold font-mono text-green-400 glow-text">
						&gt; LIVE_CONTESTS ({contests.length})
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{currentContests.map((contest, index) => (
						<ContestCard key={contest.id} contest={contest} index={index} />
					))}
				</div>
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="font-mono"
						>
							&lt;
						</Button>
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							const pageNum =
								Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
							return (
								<Button
									key={pageNum}
									variant={currentPage === pageNum ? "primary" : "outline"}
									size="sm"
									onClick={() => setCurrentPage(pageNum)}
									className="font-mono min-w-[2.5rem]"
								>
									{pageNum}
								</Button>
							);
						})}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="font-mono"
						>
							&gt;
						</Button>
					</div>
				)}
			</motion.div>
		);
	};

	const UpcomingContestsSection = ({
		contests,
	}: {
		contests: ParsedAggregatedContest[];
	}) => {
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 6;
		const totalPages = Math.ceil(contests.length / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const currentContests = contests.slice(
			startIndex,
			startIndex + itemsPerPage
		);

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="space-y-6"
			>
				<div className="flex items-center gap-3">
					<Clock className="h-6 w-6 text-blue-400" />
					<h2 className="text-2xl font-bold font-mono text-blue-400">
						&gt; UPCOMING_CONTESTS ({contests.length})
					</h2>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{currentContests.map((contest, index) => (
						<ContestCard key={contest.id} contest={contest} index={index} />
					))}
				</div>
				{totalPages > 1 && (
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(currentPage - 1)}
							disabled={currentPage === 1}
							className="font-mono"
						>
							&lt;
						</Button>
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							const pageNum =
								Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
							return (
								<Button
									key={pageNum}
									variant={currentPage === pageNum ? "primary" : "outline"}
									size="sm"
									onClick={() => setCurrentPage(pageNum)}
									className="font-mono min-w-[2.5rem]"
								>
									{pageNum}
								</Button>
							);
						})}
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="font-mono"
						>
							&gt;
						</Button>
					</div>
				)}
			</motion.div>
		);
	};

	const FinishedContestsSection = ({
		contests,
	}: {
		contests: ParsedAggregatedContest[];
	}) => {
		const [currentPage, setCurrentPage] = useState(1);
		const itemsPerPage = 20;
		const totalPages = Math.ceil(contests.length / itemsPerPage);
		const startIndex = (currentPage - 1) * itemsPerPage;
		const currentContests = contests.slice(
			startIndex,
			startIndex + itemsPerPage
		);

		const getVisiblePages = () => {
			const delta = 2;
			const range = [];
			const rangeWithDots = [];

			for (
				let i = Math.max(2, currentPage - delta);
				i <= Math.min(totalPages - 1, currentPage + delta);
				i++
			) {
				range.push(i);
			}

			if (currentPage - delta > 2) {
				rangeWithDots.push(1, "...");
			} else {
				rangeWithDots.push(1);
			}

			rangeWithDots.push(...range);

			if (currentPage + delta < totalPages - 1) {
				rangeWithDots.push("...", totalPages);
			} else if (totalPages > 1) {
				rangeWithDots.push(totalPages);
			}

			return rangeWithDots;
		};

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="space-y-6"
			>
				<div className="flex items-center gap-3">
					<Trophy className="h-6 w-6 text-yellow-400" />
					<h2 className="text-2xl font-bold font-mono text-yellow-400">
						&gt; FINISHED_CONTESTS ({contests.length})
					</h2>
				</div>
				<div className="bg-card/30 rounded-none hacker-border overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-muted/50">
								<tr className="border-b border-border">
									<th className="p-4 text-left font-mono text-sm font-bold">
										Contest
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										Start
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										End
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										<Clock />
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										Weight
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										Teams
									</th>
									<th className="p-4 text-left font-mono text-sm font-bold">
										Rating
									</th>
								</tr>
							</thead>
							<tbody>
								{currentContests.map((contest) => (
									<ContestTableRow key={contest.id} contest={contest} />
								))}
							</tbody>
						</table>
					</div>
					{totalPages > 1 && (
						<div className="flex items-center justify-between p-4 bg-muted/20 border-t border-border">
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(1)}
									disabled={currentPage === 1}
									className="font-mono"
								>
									&lt;&lt;
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
									className="font-mono"
								>
									&lt;
								</Button>
							</div>
							<div className="flex items-center gap-1">
								{getVisiblePages().map((page, index) =>
									page === "..." ? (
										<span
											key={`dots-${index}`}
											className="px-2 font-mono text-muted-foreground"
										>
											...
										</span>
									) : (
										<Button
											key={page}
											variant={currentPage === page ? "primary" : "outline"}
											size="sm"
											onClick={() => setCurrentPage(page as number)}
											className="font-mono min-w-[2.5rem]"
										>
											{page}
										</Button>
									)
								)}
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
									className="font-mono"
								>
									&gt;
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(totalPages)}
									disabled={currentPage === totalPages}
									className="font-mono"
								>
									&gt;&gt;
								</Button>
								<span className="text-sm text-muted-foreground font-mono ml-2">
									{startIndex + 1}-
									{Math.min(startIndex + itemsPerPage, contests.length)} of{" "}
									{contests.length}
								</span>
							</div>
						</div>
					)}
				</div>
			</motion.div>
		);
	};

	// Group contests by status
	const ongoingContests = filteredContests.filter(
		(c) => c.status === ContestStatus.Ongoing // Contest interface uses 'live' not 'ongoing'
	);
	const upcomingContests = filteredContests.filter(
		(c) => c.status === ContestStatus.Upcoming
	);
	const finishedContests = filteredContests.filter(
		(c) => c.status === ContestStatus.Finished
	);

	const stats = {
		total: contests.length,
		ongoing: contests.filter((c) => c.status === ContestStatus.Ongoing).length, // Contest interface uses 'live'
		upcoming: contests.filter((c) => c.status === ContestStatus.Upcoming)
			.length,
		finished: contests.filter((c) => c.status === ContestStatus.Finished)
			.length,
	};

	return (
		<MainLayout>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="py-8 px-4 relative overflow-hidden">
					<div className="absolute inset-0 matrix-bg opacity-20" />
					<div className="relative max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center mb-6"
						>
							<h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono">
								<span className="terminal-prompt">$ </span>
								<span className="hacker-gradient-text glow-text">
									CTF_CONTESTS
								</span>
								<span className="animate-pulse text-primary">_</span>
							</h1>

							<div className="terminal glass-terminal p-6 max-w-3xl mx-auto text-left">
								<div className="text-primary mb-2">
									root@openctf:~# cat contests.txt
								</div>
								<p className="text-green-400 leading-relaxed">
									{"// Browse all Capture The Flag competitions"}
									<br />
									{
										"// Upcoming, ongoing, and finished contests from around the world"
									}
									<br />
									<span className="text-yellow-400">
										{"// Live tracking and real-time updates | Total: " +
											stats.total}
									</span>
								</p>
							</div>
						</motion.div>

						{/* Live CTF Widget */}
						<LiveCTFWidget contests={contests} />
					</div>
				</section>

				{/* Filters Section */}
				<section className="py-6 px-4 bg-muted/30">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="space-y-6"
						>
							{/* Search and Status Filter */}
							<div className="flex flex-col md:flex-row gap-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Search contests..."
										value={filters.search}
										onChange={(e) => updateFilter("search", e.target.value)}
										className="pl-10 font-mono"
									/>
								</div>

								<div className="flex flex-wrap gap-2">
									{contestStatuses.map(({ status, label, icon: Icon }) => (
										<Button
											key={status}
											variant={
												filters.status === status ? "primary" : "outline"
											}
											size="sm"
											onClick={() => updateFilter("status", status)}
											className="font-mono"
										>
											<Icon className="h-4 w-4 mr-1" />
											{label}
										</Button>
									))}
								</div>
							</div>

							{/* Advanced Filters */}
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Filter className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm font-mono text-muted-foreground">
										Advanced Filters:
									</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{/* Rating Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Quality Rating:
										</label>
										<div className="flex flex-wrap gap-1">
											{ratingOptions.map((option) => (
												<Badge
													key={`${option.min}-${option.max}`}
													variant={
														filters.minRating === option.min
															? "default"
															: "outline"
													}
													className="cursor-pointer transition-colors font-mono"
													onClick={() =>
														setRatingFilter(option.min, option.max)
													}
												>
													{option.label}
												</Badge>
											))}
										</div>
									</div>

									{/* Weight Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Difficulty Weight:
										</label>
										<div className="flex flex-wrap gap-1">
											{weightOptions.map((option) => (
												<Badge
													key={`${option.min}-${option.max}`}
													variant={
														filters.minWeight === option.min
															? "default"
															: "outline"
													}
													className="cursor-pointer transition-colors font-mono"
													onClick={() =>
														setWeightFilter(option.min, option.max)
													}
												>
													{option.label}
												</Badge>
											))}
										</div>
									</div>

									{/* Year Filter */}
									<div className="space-y-2">
										<label className="text-sm font-mono text-muted-foreground">
											Year:
										</label>
										<div className="flex flex-wrap gap-1">
											{getYearOptions().map((year) => (
												<Badge
													key={year}
													variant={
														filters.year === year ? "default" : "outline"
													}
													className="cursor-pointer transition-colors font-mono"
													onClick={() => updateFilter("year", year)}
												>
													{year}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Clear Filters */}

							<div className="flex justify-between items-center">
								<span className="text-sm text-muted-foreground font-mono">
									Showing {filteredContests.length} of {contests.length}{" "}
									contests
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
						</motion.div>
					</div>
				</section>

				{/* Contest Sections */}
				<section className="py-6 px-4">
					<div className="max-w-7xl mx-auto space-y-6">
						{isLoading ? (
							<div className="flex justify-center py-12">
								<LoadingSpinner size="lg" />
							</div>
						) : (
							<>
								{/* Ongoing Contests */}
								{(filters.status === "all" ||
									filters.status === ContestStatus.Ongoing) &&
									ongoingContests.length > 0 && (
										<OngoingContestsSection contests={ongoingContests} />
									)}

								{/* Upcoming Contests */}
								{(filters.status === "all" || filters.status === "upcoming") &&
									upcomingContests.length > 0 && (
										<UpcomingContestsSection contests={upcomingContests} />
									)}

								{/* Finished Contests - Table View */}
								{(filters.status === "all" || filters.status === "finished") &&
									finishedContests.length > 0 && (
										<FinishedContestsSection contests={finishedContests} />
									)}

								{/* No Results */}
								{filteredContests.length === 0 && !isLoading && (
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-center py-16"
									>
										<div className="terminal glass-terminal p-8 max-w-lg mx-auto">
											<div className="text-primary mb-2">
												root@openctf:~# find contests
											</div>
											<p className="text-yellow-400 mb-4">
												{"// No contests found matching your criteria"}
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
