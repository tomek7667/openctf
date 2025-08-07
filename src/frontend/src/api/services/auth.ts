/**
 * Authentication API Service
 *
 * Handles all authentication-related API calls including:
 * - User login/logout
 * - User registration
 * - Token management
 * - User profile operations
 */

import { apiClient } from "../client";
import type { LoginDto, RegisterDto, AuthResponse, User } from "@/types/api";

export class AuthApiService {
	/**
	 * Authenticate user with credentials
	 */
	async login(credentials: LoginDto): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>(
			"/auth/login",
			credentials,
			{
				skipAuth: true,
			}
		);

		// Set auth token for future requests
		if (response.token) {
			apiClient.setAuthToken(response.token);
		}

		return response;
	}

	/**
	 * Register new user account
	 */
	async register(userData: RegisterDto): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>(
			"/auth/register",
			userData,
			{
				skipAuth: true,
			}
		);

		// Set auth token for future requests
		if (response.token) {
			apiClient.setAuthToken(response.token);
		}

		return response;
	}

	/**
	 * Get current authenticated user
	 */
	async getCurrentUser(): Promise<User> {
		return apiClient.get<User>("/auth/me");
	}

	/**
	 * Logout current user
	 */
	async logout(): Promise<void> {
		// Call logout endpoint if it exists
		try {
			await apiClient.post("/auth/logout");
		} catch {
			// Ignore errors - local logout is more important
		}

		// Clear local auth token
		apiClient.clearAuthToken();
	}

	/**
	 * Refresh auth token
	 */
	async refreshToken(): Promise<AuthResponse> {
		const response = await apiClient.post<AuthResponse>("/auth/refresh");

		if (response.token) {
			apiClient.setAuthToken(response.token);
		}

		return response;
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(
		email: string
	): Promise<{ success: boolean; message: string }> {
		return apiClient.post<{ success: boolean; message: string }>(
			"/auth/password/reset",
			{
				email,
			},
			{
				skipAuth: true,
			}
		);
	}

	/**
	 * Reset password with token
	 */
	async resetPassword(
		token: string,
		newPassword: string
	): Promise<{ success: boolean }> {
		return apiClient.post<{ success: boolean }>(
			"/auth/password/reset/confirm",
			{
				token,
				password: newPassword,
			},
			{
				skipAuth: true,
			}
		);
	}

	/**
	 * Change current user's password
	 */
	async changePassword(
		currentPassword: string,
		newPassword: string
	): Promise<{ success: boolean }> {
		return apiClient.post<{ success: boolean }>("/auth/password/change", {
			currentPassword,
			newPassword,
		});
	}

	/**
	 * Update user profile
	 */
	async updateProfile(
		userData: Partial<Pick<User, "username" | "email" | "description">>
	): Promise<User> {
		return apiClient.patch<User>("/auth/profile", userData);
	}

	/**
	 * Upload user avatar
	 */
	async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
		const formData = new FormData();
		formData.append("avatar", file);

		return apiClient.post<{ avatarUrl: string }>("/auth/avatar", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	/**
	 * Delete user account
	 */
	async deleteAccount(password: string): Promise<{ success: boolean }> {
		return apiClient.delete<{ success: boolean }>("/auth/account", {
			data: { password },
		});
	}

	/**
	 * Check if email is available
	 */
	async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
		return apiClient.get<{ available: boolean }>("/auth/check-email", {
			params: { email },
			skipAuth: true,
		});
	}

	/**
	 * Check if username is available
	 */
	async checkUsernameAvailability(
		username: string
	): Promise<{ available: boolean }> {
		return apiClient.get<{ available: boolean }>("/auth/check-username", {
			params: { username },
			skipAuth: true,
		});
	}

	/**
	 * Get user's login history
	 */
	async getLoginHistory(): Promise<
		Array<{
			timestamp: string;
			ipAddress: string;
			userAgent: string;
			location?: undefined | string;
		}>
	> {
		return apiClient.get<
			Array<{
				timestamp: string;
				ipAddress: string;
				userAgent: string;
				location?: undefined | string;
			}>
		>("/auth/login-history");
	}

	/**
	 * Enable two-factor authentication
	 */
	async enableTwoFactor(): Promise<{ qrCode: string; backupCodes: string[] }> {
		return apiClient.post<{ qrCode: string; backupCodes: string[] }>(
			"/auth/2fa/enable"
		);
	}

	/**
	 * Verify two-factor authentication setup
	 */
	async verifyTwoFactor(code: string): Promise<{ success: boolean }> {
		return apiClient.post<{ success: boolean }>("/auth/2fa/verify", { code });
	}

	/**
	 * Disable two-factor authentication
	 */
	async disableTwoFactor(password: string): Promise<{ success: boolean }> {
		return apiClient.post<{ success: boolean }>("/auth/2fa/disable", {
			password,
		});
	}
}

// Export singleton instance
export const authApi = new AuthApiService();
export default authApi;
