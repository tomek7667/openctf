"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
	format,
	formatDistanceToNow,
	parseISO,
	intervalToDuration,
} from "date-fns";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Users,
	Trophy,
	Shield,
	ExternalLink,
	Flag,
	Target,
	BookOpen,
	PlusCircle,
	Star,
	Eye,
	Heart,
} from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getContest, Contest } from "@/api/contests";
import { Place } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import { clsx } from "clsx";

const getStatusColor = (status: string) => {
	switch (status) {
		case "upcoming":
			return "bg-blue-500/20 text-blue-400 border-blue-400/50";
		case "ongoing":
			return "bg-green-500/20 text-green-400 border-green-400/50";
		case "finished":
			return "bg-green-500/20 text-green-400 border-green-400/50";
		default:
			return "bg-primary/20 text-primary border-primary/50";
	}
};

const getWeightColor = (weight: number) => {
	if (weight >= 80) return "text-red-400";
	if (weight >= 50) return "text-yellow-400";
	if (weight >= 20) return "text-blue-400";
	return "text-green-400";
};

// Mock places data - in real app this would come from API
const getMockPlaces = (contestId: string): Place[] => {
	if (contestId === "contest-003" || contestId === "contest-004") {
		// Only finished contests have places
		return [
			{
				id: 1,
				team_name: "perfect blue",
				place: 1,
				ctftime_team_id: 12345,
				contest_points: 5000,
				openctf_points: 85,
				associated_contest_id: 1,
				assigned_weight_points: 85,
			},
			{
				id: 2,
				team_name: "team rocket",
				place: 2,
				ctftime_team_id: 67890,
				contest_points: 4750,
				openctf_points: 80,
				associated_contest_id: 1,
				assigned_weight_points: 80,
			},
			{
				id: 3,
				team_name: "cybersec masters",
				place: 3,
				ctftime_team_id: 11111,
				contest_points: 4200,
				openctf_points: 75,
				associated_contest_id: 1,
				assigned_weight_points: 75,
			},
			{
				id: 4,
				team_name: "null pointer exception",
				place: 4,
				ctftime_team_id: 22222,
				contest_points: 3800,
				openctf_points: 70,
				associated_contest_id: 1,
				assigned_weight_points: 70,
			},
			{
				id: 5,
				team_name: "the stack smashers",
				place: 5,
				ctftime_team_id: 33333,
				contest_points: 3400,
				openctf_points: 65,
				associated_contest_id: 1,
				assigned_weight_points: 65,
			},
		] as Place[];
	}
	return [];
};

const PlaceRow = ({ place, index }: { place: Place; index: number }) => {
	const getPlaceStyle = (position: number) => {
		switch (position) {
			case 1:
				return "bg-gradient-to-r from-yellow-500/30 to-orange-500/20 border-yellow-400 shadow-lg shadow-yellow-400/20";
			case 2:
				return "bg-gradient-to-r from-gray-300/30 to-gray-500/20 border-gray-400 shadow-lg shadow-gray-400/20";
			case 3:
				return "bg-gradient-to-r from-amber-600/30 to-yellow-700/20 border-amber-600 shadow-lg shadow-amber-600/20";
			default:
				return "hover:bg-muted/20 border-border/50";
		}
	};

	const getPlaceIcon = (position: number) => {
		switch (position) {
			case 1:
				return (
					<Trophy className="h-6 w-6 text-yellow-400 animate-bounce" />
				);
			case 2:
				return (
					<div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-sm">
						2
					</div>
				);
			case 3:
				return (
					<div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold text-sm">
						3
					</div>
				);
			default:
				return (
					<div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
						{position}
					</div>
				);
		}
	};

	return (
		<motion.tr
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			onClick={() => {
				window.location.href = `/teams/${place.team_name.toLowerCase().replace(/\s+/g, "-")}`;
			}}
			className={clsx(
				"border-b transition-all duration-300 cursor-pointer hover:bg-primary/5",
				getPlaceStyle(place.place)
			)}
		>
			<td className="p-3">
				<div className="flex items-center gap-3">
					{getPlaceIcon(place.place)}
					<span
						className={clsx(
							"font-mono font-bold text-sm",
							place.place <= 3 ? "text-foreground" : "text-primary"
						)}
					>
						{place.place}
					</span>
				</div>
			</td>
			<td className="p-3">
				<div>
					<div
						className={clsx(
							"font-mono font-bold text-sm",
							place.place === 1
								? "text-yellow-400"
								: place.place === 2
									? "text-gray-300"
									: place.place === 3
										? "text-amber-600"
										: "text-foreground"
						)}
					>
						{place.team_name}
					</div>
					{place.ctftime_team_id && (
						<div className="text-xs text-muted-foreground font-mono">
							CTFtime: {place.ctftime_team_id}
						</div>
					)}
				</div>
			</td>
			<td className="p-3 font-mono text-xs font-bold text-right">
				{place.contest_points?.toLocaleString() || 0}
			</td>
			<td className="p-3 font-mono text-xs text-right">
				<span
					className={clsx(
						"font-bold",
						place.place === 1
							? "text-yellow-400"
							: place.place === 2
								? "text-gray-300"
								: place.place === 3
									? "text-amber-600"
									: "text-primary"
					)}
				>
					{place.openctf_points?.toFixed(1) || 0}
				</span>
			</td>
		</motion.tr>
	);
};

// Mock writeups data
const getMockWriteups = (contestId: string) => {
	if (contestId === "contest-003") {
		return [
			{
				id: 1,
				title: "Web Challenge: SQL Injection in Login Form",
				description: "A detailed walkthrough of exploiting SQL injection vulnerability in the contest's login system.",
				authorName: "hackerman",
				authorAvatar: null,
				category: "web",
				difficulty: "Medium",
				tags: ["sql-injection", "web", "authentication"],
				averageRating: 4.5,
				totalRatings: 12,
				views: 234,
				likes: 18,
				createdAt: "2024-01-15T10:30:00Z",
				featured: true,
				verified: true,
			},
			{
				id: 2,
				title: "Crypto: RSA Key Recovery",
				description: "How to recover RSA private key from weak random number generation.",
				authorName: "cryptoking",
				authorAvatar: null,
				category: "crypto",
				difficulty: "Hard",
				tags: ["rsa", "crypto", "weak-rng"],
				averageRating: 4.8,
				totalRatings: 8,
				views: 156,
				likes: 24,
				createdAt: "2024-01-16T14:20:00Z",
				featured: false,
				verified: true,
			},
		];
	}
	return [];
};

function WriteupCard({ writeup }: { writeup: any }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="group relative"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
			
			<div className="relative bg-card/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 h-full hover:border-green-400/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20">
				<div className="flex items-start justify-between mb-4">
					<div>
						<h3 className="font-mono text-lg font-bold text-white group-hover:text-green-400 transition-colors line-clamp-2">
							<Link href={`/writeups/${writeup.id}`}>
								{writeup.title}
							</Link>
						</h3>
						<div className="flex items-center space-x-2 mt-1">
							<Badge variant="outline" className="text-xs">
								{writeup.category.toUpperCase()}
							</Badge>
							<span className="text-xs font-mono text-yellow-400">
								[{writeup.difficulty.toUpperCase()}]
							</span>
						</div>
					</div>
				</div>

				<p className="text-gray-300 text-sm mb-4 line-clamp-3 font-mono">
					{writeup.description}
				</p>

				<div className="flex items-center space-x-4 mb-4 text-sm">
					<span className="text-gray-300 font-mono">@{writeup.authorName}</span>
				</div>

				<div className="flex items-center justify-between text-sm text-gray-400">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-1">
							<Star className="h-4 w-4 text-yellow-400 fill-current" />
							<span className="font-mono">{writeup.averageRating.toFixed(1)}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Eye className="h-4 w-4" />
							<span className="font-mono">{writeup.views}</span>
						</div>
						<div className="flex items-center space-x-1">
							<Heart className="h-4 w-4" />
							<span className="font-mono">{writeup.likes}</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

export default function ContestDetailsPage() {
	const params = useParams();
	const contestId = params.id as string;
	const { isAuthenticated } = useAuth();

	const [contest, setContest] = useState<Contest | null>(null);
	const [places, setPlaces] = useState<Place[]>([]);
	const [writeups, setWriteups] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchContestDetails = async () => {
			try {
				setIsLoading(true);
				// Get contest details
				const contestResponse = await getContest(contestId);
				if (contestResponse.success && contestResponse.data) {
					setContest(contestResponse.data);

					// Get places for finished contests
					if (contestResponse.data.status === "finished") {
						const placesData = getMockPlaces(contestId);
						setPlaces(placesData);
					}

					// Get writeups for this contest
					const writeupsData = getMockWriteups(contestId);
					setWriteups(writeupsData);
				}
			} catch (error) {
				console.error("Error fetching contest details:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (contestId) {
			fetchContestDetails();
		}
	}, [contestId]);

	if (isLoading) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner size="lg" />
				</div>
			</MainLayout>
		);
	}

	if (!contest) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center">
					<div className="terminal glass-terminal p-8 max-w-lg mx-auto text-center">
						<div className="text-primary mb-2">
							root@openctf:~# cat contest.txt
						</div>
						<p className="text-red-400 mb-4">
							{"// Contest not found"}
							<br />
							{"// Error 404: Resource does not exist"}
						</p>
						<Link href="/contests" className="btn-terminal">
							&gt; BACK_TO_CONTESTS
						</Link>
					</div>
				</div>
			</MainLayout>
		);
	}

	const formatContestDate = (dateString: string) => {
		const date = parseISO(dateString);
		return format(date, "EEEE, MMMM dd, yyyy 'at' HH:mm");
	};

	const getDuration = () => {
		const start = parseISO(contest.startTime);
		const end = parseISO(contest.endTime);
		const duration = intervalToDuration({ start, end });

		if (duration.days) {
			return `${duration.days}d ${duration.hours}h`;
		}
		return `${duration.hours}h ${duration.minutes}m`;
	};

	const getTimeStatus = () => {
		// const now = new Date();
		const start = parseISO(contest.startTime);
		const end = parseISO(contest.endTime);

		if (contest.status === "upcoming") {
			return {
				label: `Starts ${formatDistanceToNow(start, { addSuffix: true })}`,
				color: "text-blue-400",
			};
		} else if (contest.status === "live") {
			return {
				label: `Ends ${formatDistanceToNow(end, { addSuffix: true })}`,
				color: "text-green-400",
			};
		} else if (contest.status === "finished") {
			return {
				label: `Ended ${formatDistanceToNow(end, { addSuffix: true })}`,
				color: "text-gray-400",
			};
		}
		return null;
	};

	const timeStatus = getTimeStatus();

	return (
		<MainLayout>
			<div className="min-h-screen">
				{/* Header */}
				<section className="py-8 px-4">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center gap-4 mb-6">
							<Link
								href="/contests"
								className="p-2 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
							>
								<ArrowLeft className="h-5 w-5" />
							</Link>
							<h1 className="text-3xl md:text-4xl font-bold font-mono">
								<span className="terminal-prompt">$ </span>
								<span className="hacker-gradient-text">
									{contest.name.replace(/-/g, "_").toUpperCase()}
								</span>
							</h1>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Contest Info */}
							<div className="lg:col-span-2 space-y-6">
								<div>
									<div className="flex items-center gap-3 mb-4">
										<div
											className={clsx(
												"px-3 py-1 rounded border text-sm font-mono font-bold flex items-center gap-2",
												getStatusColor(contest.status || "unknown")
											)}
										>
											{contest.status === "live" && (
												<Target className="h-4 w-4" />
											)}
											{contest.status === "upcoming" && (
												<Calendar className="h-4 w-4" />
											)}
											{contest.status === "finished" && (
												<Trophy className="h-4 w-4" />
											)}
											{(contest.status || "unknown").toUpperCase()}
										</div>
										{contest.ctftimeId && (
											<a
												href={`https://ctftime.org/event/${contest.ctftimeId}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Badge
													variant="outline"
													className="font-mono cursor-pointer hover:bg-primary/10"
												>
													<Flag className="h-3 w-3 mr-1" />
													CTFtime
												</Badge>
											</a>
										)}
									</div>

									{contest.description && (
										<p className="text-muted-foreground leading-relaxed mb-6">
											{contest.description}
										</p>
									)}

									{timeStatus && (
										<div className="p-4 bg-primary/5 border border-primary/20 rounded font-mono">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-primary" />
												<span className={timeStatus.color}>
													{timeStatus.label}
												</span>
											</div>
										</div>
									)}
								</div>

								{/* Additional Details */}
								{(contest.rulesUrl || contest.prizes.length > 0) && (
									<div className="space-y-4">
										{contest.rulesUrl && (
											<div>
												<h3 className="font-bold font-mono text-primary mb-2">
													&gt; RULES
												</h3>
												<a
													href={contest.rulesUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary hover:underline"
												>
													View Contest Rules
												</a>
											</div>
										)}

										{contest.prizes.length > 0 && (
											<div>
												<h3 className="font-bold font-mono text-primary mb-2">
													&gt; PRIZES
												</h3>
												<div className="space-y-2">
													{contest.prizes.slice(0, 3).map((prize, index) => (
														<div
															key={index}
															className="text-muted-foreground text-sm"
														>
															{prize.rank}. {prize.description}
															{prize.value &&
																prize.currency &&
																` - ${prize.value} ${prize.currency}`}
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Stats Sidebar */}
							<div className="space-y-6">
								<div className="bg-card/50 p-6 rounded-none hacker-border">
									<h3 className="font-bold font-mono text-primary mb-4">
										&gt; CONTEST_INFO
									</h3>

									<div className="space-y-4">
										<div>
											<div className="flex items-center gap-2 text-muted-foreground mb-1">
												<Calendar className="h-4 w-4" />
												<span className="text-sm">Start Date</span>
											</div>
											<div className="font-mono text-sm">
												{formatContestDate(contest.startTime)}
											</div>
										</div>

										<div>
											<div className="flex items-center gap-2 text-muted-foreground mb-1">
												<Clock className="h-4 w-4" />
												<span className="text-sm">Duration</span>
											</div>
											<div className="font-mono text-sm">{getDuration()}</div>
										</div>

										<div>
											<div className="flex items-center gap-2 text-muted-foreground mb-1">
												<Users className="h-4 w-4" />
												<span className="text-sm">Participants</span>
											</div>
											<div className="font-mono text-sm">
												{contest.participantCount} teams
											</div>
										</div>

										<div>
											<div className="flex items-center gap-2 text-muted-foreground mb-1">
												<Shield className="h-4 w-4" />
												<span className="text-sm">Weight Points</span>
											</div>
											<div
												className={clsx(
													"font-mono font-bold",
													getWeightColor(contest.weight || 0)
												)}
											>
												{contest.weight || 0} pts
											</div>
										</div>

										{contest.website && (
											<div className="pt-4">
												<a
													href={contest.website}
													target="_blank"
													rel="noopener noreferrer"
													className="w-full bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded font-mono font-bold text-sm transition-colors flex items-center justify-center gap-2"
												>
													<ExternalLink className="h-4 w-4" />
													VISIT CONTEST
												</a>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Leaderboard Section */}
				{contest.status === "finished" && places.length > 0 && (
					<section className="py-12 px-4 border-b border-border/50">
						<div className="max-w-7xl mx-auto">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="space-y-6"
							>
								<div className="flex items-center gap-3">
									<Trophy className="h-6 w-6 text-yellow-400" />
									<h2 className="text-2xl font-bold font-mono text-yellow-400">
										&gt; FINAL_LEADERBOARD
									</h2>
								</div>

								<div className="bg-card/30 rounded-none hacker-border overflow-hidden">
									<div className="p-3 bg-muted/50 border-b border-border">
										<div className="flex items-center gap-2">
											<Trophy className="h-4 w-4 text-yellow-400" />
											<h3 className="text-sm font-bold font-mono text-yellow-400">
												FINAL STANDINGS ({places.length})
											</h3>
										</div>
									</div>
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-muted/30">
												<tr className="border-b border-border/50">
													<th className="p-3 text-left font-mono text-xs font-bold">
														Rank
													</th>
													<th className="p-3 text-left font-mono text-xs font-bold">
														Team
													</th>
													<th className="p-3 text-right font-mono text-xs font-bold">
														Contest Points
													</th>
													<th className="p-3 text-right font-mono text-xs font-bold">
														OpenCTF Points
													</th>
												</tr>
											</thead>
											<tbody>
												{places.map((place, index) => (
													<PlaceRow
														key={place.id}
														place={place}
														index={index}
													/>
												))}
											</tbody>
										</table>
									</div>
								</div>
							</motion.div>
						</div>
					</section>
				)}

				{/* No Leaderboard Message */}
				{contest.status !== "finished" && (
					<section className="py-12 px-4 border-b border-border/50">
						<div className="max-w-7xl mx-auto text-center">
							<div className="terminal glass-terminal p-8 max-w-lg mx-auto">
								<div className="text-primary mb-2">
									root@openctf:~# cat leaderboard.txt
								</div>
								<p className="text-yellow-400">
									{contest.status === "upcoming" &&
										"// Leaderboard will be available when contest starts"}
									{contest.status === "live" &&
										"// Live leaderboard coming soon"}
									{contest.status === "cancelled" &&
										"// Contest was cancelled - no leaderboard available"}
								</p>
							</div>
						</div>
					</section>
				)}

				{/* Writeups Section */}
				<section className="py-12 px-4">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<BookOpen className="h-6 w-6 text-green-400" />
								<h2 className="text-2xl font-bold font-mono text-green-400">
									&gt; WRITEUPS
								</h2>
							</div>
							{isAuthenticated && (
								<Link href={`/writeups/create?contest=${contestId}`}>
									<Button className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold">
										<PlusCircle className="h-4 w-4 mr-2" />
										CREATE WRITEUP
									</Button>
								</Link>
							)}
						</div>

						{writeups.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{writeups.map((writeup) => (
									<WriteupCard key={writeup.id} writeup={writeup} />
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
								<h3 className="text-xl font-mono text-gray-400 mb-2">No writeups yet</h3>
								<p className="text-gray-500 font-mono mb-4">Be the first to share your solution!</p>
								{isAuthenticated && (
									<Link href={`/writeups/create?contest=${contestId}`}>
										<Button className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold">
											<PlusCircle className="h-4 w-4 mr-2" />
											CREATE WRITEUP
										</Button>
									</Link>
								)}
							</div>
						)}
					</div>
				</section>
			</div>
		</MainLayout>
	);
}
