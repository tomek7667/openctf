"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
import { TwitterShareButton } from "@/components/ui/TwitterShareButton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { ContestStatus, getContest, ParsedContest } from "@/api/contests";
import { useAuth } from "@/hooks/useAuth";
import { clsx } from "clsx";
import { Place } from "@/types/api";
import useToast from "@/hooks/useToast";
import { HackerMarkdown } from "@/components/ui/HackerMarkdown";
import Link from "next/link";

const getStatusColor = (status: string) => {
	switch (status) {
		case "upcoming":
			return "bg-blue-500/20 text-blue-400 border-blue-400/50";
		case "ongoing":
		case "live":
			return "bg-green-500/20 text-green-400 border-green-400/50";
		case "finished":
			return "bg-primary/20 text-primary border-primary/50";
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

function PlaceRow({
	place,
	index,
	contestName,
	userTeam,
	isCaptain,
}: {
	place: Place;
	index: number;
	contestName: string;
	userTeam?: string | undefined;
	isCaptain?: boolean;
}) {
	const getRowStyle = (rank: number) => {
		if (rank === 1)
			return "bg-gradient-to-r from-yellow-500/30 to-orange-500/20 border-yellow-400 shadow-lg shadow-yellow-400/20";
		if (rank === 2)
			return "bg-gradient-to-r from-gray-300/30 to-gray-500/20 border-gray-400 shadow-lg shadow-gray-400/20";
		if (rank === 3)
			return "bg-gradient-to-r from-amber-600/30 to-yellow-700/20 border-amber-600 shadow-lg shadow-amber-600/20";
		return "hover:bg-muted/20 border-border/50";
	};

	const getRankDisplay = (rank: number) => {
		if (rank === 1) {
			return <Trophy className="h-8 w-8 text-yellow-400" />;
		}
		if (rank === 2) {
			return (
				<div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold text-lg glow-text">
					2
				</div>
			);
		}
		if (rank === 3) {
			return (
				<div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-black font-bold text-lg glow-text">
					3
				</div>
			);
		}
		return (
			<div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-m">
				{rank}
			</div>
		);
	};

	const getTeamNameColor = (rank: number) => {
		if (rank === 1) return "text-yellow-400 glow-text";
		if (rank === 2) return "text-gray-300";
		if (rank === 3) return "text-amber-600";
		return "text-foreground";
	};

	const getTitle = (rank: number) => {
		if (rank === 1) return "[CHAMPION]";
		if (rank === 2) return "[RUNNER-UP]";
		if (rank === 3) return "[THIRD]";
		return "";
	};

	const getTitleColor = (rank: number) => {
		if (rank === 1) return "text-xs animate-pulse";
		if (rank === 2) return "text-xs";
		if (rank === 3) return "text-xs";
		return "";
	};

	return (
		<motion.tr
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.1 }}
			className={`border-b transition-all duration-300 hover:bg-primary/5 ${getRowStyle(place.place)}`}
		>
			{place.edges?.associated_team?.id !== undefined ? (
				<Link
					href={`/teams/${place.edges.associated_team.id}`}
					className="contents text-inherit no-underline focus:outline-none"
				>
					<td className="p-3 w-16 align-middle">
						<span className="flex items-center justify-center">
							{getRankDisplay(place.place)}
						</span>
					</td>
					<td className="p-3 align-middle">
						<div>
							<span
								className={`font-mono font-bold text-sm ${getTeamNameColor(place.place)}`}
							>
								{place.edges.associated_team.name}
								{getTitle(place.place) && (
									<span className={`ml-2 ${getTitleColor(place.place)}`}>
										{getTitle(place.place)}
									</span>
								)}
							</span>
							{place.team_name !== place.edges.associated_team.name && (
								<>
									<span className="text-gray-400 text-sm"> as </span>
									<span className="text-gray-200 text-sm">
										{place.team_name}
									</span>
								</>
							)}
							{place.ctftime_team_id && (
								<div className="text-xs text-muted-foreground font-mono">
									CTFtime: {place.ctftime_team_id}
								</div>
							)}
						</div>
					</td>
					<td className="p-3 font-mono text-lg font-bold text-right align-middle">
						<div className="block">{place.contest_points}</div>
					</td>
					<td className="p-3 font-mono text-lg text-right align-middle">
						<div className="flex items-center justify-end gap-2">
							<span className={getWeightColor(place.assigned_weight_points)}>
								{place.assigned_weight_points}
							</span>
							{userTeam === place.team_name && (
								<TwitterShareButton
									contestName={contestName}
									teamName={place.team_name}
									place={place.place}
									isCaptain={isCaptain || false}
								/>
							)}
						</div>
					</td>
				</Link>
			) : (
				<>
					<td className="p-3 w-16 align-middle">
						<span className="flex items-center justify-center">
							{getRankDisplay(place.place)}
						</span>
					</td>
					<td className="p-3 align-middle">
						<div className="block">
							<div>
								<span
									className={`font-mono font-bold text-sm ${getTeamNameColor(place.place)}`}
								>
									{place.team_name}
									{getTitle(place.place) && (
										<span className={`ml-2 ${getTitleColor(place.place)}`}>
											{getTitle(place.place)}
										</span>
									)}
								</span>
								{place.ctftime_team_id && (
									<div className="text-xs text-muted-foreground font-mono">
										CTFtime: {place.ctftime_team_id}
									</div>
								)}
							</div>
						</div>
					</td>
					<td className="p-3 font-mono text-lg font-bold text-right align-middle">
						<div className="block">{place.contest_points}</div>
					</td>
					<td className="p-3 font-mono text-lg text-right align-middle">
						<div className="flex items-center justify-end gap-2">
							<span className={getWeightColor(place.assigned_weight_points)}>
								{place.assigned_weight_points}
							</span>
							{userTeam === place.team_name && (
								<TwitterShareButton
									contestName={contestName}
									teamName={place.team_name}
									place={place.place}
									isCaptain={isCaptain || false}
								/>
							)}
						</div>
					</td>
				</>
			)}
		</motion.tr>
	);
}

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
							<Link href={`/writeups/${writeup.id}`}>{writeup.title}</Link>
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
							<span className="font-mono">
								{writeup.averageRating.toFixed(1)}
							</span>
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
	const { isAuthenticated, user } = useAuth();
	const { toast } = useToast();

	const [contest, setContest] = useState<ParsedContest | null>(null);
	const [writeups, setWriteups] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [userTeam, _setUserTeam] = useState<string | undefined>();
	const [isCaptain, _setIsCaptain] = useState(false);

	useEffect(() => {
		const fetchContestDetails = async () => {
			try {
				setIsLoading(true);
				const contest = await getContest(Number(contestId));
				setContest(contest);

				if (contest.status === ContestStatus.Finished) {
					// TODO: Get writeups for this contest
					// const writeupsData = getMockWriteups(contestId);
					// setWriteups(writeupsData);
					setWriteups([]);
				}

				// Get user's team information if authenticated
				if (isAuthenticated && user) {
					// TODO: implement user teams in BE
					// const userTeamsResponse = await getUserTeams(user.id.toString());
					// if (
					// 	userTeamsResponse.success &&
					// 	userTeamsResponse.data &&
					// 	userTeamsResponse.data.length > 0
					// ) {
					// 	const team = userTeamsResponse.data[0]; // Assume user's primary team
					// 	if (team) {
					// 		setUserTeam(team.name);
					// 		setIsCaptain(team.captainId === user.id.toString());
					// 	}
					// }
				}
			} catch (error: any) {
				console.error("Error fetching contest details:", error);
				toast.error(
					"error fetching contest details",
					error?.message ??
						"unknown error occurred. Please contact the administrator"
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (contestId) {
			fetchContestDetails();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contestId, isAuthenticated, user]);

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
						<Link
							href="/contests"
							className="inline-block px-4 py-2 bg-green-500/20 border border-green-400/50 text-green-400 font-mono font-bold hover:bg-green-500/30 transition-colors"
						>
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
		const start = parseISO(contest.start);
		const end = parseISO(contest.end);

		if (contest.status === ContestStatus.Upcoming) {
			return {
				label: `Starts ${formatDistanceToNow(start, { addSuffix: true })}`,
				color: "text-blue-400",
			};
		} else if (contest.status === ContestStatus.Ongoing) {
			return {
				label: `Ends ${formatDistanceToNow(end, { addSuffix: true })}`,
				color: "text-green-400",
			};
		} else if (contest.status === ContestStatus.Finished) {
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
											{contest.status === ContestStatus.Ongoing && (
												<Target className="h-4 w-4" />
											)}
											{contest.status === ContestStatus.Upcoming && (
												<Calendar className="h-4 w-4" />
											)}
											{contest.status === ContestStatus.Finished && (
												<Trophy className="h-4 w-4" />
											)}
											{(contest.status === ContestStatus.Ongoing
												? "live"
												: contest.status || "unknown"
											).toUpperCase()}
										</div>
										{contest.ctftime_id && (
											<Link
												href={`https://ctftime.org/event/${contest.ctftime_id}`}
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
											</Link>
										)}
									</div>

									{contest.description && (
										<p className="text-muted-foreground leading-relaxed mb-6">
											<HackerMarkdown content={contest.description} />
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
												<HackerMarkdown
													className="space-y-2"
													content={contest.rules}
												/>
											</div>
										)}

										{contest.prizes && (
											<div>
												<h3 className="font-bold font-mono text-primary mb-2">
													&gt; PRIZES
												</h3>
												<HackerMarkdown
													className="space-y-2"
													content={contest.prizes}
												/>
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

										{contest.edges?.places && (
											<div>
												<div className="flex items-center gap-2 text-muted-foreground mb-1">
													<Users className="h-4 w-4" />
													<span className="text-sm">Participants</span>
												</div>
												<div className="font-mono text-sm">
													{contest.edges.places.length} teams
												</div>
											</div>
										)}

										<div>
											<div className="flex items-center gap-2 text-muted-foreground mb-1">
												<Shield className="h-4 w-4" />
												<span className="text-sm">Weight Points</span>
											</div>
											<div
												className={clsx(
													"font-mono font-bold",
													getWeightColor(contest.assigned_weight_points || 0)
												)}
											>
												{contest.assigned_weight_points || 0} pts
											</div>
										</div>

										{contest.url && (
											<div className="pt-4 flex gap-2">
												<Link
													href={`/contests/${contest.id}/rating`}
													rel="noopener noreferrer"
													className="w-full bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded font-mono font-bold text-sm transition-colors flex items-center justify-center gap-2"
												>
													<ExternalLink className="h-4 w-4" />
													RATING
												</Link>
												<Link
													href={contest.url}
													target="_blank"
													rel="noopener noreferrer"
													className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded font-mono font-bold text-sm transition-colors flex items-center justify-center gap-2"
												>
													<ExternalLink className="h-4 w-4" />
													VISIT CONTEST
												</Link>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Leaderboard Section */}
				{contest.status === "finished" &&
					contest.edges?.places &&
					contest.edges.places.length > 0 && (
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
												<thead className="bg-muted/30">
													<tr className="border-b border-border/50">
														<th className="p-3 text-center font-mono text-xs font-bold w-16">
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
													{contest.edges.places.map((place, index) => (
														<PlaceRow
															key={place.id}
															place={place}
															index={index}
															contestName={contest.name}
															userTeam={userTeam}
															isCaptain={isCaptain}
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
								<h3 className="text-xl font-mono text-gray-400 mb-2">
									No writeups yet
								</h3>
								<p className="text-gray-500 font-mono mb-4">
									Be the first to share your solution!
								</p>
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
