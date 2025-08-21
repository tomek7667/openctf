import TeamsPageClient from "./TeamsPageClient";
import { getLeaderboardList } from "@/ssr/api/teams";
import { GoBack } from "@/components/layout/GoBack";

export default async function TeamsPage() {
	try {
		const teamsList = await getLeaderboardList();
		console.log(teamsList);
		return <TeamsPageClient teamsList={teamsList} />;
	} catch (err: any) {
		return <GoBack err={err?.message} />;
	}
}
