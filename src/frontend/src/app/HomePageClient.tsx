"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
	Shield,
	Users,
	Trophy,
	ArrowRight,
	TrendingUp,
	Globe,
	Target,
	BarChart,
} from "@/components/ui/icons";
import { TeamLeaderboard } from "@/components/leaderboard/TeamLeaderboard";
import { PlatformStats } from "@/api/statistics";

interface FeatureCardProps {
	icon: React.ComponentType<{ className?: undefined | string }>;
	title: string;
	description: string;
	href: string;
	gradient: string;
}

const FeatureCard = ({
	icon: Icon,
	title,
	description,
	href,
	gradient,
}: FeatureCardProps) => (
	<motion.div
		whileHover={{ scale: 1.02 }}
		whileTap={{ scale: 0.98 }}
		className="group relative h-full"
	>
		<Link href={href}>
			<div className="relative p-8 h-full bg-card hacker-border rounded-none card-hover transition-all duration-300 group-hover:border-primary min-h-[280px] flex flex-col">
				<div
					className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${gradient}`}
				/>

				<div className="relative z-10">
					<div className="mb-4">
						<div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors duration-300">
							<Icon className="h-6 w-6 text-primary" />
						</div>
					</div>

					<h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 font-mono">
						&gt; {title.toUpperCase().replace(" ", "_")}
					</h3>

					<p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
						{description}
					</p>

					<div className="flex items-center text-primary font-bold group-hover:translate-x-1 transition-transform duration-300 font-mono mt-auto">
						<span>[EXPLORE]</span>
						<ArrowRight className="ml-2 h-4 w-4" />
					</div>
				</div>
			</div>
		</Link>
	</motion.div>
);

const StatCard = ({
	value,
	label,
	trend,
	icon: Icon,
	isLoading = false,
}: {
	value: string;
	label: string;
	trend?: undefined | string;
	icon: React.ComponentType<{ className?: undefined | string }>;
	isLoading?: undefined | boolean;
}) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-none hacker-border mt-2"
	>
		<div className="flex justify-center mb-3">
			<div className="p-3 bg-primary/10 rounded-full">
				<Icon className="h-6 w-6 text-primary" />
			</div>
		</div>
		{isLoading ? (
			<div className="text-3xl font-bold text-primary mb-1 font-mono glow-text animate-pulse">
				---
			</div>
		) : (
			<div className="text-3xl font-bold text-primary mb-1 font-mono glow-text">
				{value}
			</div>
		)}
		<div className="text-sm text-muted-foreground mb-2 font-mono uppercase">
			{label}
		</div>
		{trend && !isLoading && (
			<div className="flex items-center justify-center text-xs text-green-600">
				<TrendingUp className="h-3 w-3 mr-1" />
				{trend}
			</div>
		)}
	</motion.div>
);

export default function HomePageClient({ stats }: { stats: PlatformStats }) {
	const features = [
		{
			icon: Trophy,
			title: "Team Rankings",
			description:
				"Global CTF team rankings based on contest performance. View team statistics, member rosters, and rating history.",
			href: "/teams",
			gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
		},
		{
			icon: BarChart,
			title: "Contest Results",
			description:
				"Complete contest archives with scoreboards, writeups, and team placements from past CTF events.",
			href: "/contests",
			gradient: "bg-gradient-to-br from-green-500 to-green-600",
		},
		{
			icon: Target,
			title: "Upcoming Events",
			description:
				"Schedule of upcoming CTF competitions with registration links, formats, and event details.",
			href: "/contests",
			gradient: "bg-gradient-to-br from-yellow-500 to-yellow-600",
		},
		{
			icon: Shield,
			title: "Weight Pool",
			description:
				"Monthly weight point distribution system for CTF contests. Track difficulty ratings and allocation history.",
			href: "/weight-pool",
			gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
		},
	];

	return (
		<div className="relative min-h-screen">
			{/* Hero Section */}
			<section className="relative py-24 px-4 overflow-hidden">
				{/* Hacker Background Effects */}
				<div className="absolute inset-0 matrix-bg opacity-30" />
				<div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />

				<div className="relative max-w-7xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 font-mono">
							<span className="terminal-prompt">$ </span>
							<span className="hacker-gradient-text sharp-text">OpenCTF</span>
							<br />
							<span className="text-foreground">&gt; Rankings</span>
							<span className="animate-pulse text-primary">_</span>
						</h1>

						<div className="terminal glass-terminal p-6 mb-12 max-w-4xl mx-auto text-left">
							<div className="text-primary mb-2">
								root@openctf:~# cat info.txt
							</div>
							<p className="text-green-400 leading-relaxed">
								{"// CTF team rankings and contest tracking platform"}
								<br />
								{"// Real-time contest results and team statistics"}
								<br />
								<span className="text-yellow-400">
									{`// Last updated: $(date) | Live contests: ${stats.total_live_events}`}
								</span>
							</p>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/teams"
									className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
								>
									&gt; TEAM_RANKINGS
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/contests"
									className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
								>
									&gt; UPCOMING_CONTESTS
								</Link>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 px-4 bg-muted/30 matrix-bg">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
							&gt; PLATFORM_STATISTICS
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Current rankings and contest data from the CTF community.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<StatCard
							icon={Shield}
							value={stats.total_teams.toString()}
							label="Ranked Teams"
							trend="Updated daily"
						/>
						<StatCard
							icon={Users}
							value={
								stats.total_users > 99
									? `${(stats.total_users / 1000).toFixed(1)}K`
									: stats.total_users.toFixed(2)
							}
							label="Team Members"
							trend="Active players"
						/>
						<StatCard
							icon={Trophy}
							value={stats.total_upcoming_events.toString()}
							label="Upcoming Contests"
							trend="This month"
						/>
						<StatCard
							icon={Globe}
							value={stats.total_past_events.toString()}
							label="Past Events"
							trend="Last 30 days"
						/>
					</div>
				</div>
			</section>

			{/* Team Leaderboard */}
			<TeamLeaderboard />

			{/* Features Section */}
			<section className="py-24 px-4">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
							&gt; CTF_RANKINGS_AND_CONTEST_DATA
						</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">
							Track team rankings, contest schedules, and results from Capture
							The Flag competitions worldwide. Real-time updates and historical
							data.
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 pb-12">
						{features.map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1 }}
							>
								<FeatureCard {...feature} />
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-green-400/10 to-primary/10 matrix-bg">
				<div className="max-w-4xl mx-auto text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 font-mono">
							&gt; EXPLORE_CTF_DATA
						</h2>
						<p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
							Browse team rankings, contest schedules, and results from the
							global Capture The Flag community. Data updated in real-time.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/teams"
									className="btn-gradient inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
								>
									<Shield className="mr-2 h-5 w-5" />
									[VIEW_RANKINGS]
								</Link>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link
									href="/contests"
									className="btn-terminal inline-flex items-center px-8 py-4 rounded-none font-bold text-lg transition-all duration-300"
								>
									<Trophy className="mr-2 h-5 w-5" />
									[CHECK_CONTESTS]
								</Link>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
