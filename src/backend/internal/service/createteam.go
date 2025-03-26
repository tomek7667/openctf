package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
)

type CreateTeamDto struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	// LogoUrl    []byte `json:"password"`
}

func (c *Client) CreateTeam(ctx context.Context, captain *ent.User, dto *CreateTeamDto) (*ent.Team, error) {
	t, err := c.C.Team.
		Create().
		SetName(dto.Name).
		SetDescription(dto.Description).
		SetCaptain(captain).
		Save(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a team"), err)
	}
	return t, nil
}
