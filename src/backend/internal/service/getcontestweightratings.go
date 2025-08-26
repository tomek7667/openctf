package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
	"openctfbackend/ent/weightrating"
)

func (c *Client) GetContestWeightRatings(ctx context.Context, contestId int) ([]*ent.WeightRating, error) {
	return c.C.
		WeightRating.
		Query().
		Where(
			weightrating.HasContestWith(
				contest.ID(contestId),
			),
		).
		WithCaptainsTeam(
			func(tq *ent.TeamQuery) {
				tq.WithCaptain()
			},
		).
		All(ctx)
}
