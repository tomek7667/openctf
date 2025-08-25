"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
	ArrowLeft,
	Star,
	TrendingUp,
	Users,
	BarChart3,
	Target,
	Award,
	AlertCircle,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import { getContest, ParsedContest } from "@/api/contests";
import {
	getContestRatings,
	createContestRating,
	createWeightRating,
	getUserContestRating,
	getTeamWeightRating,
	ContestRatingStats,
} from "@/api/contestRatings";
import { ContestRating, WeightRating } from "@/lib/schema";

// Star Rating Component
function StarRating({
	rating,
	onRate,
	size = "md",
	readonly = false,
}: {
	rating: number;
	onRate?: (rating: number) => void;
	size?: "sm" | "md" | "lg";
	readonly?: boolean;
}) {
	const sizeClasses = {
		sm: "h-4 w-4",
		md: "h-5 w-5",
		lg: "h-6 w-6",
	};

	return (
		<div className="flex items-center space-x-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					onClick={() => !readonly && onRate?.(star)}
					disabled={readonly || !onRate}
					className={`${sizeClasses[size]} transition-all ${
						star <= rating
							? "text-yellow-400 fill-current"
							: "text-gray-600 hover:text-yellow-400"
					} ${readonly || !onRate ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
				>
					<Star className="w-full h-full" />
				</button>
			))}
		</div>
	);
}

// Difficulty Rating Component (0-100 slider)
function DifficultyRating({
	difficulty,
	onRate,
	readonly = false,
}: {
	difficulty: number;
	onRate?: (difficulty: number) => void;
	readonly?: boolean;
}) {
	const getDifficultyColor = (diff: number) => {
		if (diff >= 80) return "text-red-400";
		if (diff >= 60) return "text-orange-400";
		if (diff >= 40) return "text-yellow-400";
		if (diff >= 20) return "text-blue-400";
		return "text-green-400";
	};

	const getDifficultyLabel = (diff: number) => {
		if (diff >= 80) return "INSANE";
		if (diff >= 60) return "HARD";
		if (diff >= 40) return "MEDIUM";
		if (diff >= 20) return "EASY";
		return "TRIVIAL";
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="font-mono text-sm text-muted-foreground">
					Difficulty: {difficulty}/100
				</span>
				<Badge
					variant="outline"
					className={`font-mono ${getDifficultyColor(difficulty)}`}
				>
					{getDifficultyLabel(difficulty)}
				</Badge>
			</div>
			<div className="relative">
				<input
					type="range"
					min="0"
					max="100"
					value={difficulty}
					onChange={(e) => !readonly && onRate?.(parseInt(e.target.value))}
					disabled={readonly}
					className={`w-full h-2 bg-gray-700 rounded-lg appearance-none slider ${
						readonly ? "cursor-default" : "cursor-pointer"
					}`}
					style={{
						background: `linear-gradient(to right, #22c55e 0%, #eab308 25%, #f97316 50%, #ef4444 75%, #dc2626 100%)`,
					}}
				/>
				<div
					className="absolute top-0 w-4 h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1"
					style={{
						left: `calc(${(difficulty / 100) * 100}% - 8px)`,
					}}
				/>
			</div>
		</div>
	);
}

// Rating Distribution Chart
function RatingDistribution({
	distribution,
	type,
}: {
	distribution: { [key: number]: number };
	type: "quality" | "difficulty";
}) {
	const maxCount = Math.max(...Object.values(distribution));

	return (
		<div className="space-y-3">
			<h4 className="font-mono text-sm font-bold text-primary">
				{type === "quality" ? "Quality Rating Distribution" : "Difficulty Rating Distribution"}
			</h4>
			<div className="space-y-2">
				{Object.entries(distribution).map(([key, count]) => {
					const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
					const label = type === "quality" 
						? `${key} star${key === "1" ? "" : "s"}` 
						: `${key === "20" ? "0-19" : key === "40" ? "20-39" : key === "60" ? "40-59" : key === "80" ? "60-79" : "80-100"}`;

					return (
						<div key={key} className="flex items-center space-x-3">
							<div className="w-16 text-xs font-mono text-muted-foreground">
								{label}
							</div>
							<div className="flex-1 bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
									style={{ width: `${percentage}%` }}
								/>
							</div>
							<div className="w-8 text-xs font-mono text-right">
								{count}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default function ContestRatingPage() {
	const params = useParams();
	const contestId = parseInt(params.id as string);
	const { isAuthenticated, user } = useAuth();
	const { toast } = useToast();

	// State management
	const [contest, setContest] = useState<ParsedContest | null>(null);
	const [ratingStats, setRatingStats] = useState<ContestRatingStats | null>(null);
	const [userRating, setUserRating] = useState<ContestRating | null>(null);
	const [teamRating, setTeamRating] = useState<WeightRating | null>(null);
	const [loading, setLoading] = useState(true);
	
	// Form state
	const [newQualityRating, setNewQualityRating] = useState(0);
	const [newDifficultyRating, setNewDifficultyRating] = useState(50);
	const [submittingQuality, setSubmittingQuality] = useState(false);
	const [submittingDifficulty, setSubmittingDifficulty] = useState(false);

	// Hardcoded visibility flag (as requested)
	const showRatingForms = true;

	// Mock user team ID for difficulty rating (in real app, this would come from user data)
	const userTeamId = 1;

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Fetch contest details
				const contestData = await getContest(contestId);
				setContest(contestData);

				// Fetch rating statistics
				const statsResponse = await getContestRatings(contestId);
				if (statsResponse.success && statsResponse.data) {
					setRatingStats(statsResponse.data);
				}

				// Fetch user's existing ratings if authenticated
				if (isAuthenticated && user) {
					const userRatingResponse = await getUserContestRating(contestId, user.id);
					if (userRatingResponse.success && userRatingResponse.data) {
						setUserRating(userRatingResponse.data);
						setNewQualityRating(userRatingResponse.data.rating);
					}

					const teamRatingResponse = await getTeamWeightRating(contestId, userTeamId);
					if (teamRatingResponse.success && teamRatingResponse.data) {
						setTeamRating(teamRatingResponse.data);
						setNewDifficultyRating(teamRatingResponse.data.difficulty);
					}
				}
			} catch (error: any) {
				console.error("Error fetching rating data:", error);
				toast.error("Failed to load rating data");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [contestId, isAuthenticated, user, toast]);

	const handleQualityRating = async (rating: number) => {
		if (!isAuthenticated || !user) {
			toast.error("Please log in to rate contests");
			return;
		}

		try {
			setSubmittingQuality(true);
			setNewQualityRating(rating);

			const response = await createContestRating(contestId, rating, user.id);
			if (response.success) {
				toast.success("Quality rating submitted successfully!");
				
				// Refresh data
				const statsResponse = await getContestRatings(contestId);
				if (statsResponse.success && statsResponse.data) {
					setRatingStats(statsResponse.data);
				}
			} else {
				toast.error(response.error || "Failed to submit rating");
			}
		} catch (error) {
			console.error("Error submitting quality rating:", error);
			toast.error("Failed to submit rating");
		} finally {
			setSubmittingQuality(false);
		}
	};

	const handleDifficultyRating = async () => {
		if (!isAuthenticated) {
			toast.error("Please log in to rate contest difficulty");
			return;
		}

		try {
			setSubmittingDifficulty(true);

			const response = await createWeightRating(contestId, newDifficultyRating, userTeamId);
			if (response.success) {
				toast.success("Difficulty rating submitted successfully!");
				
				// Refresh data
				const statsResponse = await getContestRatings(contestId);
				if (statsResponse.success && statsResponse.data) {
					setRatingStats(statsResponse.data);
				}
			} else {
				toast.error(response.error || "Failed to submit difficulty rating");
			}
		} catch (error) {
			console.error("Error submitting difficulty rating:", error);
			toast.error("Failed to submit difficulty rating");
		} finally {
			setSubmittingDifficulty(false);
		}
	};

	if (loading) {
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

	return (
		<MainLayout>
			<div className="min-h-screen py-8 px-4">
				<div className="max-w-7xl mx-auto">
					{/* Header */}
					<div className="flex items-center gap-4 mb-8">
						<Link
							href={`/contests/${contestId}`}
							className="p-2 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
						>
							<ArrowLeft className="h-5 w-5" />
						</Link>
						<div>
							<h1 className="text-3xl md:text-4xl font-bold font-mono">
								<span className="terminal-prompt">$ </span>
								<span className="hacker-gradient-text">CONTEST_RATINGS</span>
							</h1>
							<p className="text-muted-foreground font-mono mt-2">
								{contest.name}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						{/* Quality Rating Section */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="p-6 h-full">
								<div className="flex items-center gap-3 mb-6">
									<Star className="h-6 w-6 text-yellow-400" />
									<h2 className="text-2xl font-bold font-mono text-yellow-400">
										&gt; QUALITY_RATING
									</h2>
								</div>

								{ratingStats && (
									<div className="space-y-6">
										{/* Current Stats */}
										<div className="text-center space-y-2">
											<div className="text-4xl font-bold font-mono text-yellow-400">
												{ratingStats.averageQualityRating.toFixed(1)}
											</div>
											<StarRating 
												rating={ratingStats.averageQualityRating} 
												size="lg" 
												readonly 
											/>
											<div className="text-sm text-muted-foreground font-mono">
												({ratingStats.totalQualityRatings} ratings)
											</div>
										</div>

										{/* Distribution */}
										<RatingDistribution
											distribution={ratingStats.qualityRatingDistribution}
											type="quality"
										/>

										{/* Rating Form */}
										{showRatingForms && isAuthenticated && (
											<div className="pt-6 border-t border-border/50">
												<h4 className="font-mono text-sm font-bold text-primary mb-4">
													Rate Contest Quality:
												</h4>
												<div className="space-y-4">
													<div className="flex items-center justify-center">
														<StarRating
															rating={newQualityRating}
															onRate={handleQualityRating}
															size="lg"
														/>
													</div>
													{newQualityRating > 0 && (
														<div className="text-center">
															<div className="text-sm font-mono text-muted-foreground">
																Your rating: {newQualityRating}/5 stars
															</div>
															{userRating && (
																<div className="text-xs text-green-400 font-mono mt-1">
																	✓ Updated
																</div>
															)}
														</div>
													)}
												</div>
											</div>
										)}

										{showRatingForms && !isAuthenticated && (
											<div className="pt-6 border-t border-border/50">
												<div className="text-center text-muted-foreground font-mono">
													<AlertCircle className="h-5 w-5 mx-auto mb-2" />
													Log in to rate this contest
												</div>
											</div>
										)}
									</div>
								)}
							</Card>
						</motion.div>

						{/* Difficulty Rating Section */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="p-6 h-full">
								<div className="flex items-center gap-3 mb-6">
									<Target className="h-6 w-6 text-red-400" />
									<h2 className="text-2xl font-bold font-mono text-red-400">
										&gt; DIFFICULTY_RATING
									</h2>
								</div>

								{ratingStats && (
									<div className="space-y-6">
										{/* Current Stats */}
										<div className="text-center space-y-2">
											<div className="text-4xl font-bold font-mono text-red-400">
												{ratingStats.averageDifficultyRating.toFixed(0)}
											</div>
											<div className="text-sm text-muted-foreground font-mono">
												out of 100 ({ratingStats.totalDifficultyRatings} ratings)
											</div>
											<div className="flex justify-center">
												<Badge variant="outline" className="font-mono">
													{ratingStats.averageDifficultyRating >= 80 ? "INSANE" :
													 ratingStats.averageDifficultyRating >= 60 ? "HARD" :
													 ratingStats.averageDifficultyRating >= 40 ? "MEDIUM" :
													 ratingStats.averageDifficultyRating >= 20 ? "EASY" : "TRIVIAL"}
												</Badge>
											</div>
										</div>

										{/* Distribution */}
										<RatingDistribution
											distribution={ratingStats.difficultyRatingDistribution}
											type="difficulty"
										/>

										{/* Rating Form */}
										{showRatingForms && isAuthenticated && (
											<div className="pt-6 border-t border-border/50">
												<h4 className="font-mono text-sm font-bold text-primary mb-4">
													Rate Contest Difficulty:
												</h4>
												<div className="space-y-4">
													<DifficultyRating
														difficulty={newDifficultyRating}
														onRate={setNewDifficultyRating}
													/>
													<Button
														onClick={handleDifficultyRating}
														disabled={submittingDifficulty}
														className="w-full font-mono"
													>
														{submittingDifficulty ? (
															<LoadingSpinner size="sm" />
														) : teamRating ? (
															"Update Difficulty Rating"
														) : (
															"Submit Difficulty Rating"
														)}
													</Button>
													{teamRating && (
														<div className="text-xs text-green-400 font-mono text-center">
															✓ Previously rated: {teamRating.difficulty}/100
														</div>
													)}
												</div>
											</div>
										)}

										{showRatingForms && !isAuthenticated && (
											<div className="pt-6 border-t border-border/50">
												<div className="text-center text-muted-foreground font-mono">
													<AlertCircle className="h-5 w-5 mx-auto mb-2" />
													Log in to rate contest difficulty
												</div>
											</div>
										)}
									</div>
								)}
							</Card>
						</motion.div>
					</div>

					{/* Additional Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="mt-8"
					>
						<Card className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<BarChart3 className="h-6 w-6 text-blue-400" />
								<h3 className="text-xl font-bold font-mono text-blue-400">
									&gt; RATING_INFO
								</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
								<div className="space-y-2">
									<h4 className="text-primary font-bold">Quality Rating (0-5 stars):</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>• Overall contest experience</li>
										<li>• Challenge quality and variety</li>
										<li>• Infrastructure stability</li>
										<li>• Organization and communication</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="text-primary font-bold">Difficulty Rating (0-100):</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>• Only team captains can rate</li>
										<li>• Based on challenge complexity</li>
										<li>• Affects weight point allocation</li>
										<li>• Used for contest ranking system</li>
									</ul>
								</div>
							</div>
						</Card>
					</motion.div>
				</div>
			</div>
		</MainLayout>
	);
}
