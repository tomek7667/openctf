import { redirect } from "next/navigation";
import TeamPageClient from "./TeamPageClient";
import { getTeamDetails } from "@/ssr/api/teams";
import { GoBack } from "./GoBack";

export default async function TeamPage({
	params: { id },
}: {
	params: { id: string };
}) {
	if (isNaN(Number(id))) {
		return redirect("/teams");
	}
	const teamId = Number(id);
	try {
		const team = await getTeamDetails(teamId);
		return <TeamPageClient team={team} />;
	} catch (err: any) {
		return <GoBack err={err?.message} />;
	}
}
