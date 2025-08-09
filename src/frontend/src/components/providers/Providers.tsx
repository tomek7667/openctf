/**
 * Application Providers
 *
 * Centralizes all context providers and global state management.
 * This ensures proper order of providers and clean architecture.
 */

"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import ToastContainer from "@/components/ui/ToastContainer";
import { NoSSR } from "@/components/ui/NoSSR";

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Main Providers Component
 */
export function Providers({ children }: ProvidersProps) {
	return (
		<ErrorBoundary>
			<NoSSR fallback={<LoadingFallback message="Initializing..." />}>
				<Suspense fallback={<LoadingFallback />}>
					{children}
				</Suspense>
			</NoSSR>

			{/* Toast notifications */}
			<ToastContainer />
		</ErrorBoundary>
	);
}

export default Providers;