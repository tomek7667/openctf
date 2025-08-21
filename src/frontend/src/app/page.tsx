import { getPlatformStats } from "@/ssr/api/stats";
import HomePageClient from "./HomePageClient";

export default async function HomePage() {
	const stats = await getPlatformStats();

	return <HomePageClient stats={stats} />;
}
