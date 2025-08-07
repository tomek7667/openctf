"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { apiClient } from "@/lib/api";
import type { User, LoginDto, RegisterDto } from "@/types/api";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (credentials: LoginDto) => Promise<void>;
	register: (userData: RegisterDto) => Promise<void>;
	logout: () => void;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is authenticated on app load
		const checkAuth = async () => {
			try {
				const token = apiClient.getToken();
				if (token) {
					const userData = await apiClient.me();
					setUser(userData);
				}
			} catch (error) {
				// Token is invalid, clear it
				apiClient.clearToken();
			} finally {
				setLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (credentials: LoginDto) => {
		try {
			setLoading(true);
			const { user: userData } = await apiClient.login(credentials);
			setUser(userData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData: RegisterDto) => {
		try {
			setLoading(true);
			const { user: newUser } = await apiClient.register(userData);
			setUser(newUser);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		apiClient.logout();
		setUser(null);
	};

	const value: AuthContextType = {
		user,
		loading,
		login,
		register,
		logout,
		isAuthenticated: !!user,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
