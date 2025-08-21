import { getPlatformStats } from "@/ssr/api/stats";
import HomePageClient from "./HomePageClient";
import { getLeaderboardList } from "@/ssr/api/teams";

export default async function HomePage() {
	const stats = await getPlatformStats();
	const leaderboard = await getLeaderboardList({
		Offset: 0,
		Limit: 10,
		CountryCodes: [],
	});

	return <HomePageClient stats={stats} leaderboard={leaderboard} />;
}
