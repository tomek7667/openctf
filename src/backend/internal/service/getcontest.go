package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
)

func (c *Client) GetContest(ctx context.Context, contestId int) (*ent.Contest, error) {
	return c.C.Contest.
		Query().
		Where(contest.ID(contestId)).
		WithOrganizers().
		WithPlaces().
		First(ctx)
}
