package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
)

type ListContestsDto struct {
	Offset int `json:"offset,omitempty" form:"offset,omitempty"`
	Limit  int `json:"limit,omitempty" form:"limit,omitempty"`
}

func (c *Client) ListContests(ctx context.Context, dto *ListContestsDto) ([]*ent.AggregatedContest, error) {
	if dto.Limit > 100 {
		dto.Limit = 100
	}
	if dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}

	t, err := c.C.AggregatedContest.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed listing contests: %w", err)
	}
	return t, nil
}
