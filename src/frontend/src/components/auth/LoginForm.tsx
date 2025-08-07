"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { LoginDto } from "@/types/api";

interface LoginFormProps {
	onSuccess?: () => void | undefined;
	onSwitchToRegister?: () => void | undefined;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
	const { login, isLoading } = useAuthStore();
	const [formData, setFormData] = useState<LoginDto>({
		identity: "",
		password: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrors({});

		try {
			await login(formData);
			onSuccess?.();
		} catch (error: any) {
			const message = error.response?.data?.message || "Login failed";
			setErrors({ general: message });
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						label="Username or Email"
						name="identity"
						type="text"
						value={formData.identity}
						onChange={handleChange}
						error={errors.identity ?? ""}
						required
						placeholder="Enter your username or email"
					/>

					<Input
						label="Password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange}
						error={errors.password ?? ""}
						required
						placeholder="Enter your password"
					/>

					{errors.general && (
						<div className="text-sm text-destructive">{errors.general}</div>
					)}

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Signing in..." : "Sign In"}
					</Button>

					{onSwitchToRegister && (
						<p className="text-center text-sm text-muted-foreground">
							Don&apos;t have an account?{" "}
							<button
								type="button"
								onClick={onSwitchToRegister}
								className="font-medium text-primary hover:underline"
							>
								Sign up
							</button>
						</p>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
