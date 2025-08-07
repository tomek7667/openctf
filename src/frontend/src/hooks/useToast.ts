"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Toast } from "@/components/ui/Toast";

interface ToastStore {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => string;
	removeToast: (id: string) => void;
	clearToasts: () => void;
}

const useToastStore = create<ToastStore>()(
	subscribeWithSelector((set, _) => ({
		toasts: [],

		addToast: (toast) => {
			const id = Math.random().toString(36).substr(2, 9);
			const newToast: Toast = { ...toast, id };

			set((state) => ({
				toasts: [...state.toasts, newToast],
			}));

			return id;
		},

		removeToast: (id) => {
			set((state) => ({
				toasts: state.toasts.filter((toast) => toast.id !== id),
			}));
		},

		clearToasts: () => {
			set({ toasts: [] });
		},
	}))
);

export const useToast = () => {
	const { addToast, removeToast, clearToasts } = useToastStore();

	const toast = {
		success: (
			title: string,
			message?: undefined | string,
			duration?: undefined | number
		) => {
			return addToast({
				type: "success",
				title,
				...(message !== undefined && { message }),
				...(duration !== undefined && { duration }),
				action: undefined,
			});
		},

		error: (
			title: string,
			message?: undefined | string,
			duration?: undefined | number
		) => {
			return addToast({
				type: "error",
				title,
				...(message !== undefined && { message }),
				...(duration !== undefined && { duration }),
				action: undefined,
			});
		},

		warning: (
			title: string,
			message?: undefined | string,
			duration?: undefined | number
		) => {
			return addToast({
				type: "warning",
				title,
				...(message !== undefined && { message }),
				...(duration !== undefined && { duration }),
				action: undefined,
			});
		},

		info: (
			title: string,
			message?: undefined | string,
			duration?: undefined | number
		) => {
			return addToast({
				type: "info",
				title,
				...(message !== undefined && { message }),
				...(duration !== undefined && { duration }),
				action: undefined,
			});
		},

		custom: (toast: Omit<Toast, "id">) => {
			return addToast(toast);
		},
	};

	return {
		toast,
		removeToast,
		clearToasts,
	};
};

export const useToasts = () => {
	return useToastStore((state) => state.toasts);
};

export default useToast;
