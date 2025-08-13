"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
	Clock,
	Users,
	Trophy,
	Calendar,
	Flag,
	Target,
	Shield,
} from "@/components/ui/icons";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Contest } from "@/api/contests";
import { ContestStatus } from "@/types/api";
import { clsx } from "clsx";

interface ContestCardProps {
	contest: Contest;
	index?: undefined | number;
}

const getStatusColor = (status?: ContestStatus) => {
	switch (status) {
		case "upcoming":
			return "bg-blue-500/20 text-blue-400 border-blue-400/50";
		case "ongoing":
			return "bg-green-500/20 text-green-400 border-green-400/50 animate-pulse";
		case "finished":
			return "bg-gray-500/20 text-gray-400 border-gray-400/50";
		case "cancelled":
			return "bg-red-500/20 text-red-400 border-red-400/50";
		default:
			return "bg-primary/20 text-primary border-primary/50";
	}
};

const getStatusIcon = (status?: ContestStatus) => {
	switch (status) {
		case "upcoming":
			return <Calendar className="h-4 w-4" />;
		case "ongoing":
			return <Target className="h-4 w-4" />;
		case "finished":
			return <Trophy className="h-4 w-4" />;
		case "cancelled":
			return <Flag className="h-4 w-4" />;
		default:
			return <Clock className="h-4 w-4" />;
	}
};

const formatContestDate = (dateString: string) => {
	const date = parseISO(dateString);
	return format(date, "MMM dd, yyyy HH:mm");
};

const getTimeInfo = (start: string, end: string, status?: ContestStatus) => {
	const startDate = parseISO(start);
	const endDate = parseISO(end);

	if (status === "upcoming") {
		return `Starts ${formatDistanceToNow(startDate, { addSuffix: true })}`;
	} else if (status === "ongoing") {
		return `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`;
	} else if (status === "finished") {
		return `Ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;
	}
	return "";
};

const getDuration = (start: string, end: string) => {
	const startDate = parseISO(start);
	const endDate = parseISO(end);
	const duration = endDate.getTime() - startDate.getTime();
	const hours = Math.floor(duration / (1000 * 60 * 60));
	const days = Math.floor(hours / 24);

	if (days > 0) {
		return `${days}d ${hours % 24}h`;
	}
	return `${hours}h`;
};

const getWeightColor = (weight: number) => {
	if (weight >= 80) return "text-red-400";
	if (weight >= 50) return "text-yellow-400";
	if (weight >= 20) return "text-blue-400";
	return "text-green-400";
};

export function ContestCard({ contest, index = 0 }: ContestCardProps) {
	const timeInfo = getTimeInfo(
		contest.start,
		contest.end,
		contest.status as ContestStatus
	);
	const duration = getDuration(contest.start, contest.end);

	return (
		<Link href={`/contests/${contest.id}`}>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: index * 0.1 }}
				whileHover={{ y: -4, scale: 1.02 }}
				className="group block"
			>
				<Card
					className={clsx(
						"h-full transition-all duration-300 hacker-border rounded-none",
						"bg-card/50 backdrop-blur-sm",
						"hover:border-primary/60 hover:shadow-lg hover:shadow-primary/20",
						contest.status === "live" &&
							"border-green-400/60 shadow-lg shadow-green-400/20"
					)}
				>
					<CardHeader className="pb-3">
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h3 className="font-bold text-lg text-foreground font-mono group-hover:text-primary transition-colors duration-300 truncate">
									{contest.name.replace(/-/g, " ").toUpperCase()}
								</h3>
								<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
									{contest.description}
								</p>
							</div>

							<div
								className={clsx(
									"px-2 py-1 rounded border text-xs font-mono font-bold flex items-center gap-1 shrink-0",
									getStatusColor(contest.status as ContestStatus)
								)}
							>
								{getStatusIcon(contest.status as ContestStatus)}
								{(contest.status || "unknown").toUpperCase()}
							</div>
						</div>
					</CardHeader>

					<CardContent className="pt-0 space-y-4">
						{/* Contest Info */}
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div className="space-y-2">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>Start</span>
								</div>
								<div className="font-mono text-foreground text-xs">
									{formatContestDate(contest.start)}
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Clock className="h-4 w-4" />
									<span>Duration</span>
								</div>
								<div className="font-mono text-foreground">{duration}</div>
							</div>
						</div>

						{/* Time Status */}
						{timeInfo && (
							<div className="p-3 bg-primary/5 border border-primary/20 rounded font-mono text-sm">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-primary" />
									<span className="text-primary font-medium">{timeInfo}</span>
								</div>
							</div>
						)}

						{/* Weight */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Weight</span>
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
						</div>

						{/* Stats */}
						<div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t border-border/50">
							<div className="flex items-center gap-1">
								<Users className="h-4 w-4" />
								<span>{contest.participantCount || 0}</span>
							</div>
							{contest.ctftimeId && (
								<div className="flex items-center gap-1">
									<Flag className="h-4 w-4" />
									<span className="text-xs">CTFtime</span>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</motion.div>
		</Link>
	);
}
