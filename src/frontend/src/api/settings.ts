import { sleep } from "@/lib/utils";
import { GH_CLIENT_ID } from "./constant";

export interface PasswordChangeDto {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface NotificationSettings {
	email: boolean;
	browser: boolean;
	contests: boolean;
	writeups: boolean;
}

export interface PrivacySettings {
	profilePublic: boolean;
	showEmail: boolean;
	showLocation: boolean;
}

export interface ConnectionSettings {
	github: string;
	ctftime: string;
	discord: string;
}

export const changePassword = async (
	data: PasswordChangeDto
): Promise<{ success: boolean; message: string }> => {
	await sleep(1000);
	if (data.newPassword !== data.confirmPassword) {
		return { success: false, message: "Passwords do not match" };
	}
	return { success: true, message: "Password updated successfully" };
};

export const updateNotifications = async (
	_settings: NotificationSettings
): Promise<{ success: boolean; message: string }> => {
	await sleep(800);
	return { success: true, message: "Notification settings updated" };
};

export const updatePrivacy = async (
	_settings: PrivacySettings
): Promise<{ success: boolean; message: string }> => {
	await sleep(800);
	return { success: true, message: "Privacy settings updated" };
};

export const updateConnections = async (
	_connections: ConnectionSettings
): Promise<{ success: boolean; message: string }> => {
	await sleep(1000);
	return { success: true, message: "Connected services updated" };
};
