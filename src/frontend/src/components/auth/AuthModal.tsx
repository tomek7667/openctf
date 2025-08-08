"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Shield, Lock, Mail, User } from "@/components/ui/icons";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { login, register, forgotPassword } from "@/api/auth";
import type { LoginDto, RegisterDto } from "@/types/api";

interface AuthModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: "login" | "register" | "forgot";
}

type AuthMode = "login" | "register" | "forgot" | "success";

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
	const [mode, setMode] = useState<AuthMode>(initialMode);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	
	const { setAuth, setLoading } = useAuthStore();

	const [formData, setFormData] = useState({
		identity: "",
		email: "",
		username: "",
		password: "",
		description: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);
		setLoading(true);

		try {
			if (mode === "login") {
				const loginData: LoginDto = {
					identity: formData.identity,
					password: formData.password,
				};
				const response = await login(loginData);
				setAuth(response.user, response.token);
				onClose();
			} else if (mode === "register") {
				const registerData: RegisterDto = {
					username: formData.username,
					email: formData.email,
					password: formData.password,
					description: formData.description,
				};
				const response = await register(registerData);
				setAuth(response.user, response.token);
				onClose();
			} else if (mode === "forgot") {
				await forgotPassword(formData.email);
				setSuccessMessage("Password reset instructions sent to your email");
				setMode("success");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Authentication failed");
		} finally {
			setIsLoading(false);
			setLoading(false);
		}
	};

	const resetForm = () => {
		setFormData({
			identity: "",
			email: "",
			username: "",
			password: "",
			description: "",
		});
		setError("");
		setSuccessMessage("");
	};

	const switchMode = (newMode: AuthMode) => {
		setMode(newMode);
		resetForm();
	};

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					onClick={onClose}
				/>
				
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
					className="relative w-full max-w-md bg-black/95 border border-primary/30 shadow-2xl shadow-primary/10"
				>
					<div className="p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-mono text-lg text-primary">
								{mode === "login" && "$ ./login"}
								{mode === "register" && "$ ./register"}
								{mode === "forgot" && "$ ./recover"}
								{mode === "success" && "$ ./success"}
							</h2>
							<button
								onClick={onClose}
								className="p-1 text-muted-foreground hover:text-primary transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{mode === "success" ? (
							<div className="text-center space-y-4">
								<Shield className="h-12 w-12 mx-auto text-green-400" />
								<p className="font-mono text-green-400">ACCESS_GRANTED</p>
								<p className="text-muted-foreground text-sm">{successMessage}</p>
								<Button onClick={() => switchMode("login")} className="w-full font-mono">
									{">"}  back_to_login
								</Button>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								{mode === "login" && (
									<>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												username_or_email
											</label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type="text"
													placeholder="root@openctf"
													value={formData.identity}
													onChange={(e) => setFormData({ ...formData, identity: e.target.value })}
													className="pl-10 font-mono bg-black/50 border-primary/30"
													required
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												password
											</label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="••••••••"
													value={formData.password}
													onChange={(e) => setFormData({ ...formData, password: e.target.value })}
													className="pl-10 pr-10 font-mono bg-black/50 border-primary/30"
													required
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
												>
													{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</button>
											</div>
										</div>
									</>
								)}

								{mode === "register" && (
									<>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												username
											</label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type="text"
													placeholder="h4ck3r"
													value={formData.username}
													onChange={(e) => setFormData({ ...formData, username: e.target.value })}
													className="pl-10 font-mono bg-black/50 border-primary/30"
													required
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												email
											</label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type="email"
													placeholder="user@domain.tld"
													value={formData.email}
													onChange={(e) => setFormData({ ...formData, email: e.target.value })}
													className="pl-10 font-mono bg-black/50 border-primary/30"
													required
												/>
											</div>
										</div>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												password
											</label>
											<div className="relative">
												<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													type={showPassword ? "text" : "password"}
													placeholder="••••••••"
													value={formData.password}
													onChange={(e) => setFormData({ ...formData, password: e.target.value })}
													className="pl-10 pr-10 font-mono bg-black/50 border-primary/30"
													required
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
												>
													{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
												</button>
											</div>
										</div>
										<div>
											<label className="block text-sm font-mono text-muted-foreground mb-2">
												bio (optional)
											</label>
											<Input
												type="text"
												placeholder="elite hacker..."
												value={formData.description}
												onChange={(e) => setFormData({ ...formData, description: e.target.value })}
												className="font-mono bg-black/50 border-primary/30"
											/>
										</div>
									</>
								)}

								{mode === "forgot" && (
									<div>
										<label className="block text-sm font-mono text-muted-foreground mb-2">
											email_address
										</label>
										<div className="relative">
											<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
											<Input
												type="email"
												placeholder="user@domain.tld"
												value={formData.email}
												onChange={(e) => setFormData({ ...formData, email: e.target.value })}
												className="pl-10 font-mono bg-black/50 border-primary/30"
												required
											/>
										</div>
									</div>
								)}

								{error && (
									<div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-mono">
										ERROR: {error}
									</div>
								)}

								<Button
									type="submit"
									disabled={isLoading}
									className="w-full font-mono font-bold"
								>
									{isLoading ? (
										<>
											<div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
											processing...
										</>
									) : (
										<>
											{mode === "login" && "> authenticate"}
											{mode === "register" && "> create_account"}
											{mode === "forgot" && "> send_reset"}
										</>
									)}
								</Button>

								<div className="text-center space-y-2 text-sm">
									{mode === "login" && (
										<>
											<button
												type="button"
												onClick={() => switchMode("register")}
												className="block w-full text-muted-foreground hover:text-primary font-mono transition-colors"
											>
												need an account? register here
											</button>
											<button
												type="button"
												onClick={() => switchMode("forgot")}
												className="block w-full text-muted-foreground hover:text-primary font-mono transition-colors"
											>
												forgot password?
											</button>
										</>
									)}
									{mode === "register" && (
										<button
											type="button"
											onClick={() => switchMode("login")}
											className="block w-full text-muted-foreground hover:text-primary font-mono transition-colors"
										>
											already have an account? login here
										</button>
									)}
									{mode === "forgot" && (
										<button
											type="button"
											onClick={() => switchMode("login")}
											className="block w-full text-muted-foreground hover:text-primary font-mono transition-colors"
										>
											back to login
										</button>
									)}
								</div>
							</form>
						)}
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	);
}