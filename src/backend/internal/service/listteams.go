package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

type ListTeamsDto struct {
	Offset       int      `json:"offset,omitempty" form:"offset,omitempty"`
	Limit        int      `json:"limit,omitempty" form:"limit,omitempty"`
	CountryCodes []string `json:"countryCodes,omitempty" form:"countryCodes,omitempty"`
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

	tq := c.C.Team.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		WithCaptain().
		WithMembers().
		WithVerifiedBy()

	if len(dto.CountryCodes) > 0 {
		tq.Where(team.CountryCodeIn(dto.CountryCodes...))
	}

	t, err := tq.
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed creating a team: %w", err)
	}
	return t, nil
}
