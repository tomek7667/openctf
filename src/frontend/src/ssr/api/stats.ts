import { PlatformStats } from "@/api/statistics";
import { LOCAL_API_BASE_URL } from "./constant";

export const getPlatformStats = async (): Promise<PlatformStats> => {
	const url = `${LOCAL_API_BASE_URL}/api/statistics`;
	// console.log(`-> ${url}`);
	const response = await fetch(url);
	const { data, success, message } = await response.json();
	if (!success) {
		throw new Error(message ?? "unknown error occurred");
	}
	// console.log(`<- ${JSON.stringify(data, null, 2)}`);
	return data as PlatformStats;
};
