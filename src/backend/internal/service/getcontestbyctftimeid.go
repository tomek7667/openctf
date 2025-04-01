package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
)

func (c *Client) GetContestByCtftimeID(ctx context.Context, ctftimeID int) (*ent.Contest, error) {
	return c.C.Contest.
		Query().
		Where(contest.CtftimeID(ctftimeID)).
		WithOrganizers().
		First(ctx)
}
