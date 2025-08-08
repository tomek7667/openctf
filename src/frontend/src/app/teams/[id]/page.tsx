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
} from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { MainLayout } from "@/components/layout/MainLayout";
import { getCountryByCode } from "@/lib/countries";
import { clsx } from "clsx";

interface TeamMember {
	id: number;
	username: string;
	email: string;
	role: "captain" | "member";
	joinedAt: string;
	rating: number;
	verified: boolean;
	avatar?: string;
	description?: string;
}

interface Contest {
	id: number;
	name: string;
	date: string;
	place: number;
	participants: number;
	points: number;
	year: number;
	logo?: string;
	difficulty: "Easy" | "Medium" | "Hard" | "Insane";
}

interface TeamDetails {
	id: number;
	name: string;
	description: string;
	country_code: string;
	ctftime_id?: number;
	website?: string;
	email?: string;
	verified_at?: string;
	created_at: string;
	ranking: number;
	ratingPoints: number;
	contestsCount: number;
	avgPlace: number;
	memberCount: number;
	captain: TeamMember;
	members: TeamMember[];
	contests: Contest[];
	achievements: string[];
	logo?: string;
}

// Mock team data
const getTeamDetails = async (id: string): Promise<TeamDetails> => {
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	return {
		id: parseInt(id),
		name: "zer0pts",
		description: "Elite Japanese CTF team pushing the boundaries of cybersecurity excellence. We specialize in binary exploitation, reverse engineering, and cryptographic challenges.",
		country_code: "JP",
		ctftime_id: 22319,
		website: "https://zer0pts.com",
		email: "contact@zer0pts.com",
		verified_at: new Date().toISOString(),
		created_at: "2019-03-15T10:00:00Z",
		ranking: 1,
		ratingPoints: 3247,
		contestsCount: 187,
		avgPlace: 1.8,
		memberCount: 14,
		captain: {
			id: 1,
			username: "zer0_captain",
			email: "captain@zer0pts.com",
			role: "captain",
			joinedAt: "2019-03-15T10:00:00Z",
			rating: 3156,
			verified: true,
			description: "Lead exploit developer and team strategist",
		},
		members: [
			{
				id: 2,
				username: "binary_ninja",
				email: "ninja@zer0pts.com",
				role: "member",
				joinedAt: "2019-05-20T14:30:00Z",
				rating: 2987,
				verified: true,
				description: "Binary exploitation specialist",
			},
			{
				id: 3,
				username: "crypto_wizard",
				email: "crypto@zer0pts.com",
				role: "member",
				joinedAt: "2019-07-08T09:15:00Z",
				rating: 2845,
				verified: true,
				description: "Cryptography and mathematics expert",
			},
			{
				id: 4,
				username: "web_slasher",
				email: "web@zer0pts.com",
				role: "member",
				joinedAt: "2020-01-12T16:45:00Z",
				rating: 2734,
				verified: true,
				description: "Web application security researcher",
			},
			{
				id: 5,
				username: "reverse_master",
				email: "reverse@zer0pts.com",
				role: "member",
				joinedAt: "2020-03-22T11:20:00Z",
				rating: 2689,
				verified: true,
				description: "Reverse engineering and malware analysis",
			},
		],
		contests: [
			{ id: 1, name: "DEFCON CTF 2024", date: "2024-08-10", place: 1, participants: 156, points: 2847, year: 2024, difficulty: "Insane" },
			{ id: 2, name: "PlaidCTF 2024", date: "2024-04-15", place: 2, participants: 234, points: 2534, year: 2024, difficulty: "Hard" },
			{ id: 3, name: "Google CTF 2024", date: "2024-06-22", place: 1, participants: 187, points: 2789, year: 2024, difficulty: "Insane" },
			{ id: 4, name: "0CTF/TCTF 2023", date: "2023-09-15", place: 1, participants: 145, points: 2456, year: 2023, difficulty: "Hard" },
			{ id: 5, name: "HITCON CTF 2023", date: "2023-12-08", place: 3, participants: 98, points: 2234, year: 2023, difficulty: "Hard" },
			{ id: 6, name: "Real World CTF 2023", date: "2023-11-20", place: 1, participants: 67, points: 2567, year: 2023, difficulty: "Insane" },
			{ id: 7, name: "DEFCON CTF 2023", date: "2023-08-12", place: 2, participants: 134, points: 2678, year: 2023, difficulty: "Insane" },
			{ id: 8, name: "TokyoWesterns CTF 2022", date: "2022-09-03", place: 1, participants: 178, points: 2456, year: 2022, difficulty: "Medium" },
			{ id: 9, name: "SECCON CTF 2022", date: "2022-11-12", place: 1, participants: 156, points: 2334, year: 2022, difficulty: "Hard" },
		],
		achievements: [
			"🏆 DEFCON CTF Champions 2024",
			"🥇 Google CTF Winners 2024", 
			"⭐ Top 3 CTFtime.org 2023",
			"🎯 Real World CTF Champions 2023",
			"🔥 50+ First Place Finishes",
		],
	};
};

const GlowingCard = ({ children, className = "", glowColor = "blue" }: { 
	children: React.ReactNode, 
	className?: string,
	glowColor?: string 
}) => (
	<div className={clsx(
		"relative group transition-all duration-500 hover:scale-[1.02]",
		className
	)}>
		<div className={clsx(
			"absolute inset-0 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity duration-500",
			glowColor === "blue" && "bg-blue-500",
			glowColor === "yellow" && "bg-yellow-400",
			glowColor === "green" && "bg-green-500",
			glowColor === "red" && "bg-red-500",
			glowColor === "purple" && "bg-purple-500",
		)} />
		<div className="relative bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden">
			{children}
		</div>
	</div>
);

const MatrixRain = () => {
	const [drops, setDrops] = useState<number[]>([]);
	
	useEffect(() => {
		const newDrops = Array.from({ length: 20 }, () => Math.random() * 100);
		setDrops(newDrops);
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
			{drops.map((position, index) => (
				<motion.div
					key={index}
					className="absolute w-px bg-gradient-to-b from-green-400 to-transparent"
					style={{ left: `${position}%`, height: '100px' }}
					animate={{
						y: ['-100px', '100vh'],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: 3 + Math.random() * 2,
						repeat: Infinity,
						delay: Math.random() * 2,
					}}
				/>
			))}
		</div>
	);
};

const HackerText = ({ text, className = "" }: { text: string, className?: string }) => {
	const [displayText, setDisplayText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timer = setTimeout(() => {
				setDisplayText(prev => prev + text[currentIndex]);
				setCurrentIndex(prev => prev + 1);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [currentIndex, text]);

	return (
		<span className={clsx("font-mono", className)}>
			{displayText}
			{currentIndex < text.length && (
				<motion.span
					className="inline-block w-2 h-5 bg-green-400 ml-1"
					animate={{ opacity: [1, 0] }}
					transition={{ duration: 0.8, repeat: Infinity }}
				/>
			)}
		</span>
	);
};

const CaptainCard = ({ captain }: { captain: TeamMember }) => (
	<GlowingCard glowColor="yellow" className="mb-8">
		<div className="p-6 relative">
			<div className="absolute top-4 right-4">
				<div className="flex items-center gap-2 px-3 py-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full">
					<Trophy className="h-4 w-4 text-yellow-400" />
					<span className="text-xs font-mono text-yellow-400 font-bold">CAPTAIN</span>
				</div>
			</div>
			
			<div className="flex items-start gap-6">
				<div className="relative">
					<div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-black">
						{captain.username[0].toUpperCase()}
					</div>
					<motion.div
						className="absolute inset-0 rounded-full border-2 border-yellow-400"
						animate={{ rotate: 360 }}
						transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
					/>
					{captain.verified && (
						<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
							<Shield className="h-3 w-3 text-white" />
						</div>
					)}
				</div>
				
				<div className="flex-1">
					<div className="flex items-center gap-3 mb-2">
						<HackerText text={captain.username} className="text-2xl font-bold text-yellow-400" />
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 text-yellow-400" />
							<span className="text-yellow-400 font-mono font-bold">{captain.rating.toLocaleString()}</span>
						</div>
					</div>
					
					<p className="text-muted-foreground mb-4">{captain.description}</p>
					
					<div className="grid grid-cols-2 gap-4">
						<div>
							<span className="text-xs text-muted-foreground font-mono">JOINED</span>
							<div className="font-mono text-sm">
								{new Date(captain.joinedAt).toLocaleDateString()}
							</div>
						</div>
						<div>
							<span className="text-xs text-muted-foreground font-mono">EMAIL</span>
							<div className="font-mono text-sm text-primary">
								{captain.email}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</GlowingCard>
);

const MemberGrid = ({ members }: { members: TeamMember[] }) => (
	<GlowingCard glowColor="blue" className="mb-8">
		<div className="p-6">
			<div className="flex items-center gap-3 mb-6">
				<Users className="h-5 w-5 text-blue-400" />
				<h3 className="text-xl font-bold font-mono text-blue-400">TEAM_MEMBERS</h3>
				<Badge variant="outline" size="sm">{members.length}</Badge>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{members.map((member, index) => (
					<motion.div
						key={member.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="p-4 border border-border/30 rounded-lg hover:border-blue-400/50 transition-all group"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center font-bold text-white">
								{member.username[0].toUpperCase()}
							</div>
							<div className="flex-1">
								<div className="flex items-center gap-2">
									<span className="font-mono font-bold text-sm">{member.username}</span>
									{member.verified && (
										<Shield className="h-3 w-3 text-green-400" />
									)}
								</div>
								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Star className="h-3 w-3" />
									<span className="font-mono">{member.rating.toLocaleString()}</span>
								</div>
							</div>
						</div>
						
						<p className="text-xs text-muted-foreground mb-2">{member.description}</p>
						
						<div className="text-xs text-muted-foreground font-mono">
							Joined: {new Date(member.joinedAt).toLocaleDateString()}
						</div>
					</motion.div>
				))}
			</div>
		</div>
	</GlowingCard>
);

const ContestTimeline = ({ contests }: { contests: Contest[] }) => {
	const contestsByYear = contests.reduce((acc, contest) => {
		if (!acc[contest.year]) acc[contest.year] = [];
		acc[contest.year].push(contest);
		return acc;
	}, {} as Record<number, Contest[]>);

	const years = Object.keys(contestsByYear).map(Number).sort((a, b) => b - a);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy": return "text-green-400 border-green-400/50 bg-green-400/10";
			case "Medium": return "text-yellow-400 border-yellow-400/50 bg-yellow-400/10";
			case "Hard": return "text-orange-400 border-orange-400/50 bg-orange-400/10";
			case "Insane": return "text-red-400 border-red-400/50 bg-red-400/10";
			default: return "text-blue-400 border-blue-400/50 bg-blue-400/10";
		}
	};

	const getPlaceColor = (place: number) => {
		if (place === 1) return "text-yellow-400 bg-yellow-400/20";
		if (place <= 3) return "text-orange-400 bg-orange-400/20";
		if (place <= 10) return "text-blue-400 bg-blue-400/20";
		return "text-muted-foreground bg-muted/20";
	};

	return (
		<GlowingCard glowColor="purple" className="mb-8">
			<div className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<Calendar className="h-5 w-5 text-purple-400" />
					<h3 className="text-xl font-bold font-mono text-purple-400">CONTEST_HISTORY</h3>
					<Badge variant="outline" size="sm">{contests.length} contests</Badge>
				</div>

				<div className="space-y-8">
					{years.map((year) => (
						<div key={year} className="relative">
							<div className="flex items-center gap-4 mb-4">
								<div className="text-2xl font-bold font-mono text-purple-400">{year}</div>
								<div className="h-px bg-gradient-to-r from-purple-400/50 to-transparent flex-1" />
								<Badge variant="secondary" size="sm">
									{contestsByYear[year].length} contests
								</Badge>
							</div>

							<div className="grid gap-4 pl-8">
								{contestsByYear[year]
									.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
									.map((contest, index) => (
									<motion.div
										key={contest.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="relative p-4 border border-border/30 rounded-lg hover:border-purple-400/50 transition-all group"
									>
										<div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full" />
										
										<div className="flex items-start justify-between mb-2">
											<div>
												<h4 className="font-bold text-sm mb-1">{contest.name}</h4>
												<div className="text-xs text-muted-foreground font-mono">
													{new Date(contest.date).toLocaleDateString()}
												</div>
											</div>
											
											<div className="flex items-center gap-2">
												<div className={clsx(
													"px-2 py-1 rounded text-xs font-bold font-mono",
													getPlaceColor(contest.place)
												)}>
													#{contest.place}
												</div>
												<div className={clsx(
													"px-2 py-1 rounded text-xs font-mono border",
													getDifficultyColor(contest.difficulty)
												)}>
													{contest.difficulty}
												</div>
											</div>
										</div>

										<div className="grid grid-cols-3 gap-4 text-xs">
											<div>
												<span className="text-muted-foreground">Participants:</span>
												<div className="font-mono font-bold">{contest.participants}</div>
											</div>
											<div>
												<span className="text-muted-foreground">Points:</span>
												<div className="font-mono font-bold text-primary">{contest.points.toLocaleString()}</div>
											</div>
											<div>
												<span className="text-muted-foreground">Ranking:</span>
												<div className="font-mono font-bold">
													{contest.place}/{contest.participants}
												</div>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</GlowingCard>
	);
};

export default function TeamPage() {
	const params = useParams();
	const [team, setTeam] = useState<TeamDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchTeam = async () => {
			try {
				setIsLoading(true);
				const teamData = await getTeamDetails(params.id as string);
				setTeam(teamData);
			} catch (error) {
				console.error("Error fetching team:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTeam();
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

	if (!team) {
		return (
			<MainLayout>
				<div className="min-h-screen flex items-center justify-center">
					<div className="text-center">
						<h1 className="text-2xl font-bold mb-4">Team Not Found</h1>
						<Button onClick={() => window.history.back()}>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Go Back
						</Button>
					</div>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="relative min-h-screen">
				<MatrixRain />
				
				{/* Hero Section */}
				<section className="relative py-12 px-4 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
					
					<div className="max-w-7xl mx-auto relative">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8 }}
							className="text-center mb-12"
						>
							<div className="flex items-center justify-center gap-4 mb-6">
								<Button
									variant="outline"
									size="sm"
									onClick={() => window.history.back()}
									className="font-mono"
								>
									<ChevronLeft className="h-4 w-4 mr-2" />
									BACK
								</Button>
								
								<div className="flex items-center gap-3">
									<span className="text-6xl">{getCountryByCode(team.country_code)?.flag || "🌍"}</span>
									<div className="text-left">
										<div className="flex items-center gap-3">
											<h1 className="text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
												{team.name.toUpperCase()}
											</h1>
											{team.verified_at && (
												<div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
													<Shield className="h-4 w-4 text-green-400" />
													<span className="text-xs font-mono text-green-400 font-bold">VERIFIED</span>
												</div>
											)}
										</div>
										<div className="flex items-center gap-4 mt-2">
											<div className="flex items-center gap-2">
												<Trophy className="h-5 w-5 text-yellow-400" />
												<span className="text-xl font-mono font-bold text-yellow-400">#{team.ranking}</span>
											</div>
											<div className="flex items-center gap-2">
												<Star className="h-5 w-5 text-primary" />
												<span className="text-xl font-mono font-bold text-primary">{team.ratingPoints.toLocaleString()}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
								{team.description}
							</p>

							{/* Quick Stats */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
								{[
									{ label: "Contests", value: team.contestsCount, icon: Target },
									{ label: "Avg Place", value: team.avgPlace.toFixed(1), icon: Trophy },
									{ label: "Members", value: team.memberCount, icon: Users },
									{ label: "Years Active", value: new Date().getFullYear() - new Date(team.created_at).getFullYear(), icon: Calendar },
								].map((stat, index) => (
									<motion.div
										key={stat.label}
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.2 + index * 0.1 }}
										className="p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg"
									>
										<stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
										<div className="text-2xl font-bold font-mono text-primary">{stat.value}</div>
										<div className="text-xs text-muted-foreground font-mono">{stat.label}</div>
									</motion.div>
								))}
							</div>

							{/* External Links */}
							<div className="flex items-center justify-center gap-4 mt-8">
								{team.website && (
									<Button variant="outline" size="sm" asChild>
										<a href={team.website} target="_blank" rel="noopener noreferrer">
											<Globe className="h-4 w-4 mr-2" />
											Website
											<ExternalLink className="h-3 w-3 ml-2" />
										</a>
									</Button>
								)}
								{team.ctftime_id && (
									<Button variant="outline" size="sm" asChild>
										<a href={`https://ctftime.org/team/${team.ctftime_id}`} target="_blank" rel="noopener noreferrer">
											<Trophy className="h-4 w-4 mr-2" />
											CTFtime
											<ExternalLink className="h-3 w-3 ml-2" />
										</a>
									</Button>
								)}
								{team.email && (
									<Button variant="outline" size="sm" asChild>
										<a href={`mailto:${team.email}`}>
											<Mail className="h-4 w-4 mr-2" />
											Contact
										</a>
									</Button>
								)}
							</div>
						</motion.div>
					</div>
				</section>

				{/* Main Content */}
				<section className="py-8 px-4">
					<div className="max-w-7xl mx-auto">
						{/* Achievements */}
						<GlowingCard glowColor="green" className="mb-8">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<Trophy className="h-5 w-5 text-green-400" />
									<h3 className="text-xl font-bold font-mono text-green-400">ACHIEVEMENTS</h3>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{team.achievements.map((achievement, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
										>
											<div className="text-sm font-mono text-green-400">{achievement}</div>
										</motion.div>
									))}
								</div>
							</div>
						</GlowingCard>

						{/* Captain */}
						<CaptainCard captain={team.captain} />

						{/* Members */}
						<MemberGrid members={team.members} />

						{/* Contest History */}
						<ContestTimeline contests={team.contests} />
					</div>
				</section>
			</div>
		</MainLayout>
	);
}
