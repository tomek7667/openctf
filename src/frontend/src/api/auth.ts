import { BASE_URL } from "./constant";
import { sleep } from "@/lib/utils";
import type { LoginDto, RegisterDto, AuthResponse } from "@/types/api";

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(credentials),
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

export const logout = async (): Promise<void> => {
	// TODO: invalidating tokens on BE side
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

export const changePassword = async (
	_token: string,
	dto: {
		old_password: string;
		new_password: string;
	}
): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: _token,
		},
		credentials: "include",
		body: JSON.stringify(dto),
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

export const verifyEmail = async (code: string): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/verify`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify({ code }),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "Email verification failed");
	}
	const { user, token } = data;
	return { token, user };
};

export const connectGithub = async (
	token: string,
	code: string
): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/connect-github`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
		body: JSON.stringify({
			code,
		}),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(
			message ?? "Connecting with github failed. Please try again later."
		);
	}
	return data;
};

export const disconnectGithub = async (
	token: string
): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/disconnect-github`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: token,
		},
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(
			message ?? "Disconnecting with github failed. Please try again later."
		);
	}
	console.log(data);
	return data;
};

export const loginGithub = async (code: string): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/login-github`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			code,
		}),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(
			message ?? "Signing in with github failed. Please try again later."
		);
	}
	return data;
};

export const registerGithub = async (code: string): Promise<AuthResponse> => {
	const response = await fetch(`${BASE_URL}/api/auth/register-github`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			code,
		}),
	});
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(
			message ?? "Signing in with github failed. Please try again later."
		);
	}
	return data;
};
