package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
	"openctfbackend/ent/contestrating"
)

func (c *Client) GetContestRatings(ctx context.Context, contestId int) ([]*ent.ContestRating, error) {
	return c.C.
		ContestRating.
		Query().
		Where(
			contestrating.HasContestWith(
				contest.ID(contestId),
			),
		).
		WithUser().
		All(ctx)
}
