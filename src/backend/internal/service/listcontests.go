package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
)

type ListContestsDto struct {
	Offset int `json:"offset,omitempty" form:"offset,omitempty"`
	Limit  int `json:"limit,omitempty" form:"limit,omitempty"`
}

func (c *Client) ListContests(ctx context.Context, dto *ListContestsDto) ([]*ent.Contest, error) {
	if dto.Limit > 100 {
		dto.Limit = 100
	}
	if dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}

	t, err := c.C.Contest.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		WithOrganizers().
		WithPlaces().
		All(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a contest"), err)
	}
	return t, nil
}
