package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

type CreateTeamDto struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	CtftimeID   *int   `json:"ctftimeId,omitempty"`
	Logo        []byte
}

func (c *Client) CreateTeam(ctx context.Context, captain *ent.User, dto *CreateTeamDto) (*ent.Team, error) {
	tq := c.C.Team.
		Create().
		SetDescription(dto.Description).
		SetName(dto.Name).
		SetLogo(dto.Logo).
		SetCaptain(captain).
		AddMembers(captain)

	if dto.CtftimeID != nil && *dto.CtftimeID != 0 {
		tq.SetCtftimeID(*dto.CtftimeID)
	}

	t, err := tq.Save(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a team"), err)
	}
	t, err = c.C.Team.
		Query().
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		Where(team.ID(t.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("team has been created but couldn't retrieve it"), err)
	}
	return t, nil
}
