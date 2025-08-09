"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import {
	Users,
	Trophy,
	Flag,
	ExternalLink,
	Shield,
	Star,
	Calendar,
	Target,
} from "@/components/ui/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Team } from "@/api/teams";
import { clsx } from "clsx";

interface TeamWithRanking extends Team {
	ranking: number;
	ratingPoints: number;
	contestsCount: number;
	avgPlace: number;
	lastActive: string;
	verified_at?: string;
}

interface TeamCardProps {
	team: TeamWithRanking;
	index?: number;
}

const getRankingColor = (ranking: number) => {
	if (ranking === 1) return "text-yellow-400";
	if (ranking <= 3) return "text-gray-300";
	if (ranking <= 10) return "text-orange-400";
	return "text-muted-foreground";
};

const getRankingBadgeColor = (ranking: number) => {
	if (ranking === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-400/50";
	if (ranking <= 3) return "bg-gray-500/20 text-gray-300 border-gray-300/50";
	if (ranking <= 10) return "bg-orange-500/20 text-orange-400 border-orange-400/50";
	return "bg-primary/20 text-primary border-primary/50";
};

const getCountryEmoji = (countryCode: string) => {
	const countryFlags: Record<string, string> = {
		CN: "🇨🇳",
		DK: "🇩🇰",
		DE: "🇩🇪",
		US: "🇺🇸",
		PL: "🇵🇱",
		TW: "🇹🇼",
		JP: "🇯🇵",
		FR: "🇫🇷",
		KR: "🇰🇷",
		CA: "🇨🇦",
	};
	return countryFlags[countryCode] || "🌍";
};

const formatLastActive = (dateString: string) => {
	const date = parseISO(dateString);
	return formatDistanceToNow(date, { addSuffix: true });
};

export function TeamCard({ team, index = 0 }: TeamCardProps) {
	const lastActiveText = formatLastActive(team.lastActive);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{ y: -4, scale: 1.02 }}
			className="group"
		>
			<Card
				className={clsx(
					"h-full transition-all duration-300 hacker-border rounded-none",
					"bg-card/50 backdrop-blur-sm",
					"hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20",
					team.ranking <= 3 && "border-yellow-400/30 shadow-lg shadow-yellow-400/10"
				)}
			>
				<CardHeader className="pb-3">
					<div className="flex items-start justify-between gap-3">
						<div className="flex items-start gap-3 flex-1 min-w-0">
							<div className="flex items-center gap-2">
								<span className="text-2xl">{getCountryEmoji(team.country_code)}</span>
								<div
									className={clsx(
										"px-2 py-1 rounded border text-xs font-mono font-bold flex items-center gap-1 shrink-0",
										getRankingBadgeColor(team.ranking)
									)}
								>
									<Trophy className="h-3 w-3" />
									#{team.ranking}
								</div>
							</div>
							
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-lg text-foreground font-mono group-hover:text-primary transition-colors duration-300 truncate">
									{team.name.toUpperCase()}
								</h3>
								<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
									{team.description}
								</p>
							</div>
						</div>

						{team.verified_at && (
							<div className="flex items-center gap-1 text-green-400 shrink-0">
								<Shield className="h-4 w-4" />
								<span className="text-xs font-mono">VERIFIED</span>
							</div>
						)}
					</div>
				</CardHeader>

				<CardContent className="pt-0 space-y-4">
					{/* Rating Points */}
					<div className="p-3 bg-primary/5 border border-primary/20 rounded">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Star className="h-4 w-4 text-primary" />
								<span className="text-sm text-muted-foreground">Rating Points</span>
							</div>
							<div className={clsx("font-mono font-bold text-lg", getRankingColor(team.ranking))}>
								{team.ratingPoints.toLocaleString()}
							</div>
						</div>
					</div>

					{/* Team Stats */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Target className="h-4 w-4" />
								<span>Contests</span>
							</div>
							<div className="font-mono text-foreground font-bold">
								{team.contestsCount}
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2 text-muted-foreground">
								<Trophy className="h-4 w-4" />
								<span>Avg Place</span>
							</div>
							<div className="font-mono text-foreground font-bold">
								{team.avgPlace.toFixed(1)}
							</div>
						</div>
					</div>

					{/* Member Count and Last Active */}
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">Members</span>
							</div>
							<div className="font-mono font-bold text-foreground">
								{team.memberCount}
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">Last Active</span>
							</div>
							<div className="text-xs text-muted-foreground font-mono">
								{lastActiveText}
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex items-center justify-between pt-2 border-t border-border/50">
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Flag className="h-4 w-4" />
								<span className="text-xs uppercase font-mono">{team.country_code}</span>
							</div>
							{team.ctftime_id && (
								<div className="flex items-center gap-1">
									<ExternalLink className="h-4 w-4" />
									<span className="text-xs">CTFtime</span>
								</div>
							)}
						</div>

						<div className="flex items-center gap-1">
							{team.ctftime_id && (
								<Link
									href={`https://ctftime.org/team/${team.ctftime_id}`}
									target="_blank"
									rel="noopener noreferrer"
									className="p-1.5 rounded transition-colors hover:bg-primary/10 text-muted-foreground hover:text-primary"
								>
									<ExternalLink className="h-4 w-4" />
								</Link>
							)}

							<Link
								href={`/teams/${team.id}`}
								className="btn-terminal px-2 py-1 text-xs font-mono font-bold whitespace-nowrap"
							>
								PROFILE
							</Link>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
