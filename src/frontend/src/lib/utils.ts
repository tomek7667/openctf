import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
	const now = new Date();
	const then = new Date(date);
	const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "just now";
	}

	if (diffInSeconds < 3600) {
		const minutes = Math.floor(diffInSeconds / 60);
		return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	}

	if (diffInSeconds < 86400) {
		const hours = Math.floor(diffInSeconds / 3600);
		return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	}

	const days = Math.floor(diffInSeconds / 86400);
	if (days < 30) {
		return `${days} day${days === 1 ? "" : "s"} ago`;
	}

	return formatDate(date);
}

export function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	}
	return num.toString();
}

export function getErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	if (typeof error === "string") {
		return error;
	}
	if (error && typeof error === "object" && "message" in error) {
		return String(error.message);
	}
	return "An unknown error occurred";
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): T {
	let timeout: NodeJS.Timeout | null = null;

	return ((...args: any[]) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	}) as T;
}

export function generateId(): string {
	return Math.random().toString(36).substring(2, 11);
}
