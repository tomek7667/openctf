"use client";

import React from "react";
import { motion } from "framer-motion";
import { Target, Clock } from "@/components/ui/icons";
import { Contest } from "@/api/contests";
import Link from "next/link";

interface LiveCTFWidgetProps {
	contests: Contest[];
}

export function LiveCTFWidget({ contests }: LiveCTFWidgetProps) {
	const ongoingContests = contests.filter((c) => c.status === "live");
	const upcomingContests = contests
		.filter((c) => c.status === "upcoming")
		.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

	// Group upcoming by date, max 3 different days, but if 5+ on same day show all
	const groupedUpcoming = upcomingContests.reduce(
		(acc, contest) => {
			const date = new Date(contest.start).toDateString();
			if (!acc[date]) acc[date] = [];
			acc[date].push(contest);
			return acc;
		},
		{} as Record<string, Contest[]>
	);

	const upcomingToShow = Object.entries(groupedUpcoming)
		.slice(0, 3)
		.flatMap(([, contests]) =>
			contests.length >= 5 ? contests : contests.slice(0, 3)
		);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="max-w-4xl mx-auto"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Live Contests */}
				<div className="glass-terminal p-6 rounded-none hacker-border">
					<div className="flex items-center gap-3 mb-4">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
							<Target className="h-5 w-5 text-red-400" />
							<span className="text-red-400 font-mono font-bold">
								LIVE CONTESTS
							</span>
						</div>
						<span className="text-muted-foreground font-mono text-sm">
							({ongoingContests.length})
						</span>
					</div>
					{ongoingContests.length > 0 ? (
						<div className="space-y-3">
							{ongoingContests.slice(0, 3).map((contest) => (
								<Link key={contest.id} href={`/contests/${contest.id}`}>
									<div className="p-4 bg-red-500/10 border border-red-500/30 rounded-none cursor-pointer hover:bg-red-500/20 transition-colors">
										<div className="text-sm font-mono text-red-400 font-bold truncate">
											{contest.name.replace(/-/g, " ").toUpperCase()}
										</div>
										<div className="text-xs text-muted-foreground font-mono mt-1">
											Ends: {new Date(contest.end).toLocaleDateString()}{" "}
											{new Date(contest.end).toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}{" "}
											| W: {contest.weight || 0}
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="text-muted-foreground font-mono text-sm">
								No live contests at the moment
							</div>
						</div>
					)}
				</div>

				{/* Upcoming Contests */}
				<div className="glass-terminal p-6 rounded-none hacker-border">
					<div className="flex items-center gap-3 mb-4">
						<Clock className="h-5 w-5 text-blue-400" />
						<span className="text-blue-400 font-mono font-bold">
							UPCOMING CONTESTS
						</span>
						<span className="text-muted-foreground font-mono text-sm">
							({upcomingToShow.length})
						</span>
					</div>
					{upcomingToShow.length > 0 ? (
						<div className="space-y-3">
							{upcomingToShow.map((contest) => {
								return (
									<Link key={contest.id} href={`/contests/${contest.id}`}>
										<div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-none cursor-pointer hover:bg-blue-500/20 transition-colors">
											<div className="text-sm font-mono text-blue-400 font-bold truncate">
												{contest.name.replace(/-/g, " ").toUpperCase()}
											</div>
											<div className="text-xs text-muted-foreground font-mono mt-1">
												Starts: {new Date(contest.start).toLocaleDateString()}{" "}
												{new Date(contest.start).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
												})}{" "}
												| {contest.duration}h | W: {contest.weight || 0}
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="text-muted-foreground font-mono text-sm">
								No upcoming contests scheduled
							</div>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
