"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import {
	Trophy,
	Users,
	Shield,
	Star,
	Target,
	Calendar,
	Globe,
	User,
	ChevronLeft,
	ExternalLink,
	Mail,
	ChevronDown,
	ChevronUp,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { clsx } from "clsx";
import { Flag } from "@/components/ui/Flag";

interface UserContest {
	id: number;
	name: string;
	date: string;
	place: number;
	teamPlace: number;
	participants: number;
	points: number;
	year: number;
	teamName: string;
	teamId: number;
	difficulty: "Easy" | "Medium" | "Hard" | "Insane";
	category: "Web" | "Pwn" | "Crypto" | "Rev" | "Misc" | "Forensics";
}

interface Achievement {
	id: number;
	title: string;
	description: string;
	date: string;
	icon: string;
	rarity: "Common" | "Rare" | "Epic" | "Legendary";
}

interface Team {
	id: number;
	name: string;
}

interface UserDetails {
	id: number;
	username: string;
	email: string;
	description?: string;
	permission_level: "player" | "moderator" | "administrator";
	country_code: string;
	contestsParticipated: number;
	averagePlace: number;
	teams: Team[];
	lastActive: string;
	created_at: string;
	verified: boolean;
	ranking: number;
	website?: string;
	github?: string;
	twitter?: string;
	avatar?: string;
	contests: UserContest[];
	achievements: Achievement[];
	specialties: string[];
	favoriteCategories: { category: string; solved: number; color: string }[];
	yearsPlaying: number;
}

// Mock user data
const getUserDetails = async (id: string): Promise<UserDetails> => {
	await new Promise((resolve) => setTimeout(resolve, 1000));

	return {
		id: parseInt(id),
		username: "cyberninja",
		email: "ninja@cyberspace.com",
		description:
			"Elite hacker specializing in binary exploitation and reverse engineering. PhD in Computer Science with focus on systems security. Mentor for upcoming CTF players.",
		permission_level: "player",
		country_code: "JP",
		contestsParticipated: 67,
		averagePlace: 12.4,
		teams: [
			{ id: 1, name: "zer0pts" },
			{ id: 2, name: "CyberNinjas" },
			{ id: 3, name: "Binary Exploiters" },
		],
		lastActive: "2024-01-15T10:30:00Z",
		created_at: "2023-03-15T08:00:00Z",
		verified: true,
		ranking: 1,
		website: "https://cyberninja.dev",
		github: "cyberninja-dev",
		twitter: "cyber_ninja_ctf",
		contests: [
			{
				id: 1,
				name: "DEFCON CTF 2024",
				date: "2024-08-10",
				place: 3,
				teamPlace: 1,
				participants: 156,
				points: 1247,
				year: 2024,
				teamName: "zer0pts",
				teamId: 1,
				difficulty: "Insane",
				category: "Pwn",
			},
			{
				id: 2,
				name: "PlaidCTF 2024",
				date: "2024-04-15",
				place: 8,
				teamPlace: 2,
				participants: 234,
				points: 987,
				year: 2024,
				teamName: "zer0pts",
				teamId: 1,
				difficulty: "Hard",
				category: "Rev",
			},
			{
				id: 3,
				name: "Google CTF 2024",
				date: "2024-06-22",
				place: 5,
				teamPlace: 1,
				participants: 187,
				points: 1156,
				year: 2024,
				teamName: "zer0pts",
				teamId: 1,
				difficulty: "Insane",
				category: "Pwn",
			},
			{
				id: 4,
				name: "0CTF/TCTF 2023",
				date: "2023-09-15",
				place: 12,
				teamPlace: 1,
				participants: 145,
				points: 834,
				year: 2023,
				teamName: "zer0pts",
				teamId: 1,
				difficulty: "Hard",
				category: "Crypto",
			},
			{
				id: 5,
				name: "HITCON CTF 2023",
				date: "2023-12-08",
				place: 6,
				teamPlace: 3,
				participants: 98,
				points: 1034,
				year: 2023,
				teamName: "zer0pts",
				teamId: 1,
				difficulty: "Hard",
				category: "Web",
			},
		],
		achievements: [
			{
				id: 1,
				title: "First Blood Hunter",
				description: "Achieved 10+ first bloods in international CTFs",
				date: "2024-01-15",
				icon: "⚡",
				rarity: "Legendary",
			},
			{
				id: 2,
				title: "Binary Beast",
				description: "Master of binary exploitation challenges",
				date: "2023-11-20",
				icon: "🔥",
				rarity: "Epic",
			},
			{
				id: 3,
				title: "Crypto Crusher",
				description: "Solved 50+ cryptography challenges",
				date: "2023-09-10",
				icon: "🧠",
				rarity: "Rare",
			},
			{
				id: 4,
				title: "Team Player",
				description: "Active member of top-tier CTF team",
				date: "2023-08-05",
				icon: "🤝",
				rarity: "Epic",
			},
			{
				id: 5,
				title: "Consistency King",
				description: "30-day solve streak",
				date: "2023-07-22",
				icon: "🎯",
				rarity: "Rare",
			},
		],
		specialties: [
			"Binary Exploitation",
			"Reverse Engineering",
			"System Security",
			"Kernel Exploitation",
			"Malware Analysis",
		],
		favoriteCategories: [
			{ category: "Pwn", solved: 234, color: "text-red-400" },
			{ category: "Rev", solved: 187, color: "text-purple-400" },
			{ category: "Crypto", solved: 123, color: "text-blue-400" },
			{ category: "Web", solved: 98, color: "text-green-400" },
			{ category: "Misc", solved: 76, color: "text-yellow-400" },
			{ category: "Forensics", solved: 45, color: "text-pink-400" },
		],
		yearsPlaying:
			Math.round(
				((Date.now() - new Date("2023-03-15T08:00:00Z").getTime()) /
					(1000 * 60 * 60 * 24 * 365)) *
					10
			) / 10,
	};
};

const HackerTerminal = ({
	lines,
	className = "",
}: {
	lines: string[];
	className?: string;
}) => {
	const [visibleLines, setVisibleLines] = useState<string[]>([]);
	const [currentLine, setCurrentLine] = useState(0);
	const [isComplete, setIsComplete] = useState(false);

	useEffect(() => {
		if (!isComplete && currentLine < lines.length) {
			const timer = setTimeout(() => {
				const line = lines[currentLine];
				if (line) {
					setVisibleLines((prev) => [...prev, line]);
				}
				const nextLine = currentLine + 1;
				setCurrentLine(nextLine);
				if (nextLine >= lines.length) {
					setIsComplete(true);
				}
			}, 200);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [currentLine, lines, isComplete]);

	useEffect(() => {
		if (!isComplete) {
			setCurrentLine(0);
			setVisibleLines([]);
		}
	}, [lines, isComplete]);

	return (
		<div
			className={clsx(
				"bg-card border-2 border-green-400/50 rounded-lg p-6 font-mono text-sm",
				className
			)}
		>
			<div className="flex items-center gap-2 mb-4 border-b border-green-400/30 pb-3">
				<div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
				<div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm" />
				<div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
				<span className="text-green-400 text-xs ml-2 font-bold">
					cyberninja@terminal:~$
				</span>
			</div>

			{visibleLines.map((line, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
					className="text-green-400 mb-2 leading-relaxed"
				>
					<span className="text-green-400 font-bold">$ </span>
					<span className="text-foreground">{line}</span>
				</motion.div>
			))}

			{!isComplete && currentLine < lines.length && (
				<motion.div
					className="text-green-400 flex items-center"
					animate={{ opacity: [1, 0.3] }}
					transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
				>
					<span className="text-green-400 font-bold">$ </span>
					<span className="bg-green-400 w-2 h-5 ml-1 animate-pulse inline-block">
						█
					</span>
				</motion.div>
			)}
		</div>
	);
};

const SkillRadar = ({
	categories,
}: {
	categories: { category: string; solved: number; color: string }[];
}) => {
	const maxSolved = Math.max(...categories.map((c) => c.solved));
	const displayCategories = categories.slice(0, 6);

	return (
		<div className="relative w-48 h-48 mx-auto">
			<svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
				{[20, 40, 60, 80].map((radius) => (
					<circle
						key={radius}
						cx="100"
						cy="100"
						r={radius}
						fill="none"
						stroke="rgb(34, 197, 94, 0.2)"
						strokeWidth="1"
					/>
				))}

				{displayCategories.map((category, i) => {
					const angle = i * 60 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = (category.solved / maxSolved) * 80;
					const x = 100 + level * Math.cos(radians);
					const y = 100 + level * Math.sin(radians);
					return (
						<line
							key={i}
							x1="100"
							y1="100"
							x2={x}
							y2={y}
							stroke="rgb(34, 197, 94, 0.4)"
							strokeWidth="1"
						/>
					);
				})}

				<polygon
					points={displayCategories
						.map((category, i) => {
							const angle = i * 60 - 90;
							const radians = (angle * Math.PI) / 180;
							const level = (category.solved / maxSolved) * 80;
							const x = 100 + level * Math.cos(radians);
							const y = 100 + level * Math.sin(radians);
							return `${x},${y}`;
						})
						.join(" ")}
					fill="rgba(34, 197, 94, 0.2)"
					stroke="rgb(34, 197, 94)"
					strokeWidth="2"
				/>

				{displayCategories.map((category, i) => {
					const angle = i * 60 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = (category.solved / maxSolved) * 80;
					const x = 100 + level * Math.cos(radians);
					const y = 100 + level * Math.sin(radians);
					return <circle key={i} cx={x} cy={y} r="3" fill="rgb(34, 197, 94)" />;
				})}
			</svg>

			{displayCategories.map((category, i) => {
				const angle = i * 60 - 90;
				const radians = (angle * Math.PI) / 180;
				const x = 100 + 95 * Math.cos(radians);
				const y = 100 + 95 * Math.sin(radians);

				return (
					<div
						key={category.category}
						className="absolute text-xs font-mono text-green-400 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
						style={{ left: `${(x / 200) * 100}%`, top: `${(y / 200) * 100}%` }}
					>
						<div className="text-center">
							<div>{category.category}</div>
							<div className="text-xs text-gray-400">{category.solved}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const AchievementCard = ({ achievement }: { achievement: Achievement }) => {
	const getRarityColor = (rarity: string) => {
		switch (rarity) {
			case "Common":
				return "border-gray-400/50 bg-gray-400/10 text-gray-400";
			case "Rare":
				return "border-blue-400/50 bg-blue-400/10 text-blue-400";
			case "Epic":
				return "border-purple-400/50 bg-purple-400/10 text-purple-400";
			case "Legendary":
				return "border-yellow-400/50 bg-yellow-400/10 text-yellow-400";
			default:
				return "border-gray-400/50 bg-gray-400/10 text-gray-400";
		}
	};

	return (
		<motion.div
			whileHover={{ scale: 1.05, rotateY: 5 }}
			className={clsx(
				"p-4 rounded-lg border relative overflow-hidden group cursor-pointer",
				getRarityColor(achievement.rarity)
			)}
		>
			<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

			<div className="relative z-10">
				<div className="flex items-center gap-3 mb-2">
					<span className="text-2xl">{achievement.icon}</span>
					<div className="flex-1">
						<h4 className="font-bold text-sm">{achievement.title}</h4>
						<Badge variant="outline" size="sm" className="text-xs">
							{achievement.rarity}
						</Badge>
					</div>
				</div>

				<p className="text-xs text-muted-foreground mb-2">
					{achievement.description}
				</p>

				<div className="text-xs font-mono opacity-70">
					{new Date(achievement.date).toLocaleDateString()}
				</div>
			</div>
		</motion.div>
	);
};

export default function UserPage() {
	const params = useParams();
	const [user, setUser] = useState<UserDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showAllContests, setShowAllContests] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const { clientX, clientY } = e;
			const { innerWidth, innerHeight } = window;
			setMousePosition({
				x: (clientX / innerWidth - 0.5) * 20,
				y: (clientY / innerHeight - 0.5) * 20,
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				setIsLoading(true);
				const userData = await getUserDetails(params.id as string);
				setUser(userData);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [params.id]);

	if (isLoading) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center">
					<LoadingSpinner size="lg" />
				</div>
			</MainLayout>
		);
	}

	if (!user) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">User Not Found</h1>
						<Button onClick={() => window.history.back()}>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</div>
				</div>
			</MainLayout>
		);
	}

	const terminalLines = [
		`whoami: ${user.username}`,
		`ls achievements/ | wc -l: ${user.achievements.length}`,
		`uptime: ${Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))} days`,
		`last login: ${new Date(user.lastActive).toLocaleString()}`,
		`years_playing: ${user.yearsPlaying} years`,
	];

	const displayedContests = showAllContests
		? user.contests
		: user.contests.slice(0, 3);

	return (
		<MainLayout>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="relative py-12 px-4">
					<div className="max-w-7xl mx-auto">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-12"
						>
							<div className="relative">
								{/* User Avatar */}
								<motion.div
									className="w-32 h-32 mx-auto mb-6 relative"
									animate={{
										x: mousePosition.x * 0.5,
										y: mousePosition.y * 0.3,
										rotateX: mousePosition.y * 0.5,
										rotateY: mousePosition.x * 0.5,
									}}
									transition={{ type: "spring", stiffness: 150, damping: 15 }}
								>
									<div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white">
										<span>{user.username?.[0]?.toUpperCase() || "U"}</span>
									</div>

									{/* Ranking Ring */}
									<motion.div
										className="absolute inset-0 rounded-full border-4 border-yellow-400"
										animate={{
											rotate: -mousePosition.x * 0.3,
											scale:
												1 + Math.abs(mousePosition.x + mousePosition.y) * 0.001,
										}}
										transition={{ type: "spring", stiffness: 200, damping: 20 }}
									/>

									{/* Rank Badge */}
									<div className="absolute -top-2 -right-2 bg-yellow-400 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold font-mono text-sm">
										#{user.ranking}
									</div>

									{/* Verification Badge */}
									{user.verified && (
										<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
											<Shield className="h-4 w-4 text-white" />
										</div>
									)}
								</motion.div>

								{/* User Info */}
								<div className="space-y-4">
									<div className="flex items-center justify-center gap-3">
										<h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
											{user.username}
										</h1>
										{user.permission_level === "administrator" && (
											<Star className="h-6 w-6 text-yellow-400" />
										)}
										{user.permission_level === "moderator" && (
											<Shield className="h-6 w-6 text-blue-400" />
										)}
									</div>

									<div className="flex items-center justify-center gap-2">
										<span className="text-2xl">
											<Flag code={user.country_code} />
										</span>
										<span className="font-mono text-muted-foreground">
											{user.country_code}
										</span>
									</div>

									<p className="text-muted-foreground max-w-2xl mx-auto">
										{user.description}
									</p>

									{/* Teams List */}
									{user.teams && user.teams.length > 0 && (
										<div className="flex flex-wrap items-center justify-center gap-2 mt-4">
											{user.teams.map((team) => (
												<motion.div
													key={team.id}
													whileHover={{ scale: 1.05 }}
													className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/50 rounded-full cursor-pointer text-sm"
													onClick={() => {
														window.location.href = `/teams/${team.id}`;
													}}
												>
													<Users className="h-3 w-3 text-primary" />
													<span className="font-mono text-primary font-bold">
														{team.name}
													</span>
												</motion.div>
											))}
										</div>
									)}
								</div>
							</div>
						</motion.div>

						{/* Live Stats Grid */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
							{[
								{
									label: "Contests",
									value: user.contestsParticipated,
									icon: Trophy,
									color: "text-orange-400",
								},
								{
									label: "Avg Place",
									value: user.averagePlace.toFixed(1),
									icon: Target,
									color: "text-blue-400",
								},
								{
									label: "Years Playing",
									value: `${user.yearsPlaying} years`,
									icon: Calendar,
									color: "text-purple-400",
								},
							].map((stat, index) => (
								<motion.div
									key={stat.label}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.1 + index * 0.05 }}
									whileHover={{ scale: 1.05 }}
									className="p-4 bg-card border border-border rounded-lg group"
								>
									<div className="relative z-10 text-center">
										<stat.icon
											className={clsx("h-6 w-6 mx-auto mb-2", stat.color)}
										/>
										<div
											className={clsx(
												"text-xl font-bold font-mono",
												stat.color
											)}
										>
											{stat.value}
										</div>
										<div className="text-xs text-muted-foreground font-mono">
											{stat.label}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Main Content */}
				<section className="py-8 px-4">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
							{/* Terminal */}
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
							>
								<h3 className="text-xl font-bold font-mono text-green-400 mb-4 flex items-center gap-2">
									<User className="h-5 w-5" />
									HACKER_TERMINAL
								</h3>
								<HackerTerminal lines={terminalLines} />
							</motion.div>

							{/* Skill Radar */}
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4 }}
								className="text-center"
							>
								<h3 className="text-xl font-bold font-mono text-green-400 mb-4 flex items-center justify-center gap-2">
									<Target className="h-5 w-5" />
									SKILL RADAR
								</h3>
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<SkillRadar categories={user.favoriteCategories} />
								</div>
							</motion.div>
						</div>

						{/* Achievements */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className="mb-8"
						>
							<h3 className="text-xl font-bold font-mono text-purple-400 mb-6 flex items-center gap-2">
								<Trophy className="h-5 w-5" />
								ACHIEVEMENTS_UNLOCKED
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{user.achievements.map((achievement, index) => (
									<motion.div
										key={achievement.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6 + index * 0.1 }}
									>
										<AchievementCard achievement={achievement} />
									</motion.div>
								))}
							</div>
						</motion.div>

						{/* Recent Contests */}
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="mb-8"
						>
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold font-mono text-orange-400 flex items-center gap-2">
									<Calendar className="h-5 w-5" />
									RECENT_BATTLES
								</h3>
								{user.contests.length > 3 && (
									<Button
										variant="outline"
										size="sm"
										onClick={() => setShowAllContests(!showAllContests)}
										className="font-mono text-xs"
									>
										{showAllContests ? (
											<>
												<ChevronUp className="h-3 w-3 mr-1" />
												Show Less
											</>
										) : (
											<>
												<ChevronDown className="h-3 w-3 mr-1" />
												Show All ({user.contests.length})
											</>
										)}
									</Button>
								)}
							</div>

							<div className="space-y-4">
								<AnimatePresence>
									{displayedContests.map((contest, index) => (
										<motion.div
											key={contest.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: -20 }}
											transition={{ delay: index * 0.1 }}
											className="p-4 bg-card border border-border rounded-lg hover:border-orange-400/50 transition-all group cursor-pointer"
											onClick={() => {
												window.location.href = `/contests/${contest.id}`;
											}}
										>
											<div className="flex items-center justify-between mb-3">
												<div className="flex-1">
													<h4 className="font-bold text-sm hover:text-orange-400 transition-colors">
														{contest.name}
													</h4>
													<div className="text-xs text-muted-foreground font-mono">
														{new Date(contest.date).toLocaleDateString()}
													</div>
													<div className="text-xs text-muted-foreground mt-1">
														Team:{" "}
														<span
															className="text-primary hover:text-primary/80 cursor-pointer font-mono"
															onClick={(e) => {
																e.stopPropagation();
																window.location.href = `/teams/${contest.teamId}`;
															}}
														>
															{contest.teamName}
														</span>
													</div>
												</div>

												<div className="flex items-center gap-2">
													<Badge
														variant="outline"
														size="sm"
														className={clsx(
															contest.place <= 3
																? "text-yellow-400 border-yellow-400/50"
																: contest.place <= 10
																	? "text-orange-400 border-orange-400/50"
																	: "text-blue-400 border-blue-400/50"
														)}
													>
														#{contest.place}
													</Badge>
													<Badge variant="secondary" size="sm">
														{contest.category}
													</Badge>
												</div>
											</div>

											<div className="grid grid-cols-3 gap-4 text-xs">
												<div>
													<span className="text-muted-foreground">
														Team Place:
													</span>
													<div className="font-mono font-bold text-primary">
														#{contest.teamPlace}
													</div>
												</div>
												<div>
													<span className="text-muted-foreground">Points:</span>
													<div className="font-mono font-bold">
														{contest.points.toLocaleString()}
													</div>
												</div>
												<div>
													<span className="text-muted-foreground">
														Participants:
													</span>
													<div className="font-mono font-bold">
														{contest.participants}
													</div>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</div>
						</motion.div>

						{/* External Links */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="flex items-center justify-center gap-4"
						>
							{user.website && (
								<Button variant="outline" size="sm" asChild>
									<a
										href={user.website}
										target="_blank"
										rel="noopener noreferrer"
									>
										<Globe className="h-4 w-4 mr-2" />
										Website
										<ExternalLink className="h-3 w-3 ml-2" />
									</a>
								</Button>
							)}
							{user.github && (
								<Button variant="outline" size="sm" asChild>
									<a
										href={`https://github.com/${user.github}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<svg
											className="h-4 w-4 mr-2"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
										</svg>
										GitHub
										<ExternalLink className="h-3 w-3 ml-2" />
									</a>
								</Button>
							)}
							{user.twitter && (
								<Button variant="outline" size="sm" asChild>
									<a
										href={`https://twitter.com/${user.twitter}`}
										target="_blank"
										rel="noopener noreferrer"
									>
										<svg
											className="h-4 w-4 mr-2"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
										</svg>
										Twitter
										<ExternalLink className="h-3 w-3 ml-2" />
									</a>
								</Button>
							)}
							<Button variant="outline" size="sm" asChild>
								<a href={`mailto:${user.email}`}>
									<Mail className="h-4 w-4 mr-2" />
									Contact
								</a>
							</Button>
						</motion.div>
					</div>
				</section>
			</div>
		</MainLayout>
	);
}
