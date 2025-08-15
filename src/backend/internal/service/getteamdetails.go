package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedteamsdetails"
)

func (c *Client) GetTeamDetails(ctx context.Context, teamId int) (*ent.AggregatedTeamsDetails, error) {
	return c.C.AggregatedTeamsDetails.
		Query().
		Where(aggregatedteamsdetails.ID(teamId)).
		First(ctx)
}
