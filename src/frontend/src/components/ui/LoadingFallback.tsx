/**
 * Loading Fallback Components
 *
 * Provides various loading states and skeleton components
 * for a professional user experience during data fetching.
 */

"use client";

import React from "react";
import { Loader } from "@/components/ui/icons";
import { clsx } from "clsx";

interface LoadingFallbackProps {
	message?: undefined | string;
	size?: undefined | "sm" | "md" | "lg";
	className?: undefined | string;
}

/**
 * Simple loading spinner with optional message
 */
export function LoadingFallback({
	message = "Loading...",
	size = "md",
	className,
}: LoadingFallbackProps) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-6 h-6",
		lg: "w-8 h-8",
	};

	return (
		<div
			className={clsx(
				"flex flex-col items-center justify-center min-h-[200px] p-8",
				className
			)}
		>
			<Loader
				className={clsx("animate-spin text-primary mb-3", sizeClasses[size])}
			/>
			{message && (
				<p className="text-sm text-muted-foreground text-center max-w-xs">
					{message}
				</p>
			)}
		</div>
	);
}

/**
 * Full page loading component
 */
export function PageLoadingFallback({
	message,
}: {
	message?: undefined | string;
}) {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<LoadingFallback message={message ?? ""} size="lg" />
		</div>
	);
}

/**
 * Inline loading spinner
 */
export function InlineLoading({
	size = "sm",
	className,
}: Pick<LoadingFallbackProps, "size" | "className">) {
	const sizeClasses = {
		sm: "w-4 h-4",
		md: "w-5 h-5",
		lg: "w-6 h-6",
	};

	return (
		<Loader
			className={clsx(
				"animate-spin text-current",
				sizeClasses[size],
				className
			)}
		/>
	);
}

/**
 * Skeleton loading components
 */
export function SkeletonBox({
	className,
	animate = true,
}: {
	className?: undefined | string;
	animate?: undefined | boolean;
}) {
	return (
		<div
			className={clsx(
				"bg-muted rounded",
				animate && "animate-pulse",
				className
			)}
		/>
	);
}

export function SkeletonText({
	lines = 1,
	className,
}: {
	lines?: undefined | number;
	className?: undefined | string;
}) {
	return (
		<div className={clsx("space-y-2", className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<SkeletonBox
					key={i}
					className={clsx(
						"h-4",
						i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
					)}
				/>
			))}
		</div>
	);
}

/**
 * Card skeleton for team/contest cards
 */
export function CardSkeleton() {
	return (
		<div className="p-6 border rounded-lg space-y-4">
			<div className="flex items-center space-x-3">
				<SkeletonBox className="w-10 h-10 rounded-full" />
				<div className="flex-1 space-y-2">
					<SkeletonBox className="h-4 w-1/2" />
					<SkeletonBox className="h-3 w-3/4" />
				</div>
			</div>
			<SkeletonText lines={2} />
			<div className="flex justify-between items-center">
				<SkeletonBox className="h-6 w-16" />
				<SkeletonBox className="h-8 w-20" />
			</div>
		</div>
	);
}

/**
 * Table skeleton for data tables
 */
export function TableSkeleton({
	rows = 5,
	columns = 4,
}: {
	rows?: undefined | number;
	columns?: undefined | number;
}) {
	return (
		<div className="space-y-3">
			{/* Header */}
			<div
				className="grid gap-4"
				style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
			>
				{Array.from({ length: columns }).map((_, i) => (
					<SkeletonBox key={i} className="h-6" />
				))}
			</div>

			{/* Rows */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div
					key={rowIndex}
					className="grid gap-4"
					style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
				>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<SkeletonBox key={colIndex} className="h-8" />
					))}
				</div>
			))}
		</div>
	);
}

/**
 * Page skeleton for team/contest pages
 */
export function PageSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<SkeletonBox className="h-8 w-48" />
					<SkeletonBox className="h-4 w-96" />
				</div>
				<SkeletonBox className="h-10 w-32" />
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="p-4 border rounded-lg">
						<SkeletonBox className="h-6 w-16 mb-2" />
						<SkeletonBox className="h-4 w-24" />
					</div>
				))}
			</div>

			{/* Content */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<div className="space-y-4">
						<SkeletonBox className="h-6 w-20" />
						<div className="space-y-2">
							{Array.from({ length: 5 }).map((_, i) => (
								<SkeletonBox key={i} className="h-8" />
							))}
						</div>
					</div>
				</div>

				<div className="lg:col-span-3">
					<TableSkeleton />
				</div>
			</div>
		</div>
	);
}

/**
 * Loading overlay for forms and modals
 */
export function LoadingOverlay({
	isVisible,
	message = "Processing...",
	children,
}: {
	isVisible: boolean;
	message?: undefined | string;
	children: React.ReactNode;
}) {
	return (
		<div className="relative">
			{children}
			{isVisible && (
				<div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
					<LoadingFallback message={message} size="md" />
				</div>
			)}
		</div>
	);
}

/**
 * Button loading state
 */
export function ButtonLoading({
	size = "sm",
	className,
}: {
	size?: undefined | "sm" | "md";
	className?: undefined | string;
}) {
	return <InlineLoading size={size} className={className ?? ""} />;
}

export default LoadingFallback;
