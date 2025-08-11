"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
	User,
	MapPin,
	Calendar,
	Trophy,
	BookOpen,
	Github,
	Linkedin,
	Globe,
	Eye,
	Award,
	TrendingUp,
	BarChart,
	Plus,
	Settings,
	Lock,
	Bell,
	Shield,
	Key,
	Link,
	Save,
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { getUserWriteups, WriteupListResponse } from "@/api/writeups";
import {
	changePassword,
	updateNotifications,
	updatePrivacy,
	updateConnections,
	connectGithub,
} from "@/api/settings";

// Mock user profile data - in real app this would come from API
const mockUserProfile = {
	id: "1",
	username: "CyberNinja",
	email: "cyberninja@example.com",
	bio: "Passionate cybersecurity researcher specializing in web application security and cryptography. CTF enthusiast with 5+ years of experience.",
	location: "San Francisco, CA",
	joinedDate: "2019-03-15",
	socialLinks: {
		github: "https://github.com/cyberninja",
		linkedin: "https://linkedin.com/in/cyberninja",
		twitter: "https://twitter.com/cyberninja",
		website: "https://cyberninja.dev",
	},
	skills: [
		"Web Security",
		"Cryptography",
		"Reverse Engineering",
		"Python",
		"JavaScript",
		"Binary Exploitation",
	],
	skillLevels: {
		"Web Security": 85,
		Cryptography: 75,
		"Reverse Engineering": 90,
		Python: 80,
		JavaScript: 70,
		"Binary Exploitation": 65,
	},
	statistics: {
		contestsParticipated: 42,
		writeupsAuthored: 28,
		currentRating: 1847,
		maxRating: 1923,
		totalViews: 15420,
		totalLikes: 892,
	},
	achievements: [
		{
			id: "first-writeup",
			name: "First Writeup",
			description: "Published your first writeup",
			rarity: "common",
			unlockedAt: "2019-04-01",
		},
		{
			id: "prolific-writer",
			name: "Prolific Writer",
			description: "Authored 25+ writeups",
			rarity: "rare",
			unlockedAt: "2023-08-15",
		},
		{
			id: "crypto-master",
			name: "Crypto Master",
			description: "Solved 50+ cryptography challenges",
			rarity: "epic",
			unlockedAt: "2023-12-01",
		},
		{
			id: "community-favorite",
			name: "Community Favorite",
			description: "Received 500+ likes on writeups",
			rarity: "legendary",
			unlockedAt: "2024-01-20",
		},
	],
	preferences: {
		profileVisibility: "public" as const,
		emailNotifications: true,
		showLocation: true,
		showEmail: false,
	},
	recentActivity: [
		{
			type: "writeup",
			title: "Breaking RSA with Small Exponent",
			date: "2024-01-15",
			likes: 284,
		},
		{ type: "contest", title: "picoCTF 2024", place: 12, date: "2024-01-10" },
		{
			type: "writeup",
			title: "SQL Injection to RCE",
			date: "2024-01-05",
			likes: 198,
		},
	],
};

const rarityColors = {
	common: "text-gray-400 border-gray-400",
	rare: "text-blue-400 border-blue-400",
	epic: "text-purple-400 border-purple-400",
	legendary: "text-yellow-400 border-yellow-400",
};

function SkillRadar({
	skills,
	skillLevels,
}: {
	skills: string[];
	skillLevels: { [skill: string]: number };
}) {
	const displaySkills = skills.slice(0, 6);
	const levels = displaySkills.map((skill) => skillLevels[skill] || 50);

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

				{displaySkills.map((_, i) => {
					const angle = i * 60 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = levels[i] || 50;
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
					points={displaySkills
						.map((_, i) => {
							const angle = i * 60 - 90;
							const radians = (angle * Math.PI) / 180;
							const level = levels[i] || 50;
							const x = 100 + level * Math.cos(radians);
							const y = 100 + level * Math.sin(radians);
							return `${x},${y}`;
						})
						.join(" ")}
					fill="rgba(34, 197, 94, 0.2)"
					stroke="rgb(34, 197, 94)"
					strokeWidth="2"
				/>

				{displaySkills.map((_, i) => {
					const angle = i * 60 - 90;
					const radians = (angle * Math.PI) / 180;
					const level = levels[i] || 50;
					const x = 100 + level * Math.cos(radians);
					const y = 100 + level * Math.sin(radians);
					return <circle key={i} cx={x} cy={y} r="3" fill="rgb(34, 197, 94)" />;
				})}
			</svg>

			{displaySkills.map((skill, i) => {
				const angle = i * 60 - 90;
				const radians = (angle * Math.PI) / 180;
				const x = 100 + 95 * Math.cos(radians);
				const y = 100 + 95 * Math.sin(radians);

				return (
					<div
						key={skill}
						className="absolute text-xs font-mono text-green-400 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
						style={{ left: `${(x / 200) * 100}%`, top: `${(y / 200) * 100}%` }}
					>
						{skill}
					</div>
				);
			})}
		</div>
	);
}

export default function ProfilePage() {
	const router = useRouter();
	const { user, isAuthenticated } = useAuthStore();
	const [pageLoading, setPageLoading] = useState(true);
	const [userWriteups, setUserWriteups] = useState<WriteupListResponse | null>(
		null
	);
	const [activeTab, setActiveTab] = useState<
		"overview" | "writeups" | "achievements" | "activity" | "settings"
	>("overview");
	const [settingsData, setSettingsData] = useState({
		password: { current: "", new: "", confirm: "" },
		notifications: {
			email: true,
			browser: false,
			contests: true,
			writeups: true,
		},
		connections: { github: "", ctftime: "", discord: "" },
		privacy: { profilePublic: true, showEmail: false, showLocation: true },
	});
	const [loading, setLoading] = useState({
		password: false,
		connections: false,
		saveAll: false,
	});
	const [toast, setToast] = useState<{
		message: string;
		type: "success" | "error";
	} | null>(null);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/");
			return;
		}

		const loadUserData = async () => {
			try {
				// Load user's writeups
				const writeupsResponse = await getUserWriteups(
					user?.id?.toString() || "1",
					1,
					6
				);
				if (writeupsResponse.success) {
					setUserWriteups(writeupsResponse.data || null);
				}
			} catch (error) {
				console.error("Error loading user data:", error);
			} finally {
				setPageLoading(false);
			}
		};

		loadUserData();
	}, [isAuthenticated, user?.id, router]);

	useEffect(() => {
		if (toast) {
			const timer = setTimeout(() => setToast(null), 3000);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [toast]);

	if (!isAuthenticated) {
		return null;
	}

	if (pageLoading) {
		return (
			<MainLayout>
				<div className="flex justify-center items-center min-h-screen">
					<LoadingSpinner />
				</div>
			</MainLayout>
		);
	}

	const profile = mockUserProfile; // In real app, this would come from API

	return (
		<MainLayout>
			<div className="min-h-screen">
				<div className="container mx-auto px-4 py-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
					>
						<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-8">
							<div className="flex flex-col lg:flex-row items-start gap-8">
								{/* Avatar and Basic Info */}
								<div className="flex flex-col items-center text-center lg:text-left">
									<motion.div
										className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-4xl font-bold font-mono text-black mb-4 cursor-pointer"
										style={{ transformStyle: "preserve-3d" }}
										onMouseMove={(e) => {
											const rect = e.currentTarget.getBoundingClientRect();
											const x = (e.clientX - rect.left - rect.width / 2) / 8;
											const y = (e.clientY - rect.top - rect.height / 2) / 8;
											e.currentTarget.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform =
												"perspective(1000px) rotateY(0deg) rotateX(0deg)";
										}}
										whileHover={{ scale: 1.05 }}
										transition={{ type: "spring", stiffness: 300, damping: 30 }}
									>
										{profile.username.slice(0, 2).toUpperCase()}
									</motion.div>
									<h1
										className="text-3xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-2 cursor-pointer hover:scale-105 transition-transform"
										onClick={() => router.push("/teams")}
									>
										{profile.username}
									</h1>
									<div className="flex items-center space-x-2 text-gray-400 font-mono text-sm mb-4">
										<Calendar className="h-4 w-4" />
										<span>
											Joined {new Date(profile.joinedDate).toLocaleDateString()}
										</span>
									</div>
									{profile.location && (
										<div className="flex items-center space-x-2 text-gray-400 font-mono text-sm mb-4">
											<MapPin className="h-4 w-4" />
											<span>{profile.location}</span>
										</div>
									)}
									<div className="flex space-x-4">
										{profile.socialLinks.github && (
											<a
												href={profile.socialLinks.github}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-400 hover:text-green-400 transition-colors"
											>
												<Github className="h-5 w-5" />
											</a>
										)}
										{profile.socialLinks.linkedin && (
											<a
												href={profile.socialLinks.linkedin}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-400 hover:text-green-400 transition-colors"
											>
												<Linkedin className="h-5 w-5" />
											</a>
										)}
										{profile.socialLinks.website && (
											<a
												href={profile.socialLinks.website}
												target="_blank"
												rel="noopener noreferrer"
												className="text-gray-400 hover:text-green-400 transition-colors"
											>
												<Globe className="h-5 w-5" />
											</a>
										)}
									</div>
								</div>

								{/* Bio and Stats */}
								<div className="flex-1">
									<p className="text-gray-300 font-mono text-sm mb-6 leading-relaxed">
										{profile.bio}
									</p>

									<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
										<div className="bg-gray-900/50 rounded-lg p-4 text-center">
											<div className="text-2xl font-bold font-mono text-green-400">
												{profile.statistics.contestsParticipated}
											</div>
											<div className="text-xs text-gray-400 font-mono">
												CONTESTS
											</div>
										</div>
										<div className="bg-gray-900/50 rounded-lg p-4 text-center">
											<div className="text-2xl font-bold font-mono text-blue-400">
												{profile.statistics.writeupsAuthored}
											</div>
											<div className="text-xs text-gray-400 font-mono">
												WRITEUPS
											</div>
										</div>
										<div className="bg-gray-900/50 rounded-lg p-4 text-center">
											<div className="text-2xl font-bold font-mono text-purple-400">
												{profile.statistics.currentRating}
											</div>
											<div className="text-xs text-gray-400 font-mono">
												RATING
											</div>
										</div>
										<div className="bg-gray-900/50 rounded-lg p-4 text-center">
											<div className="text-2xl font-bold font-mono text-yellow-400">
												{profile.statistics.totalViews.toLocaleString()}
											</div>
											<div className="text-xs text-gray-400 font-mono">
												VIEWS
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Navigation Tabs */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="mb-8"
					>
						<div className="flex space-x-1 bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-1">
							{[
								{ id: "overview", label: "OVERVIEW", icon: User },
								{ id: "writeups", label: "WRITEUPS", icon: BookOpen },
								{ id: "achievements", label: "ACHIEVEMENTS", icon: Award },
								{ id: "activity", label: "ACTIVITY", icon: TrendingUp },
								{ id: "settings", label: "SETTINGS", icon: Settings },
							].map((tab) => {
								const Icon = tab.icon;
								return (
									<button
										key={tab.id}
										onClick={() => setActiveTab(tab.id as any)}
										className={`flex items-center space-x-2 px-4 py-2 rounded-md font-mono text-sm transition-all ${
											activeTab === tab.id
												? "bg-green-500/20 text-green-400 border border-green-500/50"
												: "text-gray-400 hover:text-gray-300 hover:bg-gray-700/50"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span>{tab.label}</span>
									</button>
								);
							})}
						</div>
					</motion.div>

					{/* Tab Content */}
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{activeTab === "overview" && (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Skills Radar */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<BarChart className="h-5 w-5 mr-2" />
										SKILL RADAR
									</h3>
									<SkillRadar
										skills={profile.skills}
										skillLevels={profile.skillLevels}
									/>
									<div className="mt-6 space-y-2">
										{profile.skills.map((skill) => (
											<div
												key={skill}
												className="flex justify-between items-center"
											>
												<span className="font-mono text-sm text-gray-300">
													{skill}
												</span>
												<div className="flex items-center space-x-2">
													<div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
														<div
															className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
															style={{
																width: `${(profile.skillLevels as any)[skill] || 0}%`,
															}}
														/>
													</div>
													<span className="font-mono text-xs text-green-400 w-8">
														{(profile.skillLevels as any)[skill] || 0}%
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Recent Activity */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<TrendingUp className="h-5 w-5 mr-2" />
										RECENT ACTIVITY
									</h3>
									<div className="space-y-4">
										{profile.recentActivity.map((activity, index) => (
											<div
												key={index}
												className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg"
											>
												<div className="flex-shrink-0">
													{activity.type === "writeup" ? (
														<BookOpen className="h-5 w-5 text-blue-400" />
													) : (
														<Trophy className="h-5 w-5 text-yellow-400" />
													)}
												</div>
												<div className="flex-1">
													<div className="font-mono text-sm text-white">
														{activity.title}
													</div>
													<div className="font-mono text-xs text-gray-400">
														{new Date(activity.date).toLocaleDateString()}
														{activity.type === "writeup" && activity.likes && (
															<span className="ml-2 text-green-400">
																{activity.likes} likes
															</span>
														)}
														{activity.type === "contest" && activity.place && (
															<span className="ml-2 text-yellow-400">
																#{activity.place}
															</span>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{activeTab === "writeups" && (
							<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
								<div className="flex items-center justify-between mb-6">
									<h3 className="font-mono text-green-400 font-bold flex items-center">
										<BookOpen className="h-5 w-5 mr-2" />
										MY WRITEUPS ({userWriteups?.total || 0})
									</h3>
									<Button
										onClick={() => router.push("/writeups/create")}
										className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
									>
										<Plus className="h-4 w-4 mr-2" />
										NEW WRITEUP
									</Button>
								</div>

								{userWriteups && userWriteups.writeups.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{userWriteups.writeups.map((writeup) => (
											<motion.div
												key={writeup.id}
												whileHover={{ scale: 1.02 }}
												className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 hover:border-green-500/50 transition-all cursor-pointer"
												onClick={() => router.push(`/writeups/${writeup.id}`)}
											>
												<div className="flex items-start justify-between mb-3">
													<Badge
														variant="outline"
														className={`font-mono text-xs ${
															writeup.difficulty === "Easy"
																? "text-green-400 border-green-500/50"
																: writeup.difficulty === "Medium"
																	? "text-yellow-400 border-yellow-500/50"
																	: writeup.difficulty === "Hard"
																		? "text-red-400 border-red-500/50"
																		: "text-purple-400 border-purple-500/50"
														}`}
													>
														{writeup.difficulty.toUpperCase()}
													</Badge>
													<div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
														<div className="flex items-center space-x-1">
															<Eye className="h-3 w-3" />
															<span>{writeup.views}</span>
														</div>
														<div className="flex items-center space-x-1">
															<span>❤️</span>
															<span>{writeup.likes}</span>
														</div>
													</div>
												</div>

												<h4 className="font-mono text-white font-bold mb-2 line-clamp-2">
													{writeup.title}
												</h4>

												<p className="text-gray-400 text-sm font-mono mb-3 line-clamp-2">
													{writeup.description}
												</p>

												<div className="flex items-center justify-between">
													<div className="flex flex-wrap gap-1">
														{writeup.tags.slice(0, 3).map((tag) => (
															<Badge
																key={tag}
																variant="outline"
																className="font-mono text-xs text-blue-400 border-blue-500/50"
															>
																#{tag}
															</Badge>
														))}
														{writeup.tags.length > 3 && (
															<Badge
																variant="outline"
																className="font-mono text-xs text-gray-400 border-gray-500/50"
															>
																+{writeup.tags.length - 3}
															</Badge>
														)}
													</div>
													<span className="text-xs text-gray-500 font-mono">
														{new Date(writeup.createdAt).toLocaleDateString()}
													</span>
												</div>
											</motion.div>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
										<h4 className="font-mono text-gray-400 text-lg mb-2">
											No writeups yet
										</h4>
										<p className="font-mono text-gray-500 text-sm mb-6">
											Share your knowledge with the community
										</p>
										<Button
											onClick={() => router.push("/writeups/create")}
											className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
										>
											<Plus className="h-4 w-4 mr-2" />
											CREATE YOUR FIRST WRITEUP
										</Button>
									</div>
								)}
							</div>
						)}

						{activeTab === "achievements" && (
							<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
								<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
									<Award className="h-5 w-5 mr-2" />
									ACHIEVEMENTS ({profile.achievements.length})
								</h3>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{profile.achievements.map((achievement) => (
										<motion.div
											key={achievement.id}
											whileHover={{ scale: 1.05 }}
											className={`bg-gray-900/50 border rounded-lg p-4 ${(rarityColors as any)[achievement.rarity]}`}
										>
											<div className="flex items-center space-x-3 mb-3">
												<div
													className={`w-12 h-12 rounded-full bg-gradient-to-r ${
														achievement.rarity === "common"
															? "from-gray-500 to-gray-600"
															: achievement.rarity === "rare"
																? "from-blue-500 to-blue-600"
																: achievement.rarity === "epic"
																	? "from-purple-500 to-purple-600"
																	: "from-yellow-500 to-yellow-600"
													} flex items-center justify-center`}
												>
													<Award className="h-6 w-6 text-white" />
												</div>
												<div>
													<h4 className="font-mono font-bold text-sm">
														{achievement.name}
													</h4>
													<p className="font-mono text-xs opacity-75">
														{achievement.rarity.toUpperCase()}
													</p>
												</div>
											</div>
											<p className="font-mono text-xs text-gray-400 mb-2">
												{achievement.description}
											</p>
											<p className="font-mono text-xs text-gray-500">
												Unlocked:{" "}
												{new Date(achievement.unlockedAt).toLocaleDateString()}
											</p>
										</motion.div>
									))}
								</div>
							</div>
						)}

						{activeTab === "activity" && (
							<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
								<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
									<TrendingUp className="h-5 w-5 mr-2" />
									ACTIVITY TIMELINE
								</h3>

								<div className="space-y-6">
									{profile.recentActivity.map((activity, index) => (
										<div key={index} className="flex items-start space-x-4">
											<div className="flex-shrink-0">
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center ${
														activity.type === "writeup"
															? "bg-blue-500/20 text-blue-400"
															: "bg-yellow-500/20 text-yellow-400"
													}`}
												>
													{activity.type === "writeup" ? (
														<BookOpen className="h-5 w-5" />
													) : (
														<Trophy className="h-5 w-5" />
													)}
												</div>
											</div>
											<div className="flex-1 bg-gray-900/50 rounded-lg p-4">
												<div className="flex items-center justify-between mb-2">
													<h4 className="font-mono text-white font-bold">
														{activity.title}
													</h4>
													<span className="font-mono text-xs text-gray-400">
														{new Date(activity.date).toLocaleDateString()}
													</span>
												</div>
												<div className="flex items-center space-x-4 text-sm font-mono text-gray-400">
													{activity.type === "writeup" && activity.likes && (
														<span className="flex items-center space-x-1">
															<span>❤️</span>
															<span>{activity.likes} likes</span>
														</span>
													)}
													{activity.type === "contest" && activity.place && (
														<span className="flex items-center space-x-1">
															<Trophy className="h-4 w-4" />
															<span>#{activity.place} place</span>
														</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{activeTab === "settings" && (
							<div className="space-y-8">
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Lock className="h-5 w-5 mr-2" />
										CHANGE PASSWORD
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<label className="block font-mono text-sm text-gray-300 mb-2">
												CURRENT PASSWORD
											</label>
											<input
												type="password"
												value={settingsData.password.current}
												onChange={(e) =>
													setSettingsData((prev) => ({
														...prev,
														password: {
															...prev.password,
															current: e.target.value,
														},
													}))
												}
												className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-green-500 focus:outline-none"
												placeholder="Enter current password"
											/>
										</div>
										<div>
											<label className="block font-mono text-sm text-gray-300 mb-2">
												NEW PASSWORD
											</label>
											<input
												type="password"
												value={settingsData.password.new}
												onChange={(e) =>
													setSettingsData((prev) => ({
														...prev,
														password: { ...prev.password, new: e.target.value },
													}))
												}
												className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-green-500 focus:outline-none"
												placeholder="Enter new password"
											/>
										</div>
										<div>
											<label className="block font-mono text-sm text-gray-300 mb-2">
												CONFIRM PASSWORD
											</label>
											<input
												type="password"
												value={settingsData.password.confirm}
												onChange={(e) =>
													setSettingsData((prev) => ({
														...prev,
														password: {
															...prev.password,
															confirm: e.target.value,
														},
													}))
												}
												className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-green-500 focus:outline-none"
												placeholder="Confirm new password"
											/>
										</div>
									</div>
									<Button
										className="mt-4 font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
										onClick={async () => {
											setLoading((prev) => ({ ...prev, password: true }));
											try {
												const result = await changePassword({
													currentPassword: settingsData.password.current,
													newPassword: settingsData.password.new,
													confirmPassword: settingsData.password.confirm,
												});
												if (result.success) {
													setSettingsData((prev) => ({
														...prev,
														password: { current: "", new: "", confirm: "" },
													}));
												}
												setToast({
													message: result.message,
													type: result.success ? "success" : "error",
												});
											} finally {
												setLoading((prev) => ({ ...prev, password: false }));
											}
										}}
										disabled={loading.password}
									>
										<Key className="h-4 w-4 mr-2" />
										{loading.password ? "UPDATING..." : "UPDATE PASSWORD"}
									</Button>
								</div>

								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Link className="h-5 w-5 mr-2" />
										CONNECTED SERVICES
									</h3>
									<div className="space-y-4">
										<div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
											<div className="flex items-center space-x-3">
												<Github className="h-6 w-6 text-gray-300" />
												<div>
													<div className="font-mono text-white font-bold">
														GitHub
													</div>
													<div className="font-mono text-xs text-gray-400">
														Connect your GitHub account
													</div>
												</div>
											</div>
											<Button
												variant="outline"
												className="font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
												onClick={async () => {
													setLoading((prev) => ({
														...prev,
														connections: true,
													}));
													try {
														const result = await connectGithub();
														if (result.success && result.url) {
															window.open(result.url, "_blank");
														}
													} finally {
														setLoading((prev) => ({
															...prev,
															connections: false,
														}));
													}
												}}
												disabled={loading.connections}
											>
												{loading.connections ? "CONNECTING..." : "CONNECT"}
											</Button>
										</div>
										<div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
											<div className="flex items-center space-x-3">
												<Trophy className="h-6 w-6 text-orange-400" />
												<div>
													<div className="font-mono text-white font-bold">
														CTFtime
													</div>
													<div className="font-mono text-xs text-gray-400">
														Sync your CTF history and ratings
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<input
													type="text"
													value={settingsData.connections.ctftime}
													onChange={(e) =>
														setSettingsData((prev) => ({
															...prev,
															connections: {
																...prev.connections,
																ctftime: e.target.value,
															},
														}))
													}
													className="bg-gray-900/50 border border-gray-600 rounded px-3 py-1 font-mono text-sm text-white focus:border-green-500 focus:outline-none w-32"
													placeholder="Team ID"
												/>
												<Button
													variant="outline"
													className="font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
													onClick={async () => {
														setLoading((prev) => ({
															...prev,
															connections: true,
														}));
														try {
															const result = await updateConnections(
																settingsData.connections
															);
															setToast({
																message: result.message,
																type: result.success ? "success" : "error",
															});
														} finally {
															setLoading((prev) => ({
																...prev,
																connections: false,
															}));
														}
													}}
													disabled={loading.connections}
												>
													{loading.connections ? "LINKING..." : "LINK"}
												</Button>
											</div>
										</div>
										<div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
											<div className="flex items-center space-x-3">
												<div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-xs">
													D
												</div>
												<div>
													<div className="font-mono text-white font-bold">
														Discord
													</div>
													<div className="font-mono text-xs text-gray-400">
														Join team communications
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												<input
													type="text"
													value={settingsData.connections.discord}
													onChange={(e) =>
														setSettingsData((prev) => ({
															...prev,
															connections: {
																...prev.connections,
																discord: e.target.value,
															},
														}))
													}
													className="bg-gray-900/50 border border-gray-600 rounded px-3 py-1 font-mono text-sm text-white focus:border-green-500 focus:outline-none w-40"
													placeholder="username#1234"
												/>
												<Button
													variant="outline"
													className="font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
													onClick={async () => {
														setLoading((prev) => ({
															...prev,
															connections: true,
														}));
														try {
															const result = await updateConnections(
																settingsData.connections
															);
															setToast({
																message: result.message,
																type: result.success ? "success" : "error",
															});
														} finally {
															setLoading((prev) => ({
																...prev,
																connections: false,
															}));
														}
													}}
													disabled={loading.connections}
												>
													{loading.connections ? "SAVING..." : "SAVE"}
												</Button>
											</div>
										</div>
									</div>
								</div>

								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Bell className="h-5 w-5 mr-2" />
										NOTIFICATIONS
									</h3>
									<div className="space-y-4">
										{[
											{
												key: "email",
												label: "Email Notifications",
												desc: "Receive updates via email",
											},
											{
												key: "browser",
												label: "Browser Notifications",
												desc: "Show desktop notifications",
											},
											{
												key: "contests",
												label: "Contest Updates",
												desc: "New contests and reminders",
											},
											{
												key: "writeups",
												label: "Writeup Activity",
												desc: "Comments and likes on your writeups",
											},
										].map((item) => (
											<div
												key={item.key}
												className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
											>
												<div>
													<div className="font-mono text-white font-bold">
														{item.label}
													</div>
													<div className="font-mono text-xs text-gray-400">
														{item.desc}
													</div>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={
															(settingsData.notifications as any)[item.key]
														}
														onChange={(e) =>
															setSettingsData((prev) => ({
																...prev,
																notifications: {
																	...prev.notifications,
																	[item.key]: e.target.checked,
																},
															}))
														}
														className="sr-only"
													/>
													<div
														className={`w-11 h-6 rounded-full transition-colors ${(settingsData.notifications as any)[item.key] ? "bg-green-500" : "bg-gray-600"}`}
													>
														<div
															className={`w-5 h-5 bg-white rounded-full transition-transform ${(settingsData.notifications as any)[item.key] ? "translate-x-5" : "translate-x-0.5"} mt-0.5`}
														/>
													</div>
												</label>
											</div>
										))}
									</div>
								</div>

								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Shield className="h-5 w-5 mr-2" />
										PRIVACY SETTINGS
									</h3>
									<div className="space-y-4">
										{[
											{
												key: "profilePublic",
												label: "Public Profile",
												desc: "Allow others to view your profile",
											},
											{
												key: "showEmail",
												label: "Show Email",
												desc: "Display email on public profile",
											},
											{
												key: "showLocation",
												label: "Show Location",
												desc: "Display location on profile",
											},
										].map((item) => (
											<div
												key={item.key}
												className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg"
											>
												<div>
													<div className="font-mono text-white font-bold">
														{item.label}
													</div>
													<div className="font-mono text-xs text-gray-400">
														{item.desc}
													</div>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={(settingsData.privacy as any)[item.key]}
														onChange={(e) =>
															setSettingsData((prev) => ({
																...prev,
																privacy: {
																	...prev.privacy,
																	[item.key]: e.target.checked,
																},
															}))
														}
														className="sr-only"
													/>
													<div
														className={`w-11 h-6 rounded-full transition-colors ${(settingsData.privacy as any)[item.key] ? "bg-green-500" : "bg-gray-600"}`}
													>
														<div
															className={`w-5 h-5 bg-white rounded-full transition-transform ${(settingsData.privacy as any)[item.key] ? "translate-x-5" : "translate-x-0.5"} mt-0.5`}
														/>
													</div>
												</label>
											</div>
										))}
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold px-8"
										onClick={async () => {
											setLoading((prev) => ({ ...prev, saveAll: true }));
											try {
												await Promise.all([
													updateNotifications(settingsData.notifications),
													updatePrivacy(settingsData.privacy),
												]);
												setToast({
													message: "All settings saved successfully!",
													type: "success",
												});
											} finally {
												setLoading((prev) => ({ ...prev, saveAll: false }));
											}
										}}
										disabled={loading.saveAll}
									>
										<Save className="h-4 w-4 mr-2" />
										{loading.saveAll ? "SAVING..." : "SAVE ALL SETTINGS"}
									</Button>
								</div>
							</div>
						)}
					</motion.div>
				</div>
			</div>
			{toast && (
				<div className="fixed bottom-4 right-4 z-50">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
						className={`px-6 py-3 rounded-lg font-mono text-sm border ${
							toast.type === "success"
								? "bg-green-500/20 text-green-400 border-green-500/50"
								: "bg-red-500/20 text-red-400 border-red-500/50"
						}`}
					>
						{toast.message}
					</motion.div>
				</div>
			)}
		</MainLayout>
	);
}
