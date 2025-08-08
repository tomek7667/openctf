import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/api";

interface AuthState {
	user: User | null;
	token: string | null;
	tokenExpiry: number | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	setAuth: (user: User, token: string, expiresIn?: number) => void;
	clearAuth: () => void;
	setLoading: (loading: boolean) => void;
	isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			tokenExpiry: null,
			isAuthenticated: false,
			isLoading: false,
			setAuth: (user, token, expiresIn = 3600) => {
				const tokenExpiry = Date.now() + (expiresIn * 1000);
				set({ user, token, tokenExpiry, isAuthenticated: true });
			},
			clearAuth: () => set({ user: null, token: null, tokenExpiry: null, isAuthenticated: false }),
			setLoading: (loading) => set({ isLoading: loading }),
			isTokenExpired: () => {
				const { tokenExpiry } = get();
				return tokenExpiry ? Date.now() > tokenExpiry : true;
			},
		}),
		{
			name: "openctf-auth",
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);
