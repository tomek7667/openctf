package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

func (c *Client) GetTeam(ctx context.Context, teamId int) (*ent.Team, error) {
	return c.C.Team.
		Query().
		Where(team.ID(teamId)).
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		First(ctx)
}
