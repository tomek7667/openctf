"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Users, Save, X, Settings } from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { createTeam, Team } from "@/api/teams";
import { getPopularCountries } from "@/lib/countries";
import { Flag } from "@/components/ui/Flag";

const availableSkills = [
	"Web Security",
	"Cryptography",
	"Reverse Engineering",
	"Binary Exploitation",
	"Digital Forensics",
	"Network Security",
	"Mobile Security",
	"Hardware Hacking",
	"OSINT",
	"Malware Analysis",
	"Penetration Testing",
	"Social Engineering",
	"Python",
	"JavaScript",
	"C/C++",
	"Assembly",
	"Go",
	"Rust",
	"Java",
];

export default function CreateTeamPage() {
	const router = useRouter();
	const { user, isAuthenticated } = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [step, setStep] = useState(1);

	// Form data
	const [teamData, setTeamData] = useState({
		name: "",
		description: "",
		logoUrl: "",
		bannerUrl: "",

		country: "",
		maxMembers: 10,
		website: "",
		discord: "",
		github: "",

		// Recruitment settings
		isRecruiting: false,
		recruitmentDescription: "",
		requiredSkills: [] as string[],
		preferredSkills: [] as string[],
		minExperience: "",
		timeCommitment: "",
		contactMethod: "application" as "application" | "invitation_only",

		// Team settings
		allowApplications: true,
		requireApproval: true,
	});

	const [newRequiredSkill, setNewRequiredSkill] = useState("");
	const [newPreferredSkill, setNewPreferredSkill] = useState("");
	const [countrySearch, setCountrySearch] = useState("");
	const [showCountryDropdown, setShowCountryDropdown] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState<{
		code: string;
		name: string;
	} | null>(null);
	const [highlightedIndex, setHighlightedIndex] = useState(0);
	const [showRequiredSkillsDropdown, setShowRequiredSkillsDropdown] =
		useState(false);
	const [showPreferredSkillsDropdown, setShowPreferredSkillsDropdown] =
		useState(false);
	const [highlightedRequiredIndex, setHighlightedRequiredIndex] = useState(0);
	const [highlightedPreferredIndex, setHighlightedPreferredIndex] = useState(0);

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/teams");
		}
	}, [isAuthenticated, router]);

	useEffect(() => {
		const handleClickOutside = () => {
			if (showCountryDropdown) {
				setShowCountryDropdown(false);
			}
			if (showRequiredSkillsDropdown) {
				setShowRequiredSkillsDropdown(false);
			}
			if (showPreferredSkillsDropdown) {
				setShowPreferredSkillsDropdown(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [
		showCountryDropdown,
		showRequiredSkillsDropdown,
		showPreferredSkillsDropdown,
	]);

	const removeRequiredSkill = (skill: string) => {
		setTeamData((prev) => ({
			...prev,
			requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
		}));
	};

	const removePreferredSkill = (skill: string) => {
		setTeamData((prev) => ({
			...prev,
			preferredSkills: prev.preferredSkills.filter((s) => s !== skill),
		}));
	};

	const handleSubmit = async () => {
		if (!teamData.name.trim() || !teamData.description.trim()) {
			return;
		}

		setLoading(true);
		try {
			const team: Partial<Team> = {
				name: teamData.name,
				description: teamData.description,
				...(teamData.logoUrl.trim() && { logoUrl: teamData.logoUrl.trim() }),
				...(teamData.bannerUrl.trim() && {
					bannerUrl: teamData.bannerUrl.trim(),
				}),
				privacy: "public",
				...(teamData.country && { country: teamData.country }),
				socialLinks: {
					...(teamData.website.trim() && { website: teamData.website.trim() }),
					...(teamData.discord.trim() && { discord: teamData.discord.trim() }),
					...(teamData.github.trim() && { github: teamData.github.trim() }),
				},
				recruitment: {
					isRecruiting: teamData.isRecruiting,
					...(teamData.recruitmentDescription && {
						description: teamData.recruitmentDescription,
					}),
					requiredSkills: teamData.requiredSkills,
					preferredSkills: teamData.preferredSkills,
					...(teamData.minExperience && {
						minExperience: teamData.minExperience,
					}),
					...(teamData.timeCommitment && {
						timeCommitment: teamData.timeCommitment,
					}),
					contactMethod: teamData.contactMethod,
				},
				settings: {
					allowApplications: teamData.allowApplications,
					requireApproval: teamData.requireApproval,
					visibilityLevel: "public",
				},
			};

			const response = await createTeam(team, user?.id?.toString() || "");
			if (response.success && response.data) {
				router.push(`/teams/${response.data.id}`);
			}
		} catch (error) {
			console.error("Error creating team:", error);
		} finally {
			setLoading(false);
		}
	};

	if (!isAuthenticated) {
		return null;
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
							BACK TO TEAMS
						</Button>

						<div className="text-center mb-8">
							<h1 className="text-2xl font-bold font-mono text-foreground mb-2">
								CREATE_TEAM
							</h1>
							<p className="text-sm text-muted-foreground font-mono">
								Set up your cybersecurity team
							</p>
						</div>

						{/* Progress Steps */}
						<div className="flex justify-center mb-8">
							<div className="flex items-center space-x-4">
								{[
									{ step: 1, label: "Basic Info" },
									{ step: 2, label: "Recruitment" },
									{ step: 3, label: "Summary" },
								].map(({ step: stepNum, label }) => (
									<div key={stepNum} className="flex items-center">
										<div
											className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold ${
												step >= stepNum
													? "border-green-400 bg-green-400/20 text-green-400"
													: "border-gray-600 text-gray-600"
											}`}
										>
											{stepNum}
										</div>
										<span
											className={`ml-2 font-mono text-sm ${step >= stepNum ? "text-green-400" : "text-gray-600"}`}
										>
											{label}
										</span>
										{stepNum < 3 && (
											<div
												className={`w-12 h-0.5 mx-4 ${step > stepNum ? "bg-green-400" : "bg-gray-600"}`}
											/>
										)}
									</div>
								))}
							</div>
						</div>
					</motion.div>

					<div className="max-w-4xl mx-auto">
						{/* Step 1: Basic Information */}
						{step === 1 && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className="space-y-6"
							>
								{/* Team Details */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6 relative z-50">
									<h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Users className="h-5 w-5 mr-2" />
										TEAM DETAILS
									</h2>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												TEAM NAME *
											</label>
											<Input
												value={teamData.name}
												onChange={(e) =>
													setTeamData((prev) => ({
														...prev,
														name: e.target.value,
													}))
												}
												placeholder="Enter your team name..."
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												DESCRIPTION *
											</label>
											<Input
												value={teamData.description}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
													setTeamData((prev) => ({
														...prev,
														description: e.target.value,
													}))
												}
												placeholder="Describe your team's focus and goals..."
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												multiline
												rows={4}
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												COUNTRY
											</label>
											<div className="relative">
												<Input
													value={
														selectedCountry
															? selectedCountry.name
															: countrySearch
													}
													onChange={(e) => {
														setCountrySearch(e.target.value);
														setSelectedCountry(null);
														setTeamData((prev) => ({ ...prev, country: "" }));
														setShowCountryDropdown(true);
														setHighlightedIndex(0);
													}}
													onFocus={() => setShowCountryDropdown(true)}
													onKeyDown={(e) => {
														const filtered = getPopularCountries().filter(
															(country) =>
																country.name
																	.toLowerCase()
																	.includes(countrySearch.toLowerCase())
														);

														if (e.key === "ArrowDown") {
															e.preventDefault();
															setHighlightedIndex((prev) =>
																prev < filtered.length - 1 ? prev + 1 : 0
															);
														} else if (e.key === "ArrowUp") {
															e.preventDefault();
															setHighlightedIndex((prev) =>
																prev > 0 ? prev - 1 : filtered.length - 1
															);
														} else if (e.key === "Enter") {
															e.preventDefault();
															if (
																filtered.length > 0 &&
																filtered[highlightedIndex]
															) {
																const country = filtered[highlightedIndex];
																setTeamData((prev) => ({
																	...prev,
																	country: country.code,
																}));
																setSelectedCountry(country);
																setCountrySearch("");
																setShowCountryDropdown(false);
																setHighlightedIndex(0);
															}
														}
													}}
													placeholder="Search country..."
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
												{showCountryDropdown && (
													<div className="absolute z-[200] w-full mt-1 bg-gray-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
														{getPopularCountries()
															.filter((country) =>
																country.name
																	.toLowerCase()
																	.includes(countrySearch.toLowerCase())
															)
															.map((country, index) => (
																<button
																	key={country.code}
																	type="button"
																	role="option"
																	aria-selected={index === highlightedIndex}
																	onMouseDown={(e) => {
																		e.preventDefault();
																		setTeamData((prev) => ({
																			...prev,
																			country: country.code,
																		}));
																		setSelectedCountry(country);
																		setCountrySearch("");
																		setShowCountryDropdown(false);
																		setHighlightedIndex(0);
																	}}
																	onMouseEnter={() =>
																		setHighlightedIndex(index)
																	}
																	className={`inline-flex w-full items-center gap-3 px-3 py-2 text-left font-mono text-white
              first:rounded-t-lg last:rounded-b-lg transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
              ${
								index === highlightedIndex
									? "bg-emerald-500/30 ring-1 ring-emerald-400/30"
									: "hover:bg-emerald-500/20 hover:ring-1 hover:ring-emerald-400/20"
							}`}
																>
																	<div className="shrink-0 rounded overflow-hidden">
																		<Flag
																			code={country.code}
																			props={{
																				width: 24,
																				height: 16,
																				style: { display: "block" },
																			}}
																		/>
																	</div>

																	{/* Country name grows and is centered vertically */}
																	<span className="flex-1 self-center leading-tight truncate">
																		{country.name}
																	</span>
																</button>
															))}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Media & Links */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6 relative z-10">
									<h2 className="font-mono text-green-400 font-bold mb-6">
										MEDIA & LINKS
									</h2>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												TEAM LOGO URL
											</label>
											<Input
												value={teamData.logoUrl}
												onChange={(e) =>
													setTeamData((prev) => ({
														...prev,
														logoUrl: e.target.value,
													}))
												}
												placeholder="https://example.com/logo.png"
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
											/>
										</div>

										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												BANNER IMAGE URL
											</label>
											<Input
												value={teamData.bannerUrl}
												onChange={(e) =>
													setTeamData((prev) => ({
														...prev,
														bannerUrl: e.target.value,
													}))
												}
												placeholder="https://example.com/banner.png"
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													WEBSITE
												</label>
												<Input
													value={teamData.website}
													onChange={(e) =>
														setTeamData((prev) => ({
															...prev,
															website: e.target.value,
														}))
													}
													placeholder="https://team.example.com"
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
											</div>

											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													DISCORD
												</label>
												<Input
													value={teamData.discord}
													onChange={(e) =>
														setTeamData((prev) => ({
															...prev,
															discord: e.target.value,
														}))
													}
													placeholder="https://discord.gg/team"
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
											</div>

											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													GITHUB
												</label>
												<Input
													value={teamData.github}
													onChange={(e) =>
														setTeamData((prev) => ({
															...prev,
															github: e.target.value,
														}))
													}
													placeholder="https://github.com/team"
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										onClick={() => setStep(2)}
										disabled={
											!teamData.name.trim() || !teamData.description.trim()
										}
										className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
									>
										NEXT: RECRUITMENT
									</Button>
								</div>
							</motion.div>
						)}

						{/* Step 2: Recruitment */}
						{step === 2 && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className="space-y-6"
							>
								{/* Recruitment Toggle */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<div className="flex items-center justify-between mb-6">
										<h2 className="font-mono text-green-400 font-bold flex items-center">
											<Users className="h-5 w-5 mr-2" />
											RECRUITMENT STATUS
										</h2>
										<Button
											variant="outline"
											onClick={() =>
												setTeamData((prev) => ({
													...prev,
													isRecruiting: !prev.isRecruiting,
												}))
											}
											className={`font-mono ${
												teamData.isRecruiting
													? "border-green-500/50 text-green-400"
													: "border-gray-500/50 text-gray-400"
											}`}
										>
											{teamData.isRecruiting ? "RECRUITING" : "NOT RECRUITING"}
										</Button>
									</div>

									{teamData.isRecruiting && (
										<div className="space-y-4">
											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													CONTACT INFO
												</label>
												<Input
													value={teamData.recruitmentDescription}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
														setTeamData((prev) => ({
															...prev,
															recruitmentDescription: e.target.value,
														}))
													}
													placeholder="How to contact your team (Discord, email, etc.)..."
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
													multiline
													rows={3}
												/>
											</div>
										</div>
									)}
								</div>

								{/* Skills Requirements */}
								{teamData.isRecruiting && (
									<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
										<h2 className="font-mono text-green-400 font-bold mb-6">
											SKILL REQUIREMENTS
										</h2>

										{/* Required Skills */}
										<div className="mb-6">
											<label className="block text-sm font-mono text-green-400 mb-3">
												REQUIRED SKILLS
											</label>
											<div className="relative mb-3">
												<Input
													value={newRequiredSkill}
													onChange={(e) => {
														setNewRequiredSkill(e.target.value);
														setShowRequiredSkillsDropdown(true);
														setHighlightedRequiredIndex(0);
													}}
													onFocus={() => setShowRequiredSkillsDropdown(true)}
													onKeyDown={(e) => {
														const filtered = availableSkills.filter(
															(skill) =>
																skill
																	.toLowerCase()
																	.includes(newRequiredSkill.toLowerCase()) &&
																!teamData.requiredSkills.includes(skill)
														);

														if (e.key === "ArrowDown") {
															e.preventDefault();
															setHighlightedRequiredIndex((prev) =>
																prev < filtered.length - 1 ? prev + 1 : 0
															);
														} else if (e.key === "ArrowUp") {
															e.preventDefault();
															setHighlightedRequiredIndex((prev) =>
																prev > 0 ? prev - 1 : filtered.length - 1
															);
														} else if (e.key === "Enter") {
															e.preventDefault();
															if (
																filtered.length > 0 &&
																filtered[highlightedRequiredIndex]
															) {
																const skill =
																	filtered[highlightedRequiredIndex];
																setTeamData((prev) => ({
																	...prev,
																	requiredSkills: [
																		...prev.requiredSkills,
																		skill,
																	],
																}));
																setNewRequiredSkill("");
																setShowRequiredSkillsDropdown(false);
																setHighlightedRequiredIndex(0);
															}
														}
													}}
													placeholder="Search and add required skill..."
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
												{showRequiredSkillsDropdown && newRequiredSkill && (
													<div className="absolute z-[200] w-full mt-1 bg-gray-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
														{availableSkills
															.filter(
																(skill) =>
																	skill
																		.toLowerCase()
																		.includes(newRequiredSkill.toLowerCase()) &&
																	!teamData.requiredSkills.includes(skill)
															)
															.map((skill, index) => (
																<button
																	key={skill}
																	type="button"
																	onMouseDown={(e) => {
																		e.preventDefault();
																		setTeamData((prev) => ({
																			...prev,
																			requiredSkills: [
																				...prev.requiredSkills,
																				skill,
																			],
																		}));
																		setNewRequiredSkill("");
																		setShowRequiredSkillsDropdown(false);
																		setHighlightedRequiredIndex(0);
																	}}
																	onMouseEnter={() =>
																		setHighlightedRequiredIndex(index)
																	}
																	className={`w-full text-left px-3 py-2 font-mono text-white first:rounded-t-lg last:rounded-b-lg ${
																		index === highlightedRequiredIndex
																			? "bg-green-500/30"
																			: "hover:bg-green-500/20"
																	}`}
																>
																	{skill}
																</button>
															))}
													</div>
												)}
											</div>
											<div className="flex flex-wrap gap-2">
												{teamData.requiredSkills.map((skill) => (
													<Badge
														key={skill}
														variant="outline"
														className="font-mono text-red-400 border-red-500/50 cursor-pointer group"
														onClick={() => removeRequiredSkill(skill)}
													>
														{skill}
														<X className="h-3 w-3 ml-1 group-hover:text-red-400" />
													</Badge>
												))}
											</div>
										</div>

										{/* Preferred Skills */}
										<div>
											<label className="block text-sm font-mono text-green-400 mb-3">
												PREFERRED SKILLS
											</label>
											<div className="relative mb-3">
												<Input
													value={newPreferredSkill}
													onChange={(e) => {
														setNewPreferredSkill(e.target.value);
														setShowPreferredSkillsDropdown(true);
														setHighlightedPreferredIndex(0);
													}}
													onFocus={() => setShowPreferredSkillsDropdown(true)}
													onKeyDown={(e) => {
														const filtered = availableSkills.filter(
															(skill) =>
																skill
																	.toLowerCase()
																	.includes(newPreferredSkill.toLowerCase()) &&
																!teamData.preferredSkills.includes(skill)
														);

														if (e.key === "ArrowDown") {
															e.preventDefault();
															setHighlightedPreferredIndex((prev) =>
																prev < filtered.length - 1 ? prev + 1 : 0
															);
														} else if (e.key === "ArrowUp") {
															e.preventDefault();
															setHighlightedPreferredIndex((prev) =>
																prev > 0 ? prev - 1 : filtered.length - 1
															);
														} else if (e.key === "Enter") {
															e.preventDefault();
															if (
																filtered.length > 0 &&
																filtered[highlightedPreferredIndex]
															) {
																const skill =
																	filtered[highlightedPreferredIndex];
																setTeamData((prev) => ({
																	...prev,
																	preferredSkills: [
																		...prev.preferredSkills,
																		skill,
																	],
																}));
																setNewPreferredSkill("");
																setShowPreferredSkillsDropdown(false);
																setHighlightedPreferredIndex(0);
															}
														}
													}}
													placeholder="Search and add preferred skill..."
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												/>
												{showPreferredSkillsDropdown && newPreferredSkill && (
													<div className="absolute z-[200] w-full mt-1 bg-gray-800 border border-green-500/30 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
														{availableSkills
															.filter(
																(skill) =>
																	skill
																		.toLowerCase()
																		.includes(
																			newPreferredSkill.toLowerCase()
																		) &&
																	!teamData.preferredSkills.includes(skill)
															)
															.map((skill, index) => (
																<button
																	key={skill}
																	type="button"
																	onMouseDown={(e) => {
																		e.preventDefault();
																		setTeamData((prev) => ({
																			...prev,
																			preferredSkills: [
																				...prev.preferredSkills,
																				skill,
																			],
																		}));
																		setNewPreferredSkill("");
																		setShowPreferredSkillsDropdown(false);
																		setHighlightedPreferredIndex(0);
																	}}
																	onMouseEnter={() =>
																		setHighlightedPreferredIndex(index)
																	}
																	className={`w-full text-left px-3 py-2 font-mono text-white first:rounded-t-lg last:rounded-b-lg ${
																		index === highlightedPreferredIndex
																			? "bg-green-500/30"
																			: "hover:bg-green-500/20"
																	}`}
																>
																	{skill}
																</button>
															))}
													</div>
												)}
											</div>
											<div className="flex flex-wrap gap-2">
												{teamData.preferredSkills.map((skill) => (
													<Badge
														key={skill}
														variant="outline"
														className="font-mono text-green-400 border-green-500/50 cursor-pointer group"
														onClick={() => removePreferredSkill(skill)}
													>
														{skill}
														<X className="h-3 w-3 ml-1 group-hover:text-red-400" />
													</Badge>
												))}
											</div>
										</div>
									</div>
								)}

								<div className="flex justify-between">
									<Button
										variant="outline"
										onClick={() => setStep(1)}
										className="font-mono border-gray-500 text-gray-400"
									>
										BACK
									</Button>
									<Button
										onClick={() => setStep(3)}
										className="font-mono bg-green-500 hover:bg-green-600 text-black font-bold"
									>
										NEXT: SUMMARY
									</Button>
								</div>
							</motion.div>
						)}

						{/* Step 3: Summary */}
						{step === 3 && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								className="space-y-6"
							>
								{/* Summary */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Settings className="h-5 w-5 mr-2" />
										TEAM SUMMARY
									</h2>

									<div className="space-y-4 text-sm font-mono">
										<div className="flex justify-between">
											<span className="text-gray-400">Team Name:</span>
											<span className="text-white">{teamData.name}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Country:</span>
											<span className="text-white">
												{selectedCountry
													? selectedCountry.name
													: "Not specified"}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-gray-400">Recruiting:</span>
											<span
												className={
													teamData.isRecruiting
														? "text-green-400"
														: "text-red-400"
												}
											>
												{teamData.isRecruiting ? "YES" : "NO"}
											</span>
										</div>
										{teamData.isRecruiting && (
											<>
												<div className="flex justify-between">
													<span className="text-gray-400">
														Required Skills:
													</span>
													<span className="text-white">
														{teamData.requiredSkills.length}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-400">
														Preferred Skills:
													</span>
													<span className="text-white">
														{teamData.preferredSkills.length}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-gray-400">Contact Info:</span>
													<span className="text-white">
														{teamData.recruitmentDescription
															? "Provided"
															: "Not provided"}
													</span>
												</div>
											</>
										)}
									</div>
								</div>

								<div className="flex justify-between">
									<Button
										variant="outline"
										onClick={() => setStep(2)}
										className="font-mono border-gray-500 text-gray-400"
									>
										BACK
									</Button>
									<Button
										onClick={handleSubmit}
										disabled={loading}
										className="font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
									>
										<Save className="h-4 w-4 mr-2" />
										{loading ? "CREATING..." : "CREATE TEAM"}
									</Button>
								</div>
							</motion.div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
