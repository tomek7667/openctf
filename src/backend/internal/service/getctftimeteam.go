package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

func (c *Client) GetCtftimeTeam(ctx context.Context, ctftimeTeamId int) (*ent.Team, error) {
	return c.C.Team.
		Query().
		Where(team.CtftimeID(ctftimeTeamId)).
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		First(ctx)
}
