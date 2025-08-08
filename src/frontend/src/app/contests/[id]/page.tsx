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
	Star,
	Shield,
	ExternalLink,
	Flag,
	Target,
} from "@/components/ui/icons";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getContest, Contest } from "@/api/contests";
import { Place } from "@/types/api";
import { clsx } from "clsx";

const getStatusColor = (status: string) => {
	switch (status) {
		case "upcoming":
			return "bg-blue-500/20 text-blue-400 border-blue-400/50";
		case "ongoing":
			return "bg-green-500/20 text-green-400 border-green-400/50";
		case "finished":
			return "bg-gray-500/20 text-gray-400 border-gray-400/50";
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

const renderStars = (rating?: undefined | number) => {
	if (!rating)
		return (
			<span className="text-muted-foreground text-sm">No ratings yet</span>
		);
	return (
		<div className="flex items-center gap-1">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={clsx(
						"h-4 w-4",
						i < Math.floor(rating)
							? "text-yellow-400 fill-current"
							: "text-gray-600"
					)}
				/>
			))}
			<span className="text-sm text-muted-foreground ml-1">
				({rating.toFixed(1)})
			</span>
		</div>
	);
};

// Mock places data - in real app this would come from API
const getMockPlaces = (contestId: number): Place[] => {
	if (contestId === 3 || contestId === 4) {
		// Only finished contests have places
		return [
			{
				id: 1,
				team_name: "perfect blue",
				place: 1,
				ctftime_team_id: 12345,
				contest_points: 5000,
				openctf_points: 85,
				associated_contest_id: contestId,
				assigned_weight_points: 85,
			},
			{
				id: 2,
				team_name: "team rocket",
				place: 2,
				ctftime_team_id: 67890,
				contest_points: 4750,
				openctf_points: 80,
				associated_contest_id: contestId,
				assigned_weight_points: 80,
			},
			{
				id: 3,
				teamName: "cybersec masters",
				place: 3,
				ctftimeTeamId: 11111,
				contestPoints: 4200,
				openctfPoints: 75,
				associatedContestId: contestId,
				assignedWeightPoints: 75,
				createdAt: "2024-05-20T06:30:00Z",
				updatedAt: "2024-05-20T06:30:00Z",
			},
			{
				id: 4,
				teamName: "null pointer exception",
				place: 4,
				ctftimeTeamId: 22222,
				contestPoints: 3800,
				openctfPoints: 70,
				associatedContestId: contestId,
				assignedWeightPoints: 70,
				createdAt: "2024-05-20T06:30:00Z",
				updatedAt: "2024-05-20T06:30:00Z",
			},
			{
				id: 5,
				teamName: "the stack smashers",
				place: 5,
				ctftimeTeamId: 33333,
				contestPoints: 3400,
				openctfPoints: 65,
				associatedContestId: contestId,
				assignedWeightPoints: 65,
				createdAt: "2024-05-20T06:30:00Z",
				updatedAt: "2024-05-20T06:30:00Z",
			},
		] as Place[];
	}
	return [];
};

const PlaceRow = ({ place, index }: { place: Place; index: number }) => {
	const getPlaceStyle = (position: number) => {
		switch (position) {
			case 1:
				return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/50";
			case 2:
				return "bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50";
			case 3:
				return "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/50";
			default:
				return "hover:bg-muted/20";
		}
	};

	const getPlaceIcon = (position: number) => {
		switch (position) {
			case 1:
				return <Trophy className="h-5 w-5 text-yellow-400" />;
			case 2:
				return (
					<div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-xs">
						2
					</div>
				);
			case 3:
				return (
					<div className="w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold text-xs">
						3
					</div>
				);
			default:
				return <span className="text-primary font-bold">#{position}</span>;
		}
	};

	return (
		<motion.tr
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			className={clsx(
				"border-b border-border/50 transition-colors",
				getPlaceStyle(place.place)
			)}
		>
			<td className="p-4">
				<div className="flex items-center gap-3">
					{getPlaceIcon(place.place)}
					<span className="font-mono font-bold">{place.place}</span>
				</div>
			</td>
			<td className="p-4">
				<div className="font-mono font-bold text-foreground">
					{place.team_name}
				</div>
				{place.ctftime_team_id && (
					<div className="text-xs text-muted-foreground">
						CTFtime ID: {place.ctftime_team_id}
					</div>
				)}
			</td>
			<td className="p-4 font-mono text-right">
				{place.contest_points?.toFixed(0) || 0}
			</td>
			<td className="p-4 font-mono text-right">
				<span className="text-primary font-bold">
					{place.openctf_points?.toFixed(1) || 0}
				</span>
			</td>
		</motion.tr>
	);
};

export default function ContestDetailsPage() {
	const params = useParams();
	const contestId = params.id as string;

	const [contest, setContest] = useState<Contest | null>(null);
	const [places, setPlaces] = useState<Place[]>([]);
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
		const start = parseISO(contest.start);
		const end = parseISO(contest.end);
		const duration = intervalToDuration({ start, end });

		if (duration.days) {
			return `${duration.days}d ${duration.hours}h`;
		}
		return `${duration.hours}h ${duration.minutes}m`;
	};

	const getTimeStatus = () => {
		// const now = new Date();
		const start = parseISO(contest.start);
		const end = parseISO(contest.end);

		if (contest.status === "upcoming") {
			return {
				label: `Starts ${formatDistanceToNow(start, { addSuffix: true })}`,
				color: "text-blue-400",
			};
		} else if (contest.status === "ongoing") {
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
				<section className="py-8 px-4 border-b border-border/50">
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
											{contest.status === "ongoing" && (
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
										{contest.ctftime_id && (
											<Badge variant="outline" className="font-mono">
												<Flag className="h-3 w-3 mr-1" />
												CTFtime
											</Badge>
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
								{(contest.rules || contest.prizes) && (
									<div className="space-y-4">
										{contest.rules && (
											<div>
												<h3 className="font-bold font-mono text-primary mb-2">
													&gt; RULES
												</h3>
												<p className="text-muted-foreground">{contest.rules}</p>
											</div>
										)}

										{contest.prizes && (
											<div>
												<h3 className="font-bold font-mono text-primary mb-2">
													&gt; PRIZES
												</h3>
												<p className="text-muted-foreground">
													{contest.prizes}
												</p>
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
												{formatContestDate(contest.start)}
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
													getWeightColor(contest.assignedWeightPoints || contest.assigned_weight_points)
												)}
											>
												{contest.assignedWeightPoints || contest.assigned_weight_points} pts
											</div>
										</div>

										{contest.averageRating &&
											contest.totalRatings &&
											contest.totalRatings > 0 && (
												<div>
													<div className="flex items-center gap-2 text-muted-foreground mb-1">
														<Star className="h-4 w-4" />
														<span className="text-sm">Quality Rating</span>
													</div>
													{renderStars(contest.averageRating)}
													<div className="text-xs text-muted-foreground mt-1">
														Based on {contest.totalRatings} ratings
													</div>
												</div>
											)}

										{contest.url && (
											<div className="pt-2">
												<a
													href={contest.url}
													target="_blank"
													rel="noopener noreferrer"
													className="btn-terminal w-full justify-center"
												>
													<ExternalLink className="h-4 w-4 mr-2" />
													VISIT_CONTEST
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
					<section className="py-12 px-4">
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
									<div className="overflow-x-auto">
										<table className="w-full">
											<thead className="bg-muted/50">
												<tr className="border-b border-border">
													<th className="p-4 text-left font-mono text-sm font-bold">
														Rank
													</th>
													<th className="p-4 text-left font-mono text-sm font-bold">
														Team Name
													</th>
													<th className="p-4 text-right font-mono text-sm font-bold">
														Contest Points
													</th>
													<th className="p-4 text-right font-mono text-sm font-bold">
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
					<section className="py-12 px-4">
						<div className="max-w-7xl mx-auto text-center">
							<div className="terminal glass-terminal p-8 max-w-lg mx-auto">
								<div className="text-primary mb-2">
									root@openctf:~# cat leaderboard.txt
								</div>
								<p className="text-yellow-400">
									{contest.status === "upcoming" &&
										"// Leaderboard will be available when contest starts"}
									{contest.status === "ongoing" &&
										"// Live leaderboard coming soon"}
									{contest.status === "cancelled" &&
										"// Contest was cancelled - no leaderboard available"}
								</p>
							</div>
						</div>
					</section>
				)}
			</div>
		</MainLayout>
	);
}
