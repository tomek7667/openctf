package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
)

type ListTeamsDto struct {
	Offset int `json:"offset,omitempty"`
	Limit  int `json:"limit,omitempty"`
}

func (c *Client) ListTeams(ctx context.Context, dto *ListTeamsDto) ([]*ent.Team, error) {
	if dto.Limit > 100 {
		dto.Limit = 100
	}
	if dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}

	t, err := c.C.Team.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		All(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a team"), err)
	}
	return t, nil
}
