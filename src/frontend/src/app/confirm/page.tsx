"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function ConfirmPage() {
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading"
	);
	const [message, setMessage] = useState("");
	const [countdown, setCountdown] = useState(3.0);
	const searchParams = useSearchParams();
	const router = useRouter();
	const code = searchParams.get("code");

	useEffect(() => {
		if (!code) {
			setStatus("error");
			setMessage("Invalid verification link");
			return;
		}

		const verify = async () => {
			try {
				const { user, token } = await verifyEmail(code);
				useAuthStore.getState().setAuth(user, token);
				setStatus("success");
				setMessage("Email verified successfully");
				
				const timer = setInterval(() => {
					setCountdown(prev => {
						const next = prev - 0.1;
						if (next <= 0) {
							clearInterval(timer);
							router.push("/contests");
							return 0;
						}
						return next;
					});
				}, 100);
			} catch (error) {
				setStatus("error");
				setMessage(
					error instanceof Error ? error.message : "Verification failed"
				);
			}
		};

		verify();
	}, [code, router]);

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-4">
			<div className="max-w-md w-full">
				<div className="border border-cyan-500/30 bg-black/50 backdrop-blur-sm rounded-lg p-8 text-center">
					<div className="mb-6">
						<div className="w-16 h-16 mx-auto mb-4 border border-cyan-500 rounded-full flex items-center justify-center">
							{status === "loading" && (
								<div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
							)}
							{status === "success" && (
								<svg
									className="w-8 h-8 text-green-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							)}
							{status === "error" && (
								<svg
									className="w-8 h-8 text-red-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							)}
						</div>
						<h1 className="text-2xl font-bold text-cyan-400 mb-2">
							{status === "loading" && "Verifying Email..."}
							{status === "success" && "Email Verified"}
							{status === "error" && "Verification Failed"}
						</h1>
						<p className="text-gray-300">{message}</p>
					</div>

					{status === "success" && (
						<p className="text-sm text-gray-400">
							Redirecting in {countdown.toFixed(1)}s...
						</p>
					)}

					{status === "error" && (
						<button
							onClick={() => router.push("/")}
							className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors"
						>
							Return Home
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
