package service

import (
	"context"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedyearlyteam"
)

type GetCurrentYearLeaderboardDto struct {
	Offset int `json:"offset,omitempty" form:"offset,omitempty"`
	Limit  int `json:"limit,omitempty" form:"limit,omitempty"`
	Year   int `json:"year,omitempty" form:"year,omitempty"`
}

func (c *Client) GetCurrentYearLeaderboard(ctx context.Context, dto *GetCurrentYearLeaderboardDto) ([]*ent.AggregatedYearlyTeam, error) {
	if dto.Limit > 100 || dto.Limit <= 0 {
		dto.Limit = 100
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}
	if dto.Year <= 0 {
		// consider adding 10 days, so that e.g.: on Jan 10th we still have the last year's leaderboard
		now := time.Now()
		dto.Year = now.Year()
	}
	leaderboard, err := c.C.AggregatedYearlyTeam.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		Where(aggregatedyearlyteam.Year(dto.Year)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get leaderboard teams: %w", err)
	}
	return leaderboard, nil
}
