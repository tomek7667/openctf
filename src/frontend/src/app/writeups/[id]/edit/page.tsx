"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
	ArrowLeft,
	Eye,
	Edit,
	Save,
	Trash2,
	Terminal,
	Code,
	Shield,
	Zap,
	Cpu,
	Lock,
	Search,
	X,
	Plus,
	AlertTriangle,
} from "@/components/ui/icons";
import {
	getWriteup,
	updateWriteup,
	deleteWriteup,
	Writeup,
} from "@/api/writeups";
import { useAuthStore } from "@/store/authStore";
import { HackerMarkdown } from "@/components/ui/HackerMarkdown";

// Import highlight.js themes
import "highlight.js/styles/tokyo-night-dark.css";

const categories = [
	{
		id: "web",
		label: "Web Exploitation",
		icon: Code,
		color: "from-blue-500 to-purple-500",
	},
	{
		id: "crypto",
		label: "Cryptography",
		icon: Lock,
		color: "from-purple-500 to-pink-500",
	},
	{
		id: "reverse",
		label: "Reverse Engineering",
		icon: Cpu,
		color: "from-pink-500 to-red-500",
	},
	{
		id: "pwn",
		label: "Binary Exploitation",
		icon: Zap,
		color: "from-red-500 to-orange-500",
	},
	{
		id: "forensics",
		label: "Digital Forensics",
		icon: Search,
		color: "from-orange-500 to-yellow-500",
	},
	{
		id: "misc",
		label: "Miscellaneous",
		icon: Shield,
		color: "from-yellow-500 to-green-500",
	},
];

const difficulties = [
	{
		id: "Easy",
		label: "Easy",
		color: "text-green-400",
		bgColor: "bg-green-500/20 border-green-500/50",
	},
	{
		id: "Medium",
		label: "Medium",
		color: "text-yellow-400",
		bgColor: "bg-yellow-500/20 border-yellow-500/50",
	},
	{
		id: "Hard",
		label: "Hard",
		color: "text-red-400",
		bgColor: "bg-red-500/20 border-red-500/50",
	},
	{
		id: "Insane",
		label: "Insane",
		color: "text-purple-400",
		bgColor: "bg-purple-500/20 border-purple-500/50",
	},
];



export default function EditWriteupPage() {
	const params = useParams();
	const router = useRouter();
	const { user, isAuthenticated } = useAuthStore();

	const [writeup, setWriteup] = useState<Writeup | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [isPreview, setIsPreview] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// Form data
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [content, setContent] = useState("");
	const [category, setCategory] = useState("web");
	const [difficulty, setDifficulty] = useState("Medium");
	const [tags, setTags] = useState<string[]>([]);
	const [newTag, setNewTag] = useState("");
	const [contestName, setContestName] = useState("");
	const [challengeName, setChallengeName] = useState("");
	const [solveCount, setSolveCount] = useState("");
	const [contestSuggestions, setContestSuggestions] = useState<string[]>([]);
	const [showContestSuggestions, setShowContestSuggestions] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [toastMessage, setToastMessage] = useState("");

	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/writeups");
			return;
		}

		const loadWriteup = async () => {
			try {
				const response = await getWriteup(params.id as string);
				if (response.success && response.data) {
					const w = response.data;

					// Check if user owns this writeup
					if (w.authorId !== user?.id?.toString()) {
						router.push("/writeups");
						return;
					}

					setWriteup(w);
					setTitle(w.title);
					setDescription(w.description);
					setContent(w.content);
					setCategory(w.category);
					setDifficulty(w.difficulty);
					setTags(w.tags);
					setContestName(w.contestName || "");
					setChallengeName(w.challengeName || "");
					setSolveCount("");
				} else {
					router.push("/writeups");
				}
			} catch (error) {
				console.error("Error loading writeup:", error);
				router.push("/writeups");
			} finally {
				setLoading(false);
			}
		};

		loadWriteup();
	}, [params.id, isAuthenticated, user?.id, router]);

	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	const handleContestSearch = (value: string) => {
		setContestName(value);
		if (value.length >= 2) {
			const mockContests = [
				"picoCTF 2024",
				"HackTheBox Cyber Apocalypse",
				"DEF CON CTF",
				"Google CTF 2024",
				"PlaidCTF 2024",
				"CSAW CTF",
				"BSides SF CTF",
				"NorthSec 2024",
			];
			const filtered = mockContests.filter((contest) =>
				contest.toLowerCase().includes(value.toLowerCase())
			);
			setContestSuggestions(filtered);
			setShowContestSuggestions(true);
		} else {
			setShowContestSuggestions(false);
		}
	};

	const selectContest = (contest: string) => {
		setContestName(contest);
		setShowContestSuggestions(false);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		}
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !description.trim() || !content.trim() || !writeup) {
			return;
		}

		setSaving(true);
		try {
			const writeupData: Partial<Writeup> = {
				title,
				description,
				content,
				category: category as any,
				difficulty: difficulty as any,
				tags,
				...(contestName && { contestName }),
				...(challengeName && { challengeName }),
			};

			const response = await updateWriteup(
				writeup.id,
				writeupData,
				user?.id?.toString()
			);
			if (response.success && response.data) {
				router.push(`/writeups/${response.data.id}`);
			}
		} catch (error) {
			console.error("Error updating writeup:", error);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!writeup) return;

		setDeleting(true);
		try {
			const response = await deleteWriteup(writeup.id, user?.id?.toString());
			if (response.success) {
				router.push("/writeups");
			}
		} catch (error) {
			console.error("Error deleting writeup:", error);
		} finally {
			setDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	if (loading) {
		return (
			<MainLayout>
				<div className="flex justify-center items-center min-h-screen">
					<LoadingSpinner />
				</div>
			</MainLayout>
		);
	}

	if (!writeup) {
		return (
			<MainLayout>
				<div className="flex flex-col items-center justify-center min-h-screen">
					<h1 className="text-2xl font-mono text-red-400 mb-4">
						Writeup not found or access denied
					</h1>
					<Button onClick={() => router.push("/writeups")}>
						Go back to writeups
					</Button>
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
							onClick={() => router.push(`/writeups/${writeup.id}`)}
							className="mb-6 font-mono border-green-500/50 text-green-400 hover:bg-green-500/10"
						>
							<ArrowLeft className="h-4 w-4 mr-2" />
							BACK TO WRITEUP
						</Button>

						<div className="text-center mb-8">
							<h1 className="text-2xl font-bold font-mono text-foreground mb-2">
								EDIT_WRITEUP
							</h1>
							<p className="text-sm text-muted-foreground font-mono">
								Update your writeup content
							</p>
						</div>
					</motion.div>

					<form onSubmit={handleSave}>
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
							{/* Main Form */}
							<div className="lg:col-span-2 space-y-6">
								{/* Basic Info */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
								>
									<h2 className="font-mono text-green-400 font-bold mb-6 flex items-center">
										<Edit className="h-5 w-5 mr-2" />
										BASIC INFORMATION
									</h2>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												TITLE
											</label>
											<Input
												value={title}
												onChange={(e) => setTitle(e.target.value)}
												placeholder="Enter writeup title..."
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												required
											/>
										</div>

										<div>
											<label className="block text-sm font-mono text-green-400 mb-2">
												DESCRIPTION
											</label>
											<Input
												value={description}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
												placeholder="Brief description of the writeup..."
												className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
												multiline
												rows={3}
												required
											/>
										</div>

										<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
											<div className="relative">
												<label className="block text-sm font-mono text-green-400 mb-2">
													CONTEST *
												</label>
												<Input
													value={contestName}
													onChange={(e) => handleContestSearch(e.target.value)}
													placeholder="Type contest name..."
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
													required
												/>
												{showContestSuggestions &&
													contestSuggestions.length > 0 && (
														<div className="absolute z-10 w-full mt-1 bg-gray-800 border border-green-500/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
															{contestSuggestions.map((contest, index) => (
																<button
																	key={index}
																	type="button"
																	onClick={() => selectContest(contest)}
																	className="w-full text-left px-3 py-2 hover:bg-green-500/20 font-mono text-sm text-white first:rounded-t-lg last:rounded-b-lg"
																>
																	{contest}
																</button>
															))}
														</div>
													)}
											</div>
											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													CHALLENGE *
												</label>
												<Input
													value={challengeName}
													onChange={(e) => setChallengeName(e.target.value)}
													placeholder="e.g. Web Gauntlet"
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
													required
												/>
											</div>
											<div>
												<label className="block text-sm font-mono text-green-400 mb-2">
													SOLVES (Optional)
												</label>
												<Input
													type="number"
													value={solveCount}
													onChange={(e) => setSolveCount(e.target.value)}
													placeholder="e.g. 42"
													className="font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
													min="0"
												/>
											</div>
										</div>
									</div>
								</motion.div>

								{/* Category and Difficulty */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 }}
									className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
								>
									<h2 className="font-mono text-green-400 font-bold mb-6">
										CLASSIFICATION
									</h2>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-mono text-green-400 mb-3">
												CATEGORY
											</label>
											<div className="grid grid-cols-2 gap-2">
												{categories.map((cat) => {
													const Icon = cat.icon;
													return (
														<button
															key={cat.id}
															type="button"
															onClick={() => setCategory(cat.id)}
															className={`flex items-center space-x-2 p-3 rounded-lg font-mono text-sm transition-all ${
																category === cat.id
																	? "bg-green-500/20 text-green-400 border border-green-500/50"
																	: "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
															}`}
														>
															<Icon className="h-4 w-4" />
															<span>{cat.label}</span>
														</button>
													);
												})}
											</div>
										</div>

										<div>
											<label className="block text-sm font-mono text-green-400 mb-3">
												DIFFICULTY
											</label>
											<div className="grid grid-cols-2 gap-2">
												{difficulties.map((diff) => (
													<button
														key={diff.id}
														type="button"
														onClick={() => setDifficulty(diff.id)}
														className={`text-left p-3 rounded-lg font-mono text-sm transition-all border ${
															difficulty === diff.id
																? `${diff.bgColor} ${diff.color} border-current`
																: "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border-gray-600"
														}`}
													>
														[{diff.label.toUpperCase()}]
													</button>
												))}
											</div>
										</div>
									</div>
								</motion.div>

								{/* Tags */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2 }}
									className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6"
								>
									<h2 className="font-mono text-green-400 font-bold mb-6">
										TAGS
									</h2>

									<div className="space-y-4">
										<div className="flex space-x-2">
											<Input
												value={newTag}
												onChange={(e) => setNewTag(e.target.value)}
												onKeyPress={handleKeyPress}
												placeholder="Add tags (press Enter)"
												className="flex-1 font-mono bg-gray-800/50 border-green-500/30 text-white placeholder-gray-400"
											/>
											<Button
												type="button"
												onClick={addTag}
												variant="outline"
												className="font-mono border-green-500/50 text-green-400"
											>
												<Plus className="h-4 w-4" />
											</Button>
										</div>

										<div className="flex flex-wrap gap-2">
											{tags.map((tag) => (
												<Badge
													key={tag}
													variant="outline"
													className="font-mono text-green-400 border-green-500/50 group cursor-pointer"
													onClick={() => removeTag(tag)}
												>
													#{tag}
													<X className="h-3 w-3 ml-1 group-hover:text-red-400" />
												</Badge>
											))}
										</div>
									</div>
								</motion.div>

								{/* Content Editor */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3 }}
									className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg overflow-hidden"
								>
									<div className="flex items-center justify-between bg-gray-800/50 px-6 py-4 border-b border-green-500/30">
										<h2 className="font-mono text-green-400 font-bold flex items-center">
											<Terminal className="h-5 w-5 mr-2" />
											CONTENT
										</h2>
										<div className="flex items-center space-x-2">
											<Button
												type="button"
												variant={!isPreview ? "primary" : "outline"}
												onClick={() => setIsPreview(false)}
												className="font-mono text-sm"
											>
												<Edit className="h-4 w-4 mr-1" />
												EDIT
											</Button>
											<Button
												type="button"
												variant={isPreview ? "primary" : "outline"}
												onClick={() => setIsPreview(true)}
												className="font-mono text-sm"
											>
												<Eye className="h-4 w-4 mr-1" />
												PREVIEW
											</Button>
										</div>
									</div>

									<div className="p-6">
										<AnimatePresence mode="wait">
											{!isPreview ? (
												<motion.div
													key="editor"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
												>
													<textarea
														value={content}
														onChange={(e) => setContent(e.target.value)}
														placeholder="Write your markdown content here..."
														className="w-full h-96 bg-gray-900/50 border border-green-500/30 rounded-lg p-4 font-mono text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:border-green-400"
														required
													/>
												</motion.div>
											) : (
												<motion.div
													key="preview"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													className="min-h-96 bg-gray-900/50 border border-green-500/30 rounded-lg p-4"
												>
													<HackerMarkdown
														content={content}
														setToastMessage={setToastMessage}
														setShowToast={setShowToast}
													/>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</motion.div>
							</div>

							{/* Sidebar */}
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.2 }}
								className="space-y-6 lg:sticky lg:top-20 lg:self-start"
							>
								{/* Actions */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-4">
										ACTIONS
									</h3>
									<div className="space-y-3">
										<Button
											type="submit"
											disabled={
												saving ||
												!title.trim() ||
												!description.trim() ||
												!content.trim() ||
												!contestName.trim() ||
												!challengeName.trim()
											}
											className="w-full font-mono bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-black font-bold"
										>
											<Save className="h-4 w-4 mr-2" />
											{saving ? "UPDATING..." : "UPDATE WRITEUP"}
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={() => setShowDeleteConfirm(true)}
											className="w-full font-mono border-red-500/50 text-red-400 hover:bg-red-500/10"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											DELETE WRITEUP
										</Button>
									</div>
								</div>

								{/* Preview Info */}
								<div className="bg-gray-800/30 backdrop-blur border border-green-500/30 rounded-lg p-6">
									<h3 className="font-mono text-green-400 font-bold mb-4">
										PREVIEW INFO
									</h3>
									<div className="space-y-3 text-sm font-mono text-gray-300">
										<div className="flex justify-between">
											<span>Word count:</span>
											<span className="text-green-400">
												{content.split(/\s+/).length}
											</span>
										</div>
										<div className="flex justify-between">
											<span>Character count:</span>
											<span className="text-green-400">{content.length}</span>
										</div>
										<div className="flex justify-between">
											<span>Estimated read:</span>
											<span className="text-green-400">
												{Math.ceil(content.length / 200)}m
											</span>
										</div>
										<div className="flex justify-between">
											<span>Tags:</span>
											<span className="text-green-400">{tags.length}</span>
										</div>
									</div>
								</div>
							</motion.div>
						</div>
					</form>

					{/* Toast Notification */}
					<AnimatePresence>
						{showToast && (
							<motion.div
								initial={{ opacity: 0, y: 50, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 50, scale: 0.9 }}
								className="fixed bottom-4 right-4 z-50"
							>
								<div className="bg-gray-900/95 backdrop-blur border border-green-500/50 rounded-lg px-4 py-3 shadow-2xl">
									<div className="flex items-center space-x-2">
										<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
										<span className="font-mono text-sm text-green-400">
											{toastMessage}
										</span>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Delete Confirmation Modal */}
					<AnimatePresence>
						{showDeleteConfirm && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
								onClick={() => setShowDeleteConfirm(false)}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									className="bg-gray-800 border border-red-500/50 rounded-lg p-6 max-w-md w-full"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="flex items-center space-x-3 mb-4">
										<AlertTriangle className="h-6 w-6 text-red-400" />
										<h3 className="font-mono text-red-400 font-bold text-lg">
											CONFIRM DELETE
										</h3>
									</div>
									<p className="text-gray-300 font-mono mb-6">
										Are you sure you want to delete this writeup? This action
										cannot be undone.
									</p>
									<div className="flex space-x-3">
										<Button
											onClick={handleDelete}
											disabled={deleting}
											className="flex-1 font-mono bg-red-500 hover:bg-red-600 text-white"
										>
											<Trash2 className="h-4 w-4 mr-2" />
											{deleting ? "DELETING..." : "DELETE"}
										</Button>
										<Button
											onClick={() => setShowDeleteConfirm(false)}
											variant="outline"
											className="flex-1 font-mono border-gray-500 text-gray-400"
										>
											CANCEL
										</Button>
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</MainLayout>
	);
}
