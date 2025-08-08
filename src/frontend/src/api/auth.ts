import { sleep } from "@/lib/utils";
import type { LoginDto, RegisterDto, AuthResponse, User } from "@/types/api";

export const login = async (credentials: LoginDto): Promise<AuthResponse> => {
	await sleep(1000);
	// TODO: implement login
	return {
		token: "mock_jwt_token_" + Date.now(),
		user: {
			id: 1,
			username: credentials.identity,
			email: credentials.identity.includes("@") ? credentials.identity : `${credentials.identity}@example.com`,
			created_at: new Date().toISOString(),
			password: "[HIDDEN]",
			permission_level: "player",
		},
	};
};

export const register = async (userData: RegisterDto): Promise<AuthResponse> => {
	await sleep(1000);
	// TODO: implement register
	return {
		token: "mock_jwt_token_" + Date.now(),
		user: {
			id: Math.floor(Math.random() * 1000) + 1,
			username: userData.username,
			email: userData.email,
			created_at: new Date().toISOString(),
			password: "[HIDDEN]",
			permission_level: "player",
		},
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