/**
 * Application Providers
 *
 * Centralizes all context providers and global state management.
 * This ensures proper order of providers and clean architecture.
 */

"use client";

import React, { useEffect, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { LoadingFallback } from "@/components/ui/LoadingFallback";
import ToastContainer from "@/components/ui/ToastContainer";
import { useAuthStore } from "@/stores/auth";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error: any) => {
				// Don't retry on 4xx errors except 401, 408, 429
				if (error?.status >= 400 && error?.status < 500) {
					return [401, 408, 429].includes(error.status) && failureCount < 2;
				}
				// Retry on 5xx errors up to 3 times
				return failureCount < 3;
			},
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			staleTime: 5 * 60 * 1000, // 5 minutes
			cacheTime: 10 * 60 * 1000, // 10 minutes
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
		},
		mutations: {
			retry: false,
		},
	},
});

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Auth Initializer Component
 * Handles authentication state initialization
 */
function AuthInitializer({ children }: { children: React.ReactNode }) {
	const { initialize, isInitialized } = useAuthStore();

	useEffect(() => {
		if (!isInitialized) {
			initialize();
		}
	}, [initialize, isInitialized]);

	return <>{children}</>;
}

/**
 * Main Providers Component
 */
export function Providers({ children }: ProvidersProps) {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={<LoadingFallback />}>
					<AuthInitializer>{children}</AuthInitializer>
				</Suspense>

				{/* Toast notifications */}
				<ToastContainer />

				{/* Development tools */}
				{process.env.NODE_ENV === "development" && (
					<ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
				)}
			</QueryClientProvider>
		</ErrorBoundary>
	);
}

export default Providers;
