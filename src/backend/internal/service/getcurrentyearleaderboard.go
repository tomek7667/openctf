package service

import (
	"context"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedyearlyteam"
)

type GetCurrentYearLeaderboardDto struct {
	Offset       int      `json:"offset,omitempty" form:"offset,omitempty"`
	Limit        int      `json:"limit,omitempty" form:"limit,omitempty"`
	Year         int      `json:"year,omitempty" form:"year,omitempty"`
	CountryCodes []string `json:"country_codes,omitempty" form:"country_codes,omitempty"`
	Recruiting   *bool    `json:"recruiting,omitempty" form:"recruiting,omitempty"`
	SortBy       *string  `json:"sort_by,omitempty" form:"sort_by,omitempty"`
	MinRating    float64  `json:"min_rating,omitempty" form:"min_rating,omitempty"`
	Search       *string  `json:"search,omitempty" form:"search,omitempty"`
}

func (c *Client) GetCurrentYearLeaderboard(ctx context.Context, dto *GetCurrentYearLeaderboardDto) ([]*ent.AggregatedYearlyTeam, error) {
	if dto.Limit > 30 || dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}
	if dto.Year <= 0 {
		// tODO: consider adding 10 days, so that e.g.: on Jan 10th we still have the last year's leaderboard
		now := time.Now()
		dto.Year = now.Year()
	}
	leaderboardQuery := c.C.AggregatedYearlyTeam.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		Where(aggregatedyearlyteam.Year(dto.Year))

	if len(dto.CountryCodes) > 0 {
		leaderboardQuery = leaderboardQuery.Where(aggregatedyearlyteam.CountryCodeIn(dto.CountryCodes...))
	}
	if dto.Recruiting != nil {
		leaderboardQuery = leaderboardQuery.Where(aggregatedyearlyteam.Recruiting(*dto.Recruiting))
	}
	if dto.MinRating > 0 {
		leaderboardQuery = leaderboardQuery.Where(aggregatedyearlyteam.TeamPointsGTE(dto.MinRating))
	}
	if dto.SortBy != nil {
		switch *dto.SortBy {
		case "points":
			leaderboardQuery = leaderboardQuery.Order(ent.Desc(aggregatedyearlyteam.FieldTeamPoints))
		case "rank":
			leaderboardQuery = leaderboardQuery.Order(ent.Asc(aggregatedyearlyteam.FieldRank))
		case "members":
			leaderboardQuery = leaderboardQuery.Order(ent.Desc(aggregatedyearlyteam.FieldMembers))
		case "avg_place":
			leaderboardQuery = leaderboardQuery.Order(ent.Asc(aggregatedyearlyteam.FieldAvgPlace))
		case "contests_count":
			leaderboardQuery = leaderboardQuery.Order(ent.Desc(aggregatedyearlyteam.FieldContestsCount))
		case "contests_won":
			leaderboardQuery = leaderboardQuery.Order(ent.Desc(aggregatedyearlyteam.FieldContestsWon))
		default:
			return nil, fmt.Errorf("invalid sort_by value: %s", *dto.SortBy)
		}
	} else {
		leaderboardQuery = leaderboardQuery.Order(ent.Desc(aggregatedyearlyteam.FieldTeamPoints))
	}
	if dto.Search != nil && *dto.Search != "" {
		leaderboardQuery = leaderboardQuery.Where(aggregatedyearlyteam.NameContains(*dto.Search))
	}

	leaderboard, err := leaderboardQuery.All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get leaderboard teams: %w", err)
	}
	return leaderboard, nil
}
