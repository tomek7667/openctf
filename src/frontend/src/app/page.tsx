import { getPlatformStats, PlatformStats } from "@/ssr/api/stats";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
	const stats: PlatformStats = await getPlatformStats();

	return <HomePageClient stats={stats} />;
}
