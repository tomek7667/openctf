import { BASE_URL } from "./constant";
import { sleep } from "@/lib/utils";
import type { LoginDto, RegisterDto, AuthResponse, User } from "@/types/api";

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
	console.log(BASE_URL);
	await sleep(1000);
	// TODO: implement login
	return {
		token: "mock_jwt_token_" + Date.now(),
		user: {
			id: 1,
			username: credentials.identity,
			email: credentials.identity.includes("@")
				? credentials.identity
				: `${credentials.identity}@example.com`,
			created_at: new Date().toISOString(),
			password: "[HIDDEN]",
			permission_level: "player",
		},
	};
};

export const register = async (
	userData: RegisterDto
): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(userData),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	const { user, token } = data;
	return {
		token,
		user,
	};
};

export const getCurrentUser = async (): Promise<User> => {
	await sleep(1000);
	// TODO: implement getCurrentUser
	return {
		id: 1,
		username: "mockuser",
		email: "mockuser@example.com",
		created_at: new Date().toISOString(),
		password: "[HIDDEN]",
		permission_level: "player",
	};
};

export const logout = async (): Promise<void> => {
	await sleep(1000);
	// TODO: implement logout
};

export const forgotPassword = async (
	_email: string
): Promise<{ success: boolean; message: string }> => {
	await sleep(1000);
	// TODO: implement forgotPassword
	return {
		success: true,
		message: "Password reset instructions sent to your email",
	};
};

export const resetPassword = async (
	_token: string,
	_newPassword: string
): Promise<{ success: boolean; message: string }> => {
	await sleep(1000);
	// TODO: implement resetPassword
	return {
		success: true,
		message: "Password reset successfully",
	};
};
