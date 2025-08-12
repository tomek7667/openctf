"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { User as UserType } from "@/types/api";
import {
	ArrowLeft,
	Save,
	Github,
	Linkedin,
	Globe,
	User,
	Eye,
	EyeOff,
	X,
	Link as LinkIcon,
	Terminal,
	ShieldCheck,
	ShieldUnchecked,
} from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import "./slider.css";
import {
	getUserProfile,
	skillsNames,
	updateUserProfile,
	UserProfile,
} from "@/api";
import useToast from "@/hooks/useToast";

export default function EditProfilePage() {
	const router = useRouter();
	const { isAuthenticated, token, user } = useAuthStore();

	const [pageLoading, setPageLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	// Form state

	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [newProfile, setNewProfile] = useState<UserProfile | null>(null);
	const [newUser, setNewUser] = useState<UserType | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/");
			return;
		}

		const loadUserData = async () => {
			try {
				const profileResponse = await getUserProfile(token!);
				setNewProfile(profileResponse.userProfile);
				setProfile(profileResponse.userProfile);
			} catch (error: any) {
				console.error("Error loading user data:", error);
				toast.error(
					"an error occured while loading user profile",
					error?.message ?? "error loading user data"
				);
			} finally {
				setPageLoading(false);
			}
		};

		loadUserData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, router, token]);

	useEffect(() => {
		if (user !== null) {
			setNewUser(user);
		}
	}, [user]);

	const handleSave = async () => {
		setSaving(true);
		try {
			await Promise.all([
				updateUserProfile(token!, newProfile!),
				// update user acc too
			]);

			router.push("/profile");
		} catch (error: any) {
			console.error("Error saving profile:", error);
			toast.error(
				"an error occured while saving user profile",
				error?.message ?? "error saving user data"
			);
		} finally {
			setSaving(false);
		}
	};

	if (!isAuthenticated) {
		return null;
	}

	if (
		pageLoading ||
		user === null ||
		token === null ||
		newUser === null ||
		newProfile === null ||
		profile === null
	) {
		return (
			<MainLayout>
				<div className="flex justify-center items-center min-h-screen">
					<LoadingSpinner />
				</div>
			</MainLayout>
		);
	}

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
						<Button
							variant="outline"
							onClick={() => router.back()}
							className="mb-6 font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							BACK TO PROFILE
						</Button>

						<div className="text-center mb-8">
							<h1 className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 mb-4">
								[EDIT PROFILE]
							</h1>
							<div className="flex items-center justify-center space-x-2 text-green-400">
								<Terminal className="h-5 w-5" />
								<span className="text-lg font-mono">
									&gt; Configure your hacker identity
								</span>
								<div className="w-2 h-5 bg-green-400 animate-pulse" />
							</div>
						</div>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Main Form */}
						<div className="lg:col-span-2 space-y-6">
							{/* Basic Information */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
							>
								<h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
									<User className="h-5 w-5 mr-2" />
									BASIC INFORMATION
								</h2>

								<div className="space-y-4">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												className={`block text-sm font-mono text-green-400 mb-2 ${user.username !== newUser.username && "italic"}`}
											>
												{user.username !== newUser.username && "*"} USERNAME
											</label>
											<Input
												value={newUser.username}
												onChange={(e) => {
													setNewUser((prev) => {
														if (prev === null) {
															return null;
														}
														return {
															...prev,
															username: e.target.value,
														};
													});
												}}
												className="font-mono bg-gray-800/50 border-green-500/30 text-white"
											/>
										</div>
										<div>
											<label
												className={`block text-sm font-mono text-green-400 mb-2 ${newUser.email !== user.email && "italic"}`}
											>
												{newUser.email !== user.email && "*"} EMAIL{" "}
												{newUser.email_confirmed_at !== null &&
												newUser.email === user.email ? (
													<ShieldCheck className="h-4 w-4" />
												) : (
													<ShieldUnchecked className="h-4 w-4" />
												)}
											</label>
											<Input
												value={newUser.email}
												onChange={(e) => {
													setNewUser((prev) => {
														if (prev === null) {
															return null;
														}
														return {
															...prev,
															email: e.target.value,
														};
													});
												}}
												className="font-mono bg-gray-800/50 border-green-500/30 text-white"
												type="email"
											/>
											<p className="text-xs font-mono text-gray-500 mt-1">
												You&apos;ll have to confirm after a change
											</p>
										</div>
									</div>

									<div>
										<label
											className={`block text-sm font-mono text-green-400 mb-2 ${newUser.description !== user.description && "italic"}`}
										>
											{newUser.description !== user.description && "*"} BIO
										</label>
										<Input
											value={newUser.description}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												setNewUser((prev) => {
													if (prev === null) {
														return null;
													}
													return {
														...prev,
														description: e.target.value,
													};
												});
											}}
											placeholder="Tell the community about yourself..."
											className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
											multiline
											rows={4}
										/>
									</div>

									<div>
										<label
											className={`block text-sm font-mono text-green-400 mb-2 ${profile.location !== newProfile.location && "italic"}`}
										>
											{profile.location !== newProfile.location && "* "}
											LOCATION
										</label>
										<Input
											value={newProfile.location ?? ""}
											onChange={(e) => {
												setNewProfile((prev) => {
													if (prev === null) {
														return null;
													}
													return {
														...prev,
														location:
															e.target.value === "" ? null : e.target.value,
													};
												});
											}}
											placeholder="e.g. San Francisco, CA"
											className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
										/>
									</div>
								</div>
							</motion.div>

							{/* Social Links */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 }}
								className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
							>
								<h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
									<LinkIcon className="h-5 w-5 mr-2" />
									SOCIAL LINKS
								</h2>

								<div className="space-y-4">
									{[
										{
											key: "github",
											label: "GitHub",
											icon: Github,
											placeholder: "https://github.com/username",
										},
										{
											key: "linkedin",
											label: "LinkedIn",
											icon: Linkedin,
											placeholder: "https://linkedin.com/in/username",
										},
										{
											key: "twitter",
											label: "Twitter",
											icon: LinkIcon,
											placeholder: "https://twitter.com/username",
										},
										{
											key: "website",
											label: "Website",
											icon: Globe,
											placeholder: "https://yourwebsite.com",
										},
									].map(({ key, label, icon: _Icon, placeholder }) => (
										<div key={key}>
											<label
												className={`block text-sm font-mono text-green-400 mb-2 ${profile[`${key as "github" | "linkedin" | "twitter" | "website"}_link`] !== newProfile[`${key as "github" | "linkedin" | "twitter" | "website"}_link`] && "italic"}`}
											>
												{profile[
													`${key as "github" | "linkedin" | "twitter" | "website"}_link`
												] !==
													newProfile[
														`${key as "github" | "linkedin" | "twitter" | "website"}_link`
													] && "* "}
												{label.toUpperCase()}
											</label>
											<Input
												value={
													newProfile[
														`${
															key as
																| "github"
																| "linkedin"
																| "twitter"
																| "website"
														}_link`
													]!
												}
												onChange={(e) => {
													setNewProfile((prev) => {
														if (prev === null) {
															return null;
														}
														return {
															...prev,
															[`${key}_link`]:
																e.target.value === "" ? null : e.target.value,
														};
													});
												}}
												placeholder={placeholder}
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
											/>
										</div>
									))}
								</div>
							</motion.div>

							{/* Skills & Expertise */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
							>
								<h2 className="font-mono text-green-400 font-bold mb-6">
									SKILLS & EXPERTISE
								</h2>

								{/* Skills with Levels */}
								<div className="mb-6">
									<label
										className={`block text-sm font-mono text-green-400 mb-3 ${skillsNames.some((skill) => profile[`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`] !== newProfile[`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`]) && "italic"}`}
									>
										{skillsNames.some(
											(skill) =>
												profile[
													`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
												] !==
												newProfile[
													`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
												]
										) && "* "}
										TECHNICAL SKILLS & LEVELS
									</label>
									<div className="space-y-3">
										{skillsNames.map((skill) => (
											<div
												key={skill}
												className="bg-gray-900/50 border border-gray-700 rounded-lg p-4"
											>
												<div className="flex items-center justify-between mb-2">
													<span
														className={`font-mono text-green-400 font-bold ${profile[`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`] !== newProfile[`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`] && "italic"}`}
													>
														{profile[
															`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
														] !==
															newProfile[
																`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
															] && "* "}
														{skill}
													</span>
													<Button
														variant="outline"
														size="sm"
														onClick={() => {
															// removeSkill(skill); // TODO: remove
														}}
														className="font-mono border-red-500/50 text-red-400 hover:bg-red-500/10"
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
												<div className="flex items-center space-x-3">
													<span className="font-mono text-gray-400 text-sm min-w-[60px]">
														Level:
													</span>
													<input
														type="range"
														min="0"
														max="100"
														value={
															newProfile[
																`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
															]
														}
														onChange={(e) => {
															setNewProfile((prev) => {
																if (prev === null) {
																	return null;
																}
																return {
																	...prev,
																	[`${skill}_skill_level`]: parseInt(
																		e.target.value
																	),
																};
															});
														}}
														className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
													/>
													<span className="font-mono text-green-400 font-bold min-w-[40px] text-right">
														{
															newProfile[
																`${skill as "web" | "rev" | "pwn" | "crypto" | "misc"}_skill_level`
															]
														}
														%
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Privacy Settings */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.1 }}
								className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
							>
								<h3 className="font-mono text-green-400 font-bold mb-4">
									PRIVACY SETTINGS
								</h3>
								<div className="space-y-4">
									{[
										{
											key: "show_email",
											label: "Show Email",
										},
										{
											key: "show_location",
											label: "Show Location",
										},
									].map(({ key, label }) => (
										<div
											key={key}
											className="flex items-center justify-between"
										>
											<span
												className={`font-mono text-gray-300 text-sm ${profile[key as "show_email" | "show_location"] !== newProfile[key as "show_email" | "show_location"] && "italic"}`}
											>
												{profile[key as "show_email" | "show_location"] !==
													newProfile[key as "show_email" | "show_location"] &&
													"* "}
												{label}
											</span>

											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setNewProfile((prev) => {
														if (prev === null) {
															return null;
														}
														return {
															...prev,
															[key as "show_email" | "show_location"]:
																!prev[key as "show_email" | "show_location"],
														};
													});
												}}
												className={`font-mono text-xs ${
													newProfile[key as "show_email" | "show_location"]
														? "border-green-500/50 text-green-400"
														: "border-red-500/50 text-red-400"
												}`}
											>
												{newProfile[key as "show_email" | "show_location"] ? (
													<>
														<Eye className="h-3 w-3 mr-1" />
														ON
													</>
												) : (
													<>
														<EyeOff className="h-3 w-3 mr-1" />
														OFF
													</>
												)}
											</Button>
										</div>
									))}
								</div>
							</motion.div>

							{/* Actions */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.3 }}
								className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
							>
								<h3 className="font-mono text-green-400 font-bold mb-4">
									ACTIONS
								</h3>
								<div className="space-y-3">
									<Button
										onClick={handleSave}
										disabled={saving}
										className="w-full font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
									>
										<Save className="h-4 w-4 mr-2" />
										{saving ? "SAVING..." : "SAVE CHANGES"}
									</Button>
									<Button
										variant="outline"
										onClick={() => router.push("/profile")}
										className="w-full font-mono border-gray-500 text-gray-400"
									>
										CANCEL
									</Button>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
