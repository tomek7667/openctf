"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Shield, ChevronDown } from "@/components/ui/icons";
import { useAuthStore } from "@/store/authStore";
import { logout } from "@/api/auth";

export function UserMenu() {
	const [isOpen, setIsOpen] = useState(false);
	const { user, clearAuth, setLoading } = useAuthStore();

	const handleLogout = async () => {
		setLoading(true);
		try {
			await logout();
			clearAuth();
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setLoading(false);
		}
		setIsOpen(false);
	};

	if (!user) return null;

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 p-2 rounded transition-colors hover:bg-primary/10 font-mono"
			>
				<div className="w-8 h-8 bg-primary/20 rounded border border-primary/30 flex items-center justify-center">
					<User className="h-4 w-4 text-primary" />
				</div>
				<span className="text-foreground">{user.username}</span>
				<ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<>
						<div
							className="fixed inset-0 z-40"
							onClick={() => setIsOpen(false)}
						/>
						<motion.div
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: -10, scale: 0.95 }}
							className="absolute right-0 top-full mt-2 w-64 z-50"
						>
							<div className="bg-black/95 backdrop-blur-md border border-green-500/30 rounded-lg p-4 shadow-2xl">
								<div className="text-primary font-mono text-sm mb-3">
									$ whoami
								</div>
								
								<div className="space-y-3 mb-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-primary/20 rounded border border-primary/30 flex items-center justify-center">
											<User className="h-5 w-5 text-primary" />
										</div>
										<div>
											<div className="font-mono font-bold text-foreground">{user.username}</div>
											<div className="text-xs text-muted-foreground">{user.email}</div>
										</div>
									</div>
									
									<div className="flex items-center gap-2">
										<Shield className="h-4 w-4 text-primary" />
										<span className="text-sm font-mono text-muted-foreground">
											{user.permission_level}
										</span>
									</div>
								</div>

								<div className="border-t border-border/50 pt-3 space-y-1">
									<a
										href="/profile"
										className="w-full flex items-center gap-3 p-2 rounded transition-colors hover:bg-primary/10 text-left font-mono text-sm"
										onClick={() => setIsOpen(false)}
									>
										<User className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">&gt; Profile</span>
									</a>

									<button className="w-full flex items-center gap-3 p-2 rounded transition-colors hover:bg-primary/10 text-left font-mono text-sm">
										<Settings className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">&gt; Settings</span>
									</button>
									
									<button
										onClick={handleLogout}
										className="w-full flex items-center gap-3 p-2 rounded transition-colors hover:bg-red-500/10 text-left font-mono text-sm text-red-400"
									>
										<LogOut className="h-4 w-4" />
										<span>&gt; Logout</span>
									</button>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
