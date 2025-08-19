package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedteamdetails"
)

func (c *Client) GetTeamDetails(ctx context.Context, teamId int) (*ent.AggregatedTeamDetails, error) {
	return c.C.AggregatedTeamDetails.
		Query().
		Where(aggregatedteamdetails.ID(teamId)).
		First(ctx)
}
