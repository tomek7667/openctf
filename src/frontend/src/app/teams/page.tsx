import TeamsPageClient from "./TeamsPageClient";
import { getLeaderboardList } from "@/ssr/api/teams";
import { GoBack } from "@/components/layout/GoBack";
import { getPlatformStats } from "@/ssr/api/stats";

export default async function TeamsPage() {
	try {
		const teamsList = await getLeaderboardList();
		const platformStats = await getPlatformStats();

		return (
			<TeamsPageClient teamsList={teamsList} platformStats={platformStats} />
		);
	} catch (err: any) {
		return <GoBack err={err?.message} />;
	}
}
