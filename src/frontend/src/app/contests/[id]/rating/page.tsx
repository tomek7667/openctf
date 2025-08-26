import { getContest, getContestRatings } from "@/ssr/api/contests";
import RatingPageClient from "./RatingPageClient";
import { GoBack } from "@/components/layout/GoBack";

export default async function ContestRatingPage({
	params: { id },
}: {
	params: { id: string };
}) {
	try {
		const contestId = parseInt(id as string);
		const {
			weight_ratings,
			opinion_ratings,
			eligible_weight_voters,
			eligible_opinion_voters,
		} = await getContestRatings(contestId);
		const contest = await getContest(contestId);
		return (
			<RatingPageClient
				opinion_ratings={opinion_ratings}
				weight_ratings={weight_ratings}
				eligible_weight_voters={eligible_weight_voters}
				eligible_opinion_voters={eligible_opinion_voters}
				contest={contest}
			/>
		);
	} catch (err: any) {
		return (
			<GoBack
				err={
					err?.message ??
					"Something went wrong. Please try again or contact the administrator if the issue persists."
				}
			/>
		);
	}
}
