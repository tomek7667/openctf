"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
	ArrowLeft,
	Star,
	Users,
	BarChart,
	Target,
	AlertCircle,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import useToast from "@/hooks/useToast";
import {
	ParsedContest,
	rateContestOpinion,
	OpinionRating as OpinionRating,
	WeightRating,
} from "@/api/contests";

const getDifficultyColor = (diff: number) => {
	if (diff === 100) return "text-purple-400";
	if (diff >= 80) return "text-red-400";
	if (diff >= 60) return "text-orange-400";
	if (diff >= 40) return "text-yellow-400";
	if (diff >= 20) return "text-blue-400";
	return "text-green-400";
};

function getDifficultyLabel(diff: number) {
	if (diff === 100) return "HARDEST";
	if (diff >= 80) return "INSANE";
	if (diff >= 60) return "HARD";
	if (diff >= 40) return "MEDIUM";
	if (diff >= 20) return "EASY";
	return "TRIVIAL / GUESSY";
}

// Star Rating Component
function StarRating({
	rating,
	onRate,
	relevant = true,
	size = "md",
	readonly = false,
}: {
	rating: number;
	onRate?: (rating: number) => void;
	relevant?: boolean;
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
							? `text-yellow-400 fill-current ${!relevant ? "opacity-30" : ""}`
							: "text-gray-600"
					} ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110 hover:text-yellow-400"}`}
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
	const [localValue, setLocalValue] = useState(difficulty);

	useEffect(() => {
		setLocalValue(difficulty);
	}, [difficulty]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (readonly) return;
		const newValue = parseInt(e.target.value);
		setLocalValue(newValue);
		onRate?.(newValue);
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<span className="font-mono text-sm text-muted-foreground">
					Difficulty: {localValue}/100
				</span>
				<Badge
					variant="outline"
					className={`font-mono ${getDifficultyColor(localValue)}`}
				>
					{getDifficultyLabel(localValue)}
				</Badge>
			</div>
			<div className="relative">
				<input
					type="range"
					min="0"
					max="100"
					value={localValue}
					onChange={handleChange}
					disabled={readonly}
					className={`w-full h-2 rounded-lg appearance-none ${
						readonly ? "cursor-default" : "cursor-pointer"
					} [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-300 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-gray-300 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none`}
					style={{
						background: `linear-gradient(to right, #22c55e 0%, #eab308 25%, #f97316 50%, #ef4444 75%, #dc2626 100%)`,
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
				{type === "quality"
					? "Quality Rating Distribution"
					: "Difficulty Rating Distribution"}
			</h4>
			<div className="space-y-2">
				{Object.entries(distribution).map(([key, count]) => {
					const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
					const label =
						type === "quality"
							? `${key} star${key === "1" ? "" : "s"}`
							: `${key === "20" ? "0-19" : key === "40" ? "20-39" : key === "60" ? "40-59" : key === "80" ? "60-79" : "80-100"}`;

					return (
						<div key={key} className="flex items-center space-x-3">
							<div className="w-16 flex items-center justify-center">
								{type === "quality" ? (
									<div className="flex space-x-0.5">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={`h-3 w-3 ${
													star <= parseInt(key)
														? "text-yellow-400 fill-current"
														: "text-gray-600"
												}`}
											/>
										))}
									</div>
								) : (
									<div className="text-xs font-mono text-muted-foreground">
										{label}
									</div>
								)}
							</div>
							<div className="flex-1 bg-gray-700 rounded-full h-2">
								<div
									className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
									style={{ width: `${percentage}%` }}
								/>
							</div>
							<div className="w-8 text-xs font-mono text-right">{count}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default function RatingPageClient({
	opinion_ratings,
	weight_ratings,
	contest,
}: {
	opinion_ratings: OpinionRating[];
	weight_ratings: WeightRating[];
	contest: ParsedContest;
}) {
	const params = useParams();
	const contestId = parseInt(params.id as string);
	const { isAuthenticated, user, token } = useAuth();
	const { toast } = useToast();
	const router = useRouter();
	const relevant_opinion_ratings = opinion_ratings.filter((or) => or.relevant);
	const avgMatteredOpinion = relevant_opinion_ratings.reduce(
		(avg, val, _, { length }) => {
			return avg + val.rating / length;
		},
		0
	);
	const avgDifficulty = weight_ratings.reduce((avg, val, _, { length }) => {
		return avg + val.difficulty / length;
	}, 0);
	const opinionDistribution: { [key: string]: number } = {};
	const difficultyDistribution: { [key: string]: number } = {};
	[1, 2, 3, 4, 5].forEach((val) => {
		opinionDistribution[String(val)] = 0;
		opinion_ratings.forEach((or) => {
			if (or.relevant && or.rating === val) {
				opinionDistribution[String(val)]! += 1;
			}
		});
	});
	[20, 40, 60, 80, 100].forEach((val) => {
		difficultyDistribution[String(val)] = 0;
		weight_ratings.forEach((wr) => {
			if (wr.difficulty >= val - 19 && wr.difficulty <= val) {
				difficultyDistribution[String(val)]! += 1;
			}
		});
	});

	// const [rateOpinionDto, setRateOpinionDto] =
	// 	useState<RateContestOpinionDto | null>(null);
	// const [ratetDifficultyDto, setRateContestDifficultyDto] =
	// 	useState<RateContestDifficultyDto | null>(null);

	// Form state
	const [newOpinionRating, setNewOpinionRating] = useState(0);
	const [newWeightRating, setNewWeightRating] = useState(0);
	const [opinionComment, setOpinionComment] = useState("");
	const [weightComment, setWeightComment] = useState("");
	const [submittingOpinion, setSubmittingOpinion] = useState(false);
	const [submittingWeight, setSubmittingWeight] = useState(false);

	const showRatingForms = true; // todo: make only viable users see the forms

	const handleOpinionRatingChange = (rating: number) => {
		setNewOpinionRating(rating);
	};

	const handleOpinionSubmit = async () => {
		if (!isAuthenticated || !user) {
			toast.error("Please log in to rate contests");
			return;
		}

		if (newOpinionRating === 0) {
			toast.error("Please select a rating");
			return;
		}

		try {
			setSubmittingOpinion(true);

			await rateContestOpinion(token!, contestId, {
				comment: opinionComment,
				rating: newOpinionRating,
			});
			toast.success("Quality rating submitted successfully!");
			router.refresh();
		} catch (error: any) {
			toast.error(
				"Failed to submit rating",
				error?.message ??
					"An unknown error occurred. If the issue persists please contact the administrators."
			);
		} finally {
			setSubmittingOpinion(false);
		}
	};

	const handleDifficultyRating = async () => {
		if (!isAuthenticated) {
			toast.error("Please log in to rate contest difficulty");
			return;
		}

		try {
			setSubmittingWeight(true);
			throw new Error("not implemented yet");

			// const response = await createWeightRating(
			// 	contestId,
			// 	newWeightRating,
			// 	userTeamId
			// );
			// if (response.success) {
			// 	toast.success("Difficulty rating submitted successfully!");

			// 	// Refresh data
			// 	const statsResponse = await getRatings(contestId);
			// 	if (statsResponse.success && statsResponse.data) {
			// 		setRatingStats(statsResponse.data);
			// 	}
			// } else {
			// 	toast.error(response.error || "Failed to submit difficulty rating");
			// }
		} catch (error) {
			console.error("Error submitting difficulty rating:", error);
			toast.error("Failed to submit difficulty rating");
		} finally {
			setSubmittingWeight(false);
		}
	};

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
								<span className="hacker-gradient-text">
									{contest.name} / RATINGS
								</span>
							</h1>
							<p className="text-muted-foreground font-mono mt-2">
								Assigned weight points: {contest.assigned_weight_points}
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
							<Card className="p-6 h-full flex flex-col">
								<div className="flex items-center gap-3 mb-6">
									<Star className="h-6 w-6 text-yellow-400" />
									<h2 className="text-2xl font-bold font-mono text-yellow-400">
										&gt; QUALITY_RATING
									</h2>
								</div>

								<div className="flex flex-col flex-1">
									<div className="space-y-6 flex-1">
										{/* Current Stats */}
										<div className="text-center space-y-2">
											<div className="text-4xl font-bold font-mono text-yellow-400">
												{avgMatteredOpinion.toFixed(1)}
											</div>
											<div className="flex justify-center">
												<StarRating
													rating={avgMatteredOpinion}
													size="lg"
													readonly
												/>
											</div>
											<div className="text-sm text-muted-foreground font-mono">
												({opinion_ratings.length} ratings)
											</div>
										</div>

										{/* Distribution */}
										<RatingDistribution
											distribution={opinionDistribution}
											type="quality"
										/>
									</div>

									{/* Rating Form - Sticks to bottom */}
									{showRatingForms && isAuthenticated && (
										<div
											className="pt-6 border-t border-border/50 mt-auto"
											style={{ marginTop: "20px" }}
										>
											<h4 className="font-mono text-sm font-bold text-primary mb-4">
												Rate Contest Quality:
											</h4>
											<div className="space-y-4">
												<div className="flex items-center justify-center">
													<StarRating
														rating={newOpinionRating}
														onRate={handleOpinionRatingChange}
														size="lg"
													/>
												</div>
												<textarea
													value={opinionComment}
													onChange={(e) => setOpinionComment(e.target.value)}
													placeholder="Optional comment about contest quality..."
													className="w-full p-3 bg-background border border-border rounded font-mono text-sm resize-none"
													rows={5}
													maxLength={500}
												/>
												<Button
													onClick={handleOpinionSubmit}
													disabled={submittingOpinion || newOpinionRating === 0}
													className="w-full font-mono"
												>
													{/* {submittingOpinion ? (
														<LoadingSpinner size="sm" />
													) : userRating ? (
														"Update Quality Rating"
													) : ( */}
													Submit Quality Rating
													{/* )} */}
												</Button>
												{/* {userRating && (
													<div className="text-xs text-green-400 font-mono text-center">
														✓ Previously rated: {userRating.rating}/5 stars
													</div>
												)} */}
											</div>
										</div>
									)}
								</div>
							</Card>
						</motion.div>

						{/* Difficulty Rating Section */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="p-6 h-full flex flex-col">
								<div className="flex items-center gap-3 mb-6">
									<Target className="h-6 w-6 text-red-400" />
									<h2 className="text-2xl font-bold font-mono text-red-400">
										&gt; DIFFICULTY_RATING
									</h2>
								</div>

								<div className="flex flex-col flex-1">
									<div className="space-y-6 flex-1">
										{/* Current Stats */}
										<div className="text-center space-y-2">
											<div className="text-4xl font-bold font-mono text-red-400">
												{avgDifficulty.toFixed(0)}
											</div>
											<div className="text-sm text-muted-foreground font-mono">
												out of 100 ({weight_ratings.length} ratings)
											</div>
											<div className="flex justify-center">
												<Badge variant="outline" className="font-mono">
													{getDifficultyLabel(avgDifficulty)}
												</Badge>
											</div>
										</div>

										{/* Distribution */}
										<RatingDistribution
											distribution={difficultyDistribution}
											type="difficulty"
										/>
									</div>

									{/* Rating Form - Sticks to bottom */}
									{showRatingForms && isAuthenticated && (
										<div
											className="pt-6 border-t border-border/50 mt-auto"
											style={{ marginTop: "20px" }}
										>
											<h4 className="font-mono text-sm font-bold text-primary mb-4">
												Rate Contest Difficulty:
											</h4>
											<div className="space-y-4">
												<DifficultyRating
													difficulty={newWeightRating}
													onRate={setNewWeightRating}
												/>
												<textarea
													value={weightComment}
													onChange={(e) => setWeightComment(e.target.value)}
													placeholder="Optional comment about contest difficulty..."
													className="w-full p-3 bg-background border border-border rounded font-mono text-sm resize-none"
													rows={3}
													maxLength={500}
												/>
												<Button
													onClick={handleDifficultyRating}
													disabled={submittingWeight}
													className="w-full font-mono"
												>
													{/* {submittingWeight ? (
														<LoadingSpinner size="sm" />
													) : teamRating ? (
														"Update Difficulty Rating"
													) : (
														"Submit Difficulty Rating"
														)} */}
													Submit Difficulty Rating
												</Button>
												{/* {teamRating && (
													<div className="text-xs text-green-400 font-mono text-center">
														✓ Previously rated: {teamRating.difficulty}/100
													</div>
												)} */}
											</div>
										</div>
									)}

									{showRatingForms && !isAuthenticated && (
										<div className="pt-6 border-t border-border/50 mt-auto">
											<div className="text-center text-muted-foreground font-mono">
												<AlertCircle className="h-5 w-5 mx-auto mb-2" />
												Log in to rate contest difficulty
											</div>
										</div>
									)}
								</div>
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
								<BarChart className="h-6 w-6 text-blue-400" />
								<h3 className="text-xl font-bold font-mono text-blue-400">
									&gt; RATING_INFO
								</h3>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-mono">
								<div className="space-y-2">
									<h4 className="text-primary font-bold">
										Quality Rating (0-5 stars):
									</h4>
									<ul className="space-y-1 text-muted-foreground">
										<li>• Overall contest experience</li>
										<li>• Challenge quality and variety</li>
										<li>• Infrastructure stability</li>
										<li>• Organization and communication</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="text-primary font-bold">
										Difficulty Rating (0-100):
									</h4>
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

					{/* User Ratings Lists */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="mt-8"
					>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							{/* Quality Ratings List */}
							<Card className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<Users className="h-6 w-6 text-yellow-400" />
									<h3 className="text-xl font-bold font-mono text-yellow-400">
										&gt; QUALITY_OPINIONS
									</h3>
								</div>
								<div className="space-y-4 max-h-96 overflow-y-auto">
									{opinion_ratings.length > 0 ? (
										opinion_ratings.map((rating) => {
											return (
												<div
													key={rating.id}
													className="border-b border-border/30 pb-3"
												>
													<div className="flex items-center justify-between mb-2">
														<div className="flex items-center gap-2">
															<Link
																href={`/users/${rating.edges.user.id}`}
																className="font-mono text-primary hover:text-primary/80 transition-colors"
															>
																{rating.edges.user.username}
															</Link>
														</div>
														<StarRating
															rating={rating.rating}
															readonly
															size="sm"
															relevant={rating.relevant}
														/>
													</div>
													{rating.comment && (
														<div className="flex items-center gap-2">
															<div className="text-muted-foreground text-xs">
																{rating.comment}
															</div>
														</div>
													)}
												</div>
											);
										})
									) : (
										<div className="text-center text-muted-foreground font-mono py-8">
											No quality ratings yet
										</div>
									)}
								</div>
							</Card>

							{/* Difficulty Ratings List */}
							<Card className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<Target className="h-6 w-6 text-red-400" />
									<h3 className="text-xl font-bold font-mono text-red-400">
										&gt; DIFFICULTY_RATINGS
									</h3>
								</div>
								<div className="space-y-4 max-h-96 overflow-y-auto">
									{weight_ratings.length > 0 ? (
										weight_ratings.map((rating) => {
											const team = rating.edges.captains_team;
											return (
												<div
													key={rating.id}
													className="border-b border-border/30 pb-3"
												>
													<div className="flex items-center justify-between mb-2">
														<div className="flex items-center gap-2">
															<Link
																href={`/users/${team.edges.captain.id}`}
																className="font-mono text-primary hover:text-primary/80 transition-colors"
															>
																{team.edges.captain.username || "Unknown"}
															</Link>
															<span className="text-muted-foreground">/</span>
															<Link
																href={`/teams/${rating.edges.captains_team.id}`}
																className="font-mono text-blue-400 hover:text-blue-300 transition-colors"
															>
																{rating.edges.captains_team.name}
															</Link>
														</div>
														<div className="flex items-center gap-2">
															<span className="font-mono text-lg font-bold">
																{rating.difficulty}
															</span>
															<Badge
																variant="outline"
																className="font-mono text-xs"
															>
																{getDifficultyLabel(rating.difficulty)}
															</Badge>
														</div>
													</div>
													{rating.comment && (
														<div className="flex items-center gap-2">
															<div className="text-muted-foreground text-xs">
																{rating.comment}
															</div>
														</div>
													)}
												</div>
											);
										})
									) : (
										<div className="text-center text-muted-foreground font-mono py-8">
											No difficulty ratings yet
										</div>
									)}
								</div>
							</Card>
						</div>
					</motion.div>
				</div>
			</div>
		</MainLayout>
	);
}
