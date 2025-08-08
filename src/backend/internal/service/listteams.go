package service

import (
	"context"
	"errors"
	"fmt"
	"math"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

type ListTeamsDto struct {
	Offset       int      `json:"offset,omitempty" form:"offset,omitempty"`
	Limit        int      `json:"limit,omitempty" form:"limit,omitempty"`
	CountryCodes []string `json:"countryCodes,omitempty" form:"countryCodes,omitempty"`
}

type PaginationMeta struct {
	Offset      int  `json:"offset"`
	Limit       int  `json:"limit"`
	Total       int  `json:"total"`
	HasNext     bool `json:"hasNext"`
	HasPrev     bool `json:"hasPrev"`
	TotalPages  int  `json:"totalPages"`
	CurrentPage int  `json:"currentPage"`
}

type PaginatedTeamsResponse struct {
	Items      []*ent.Team     `json:"items"`
	Pagination *PaginationMeta `json:"pagination"`
}

func (c *Client) ListTeams(ctx context.Context, dto *ListTeamsDto) (*PaginatedTeamsResponse, error) {
	if dto.Limit > 100 {
		dto.Limit = 100
	}
	if dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}

	// Build base query for counting
	baseQuery := c.C.Team.Query()
	if len(dto.CountryCodes) > 0 {
		baseQuery = baseQuery.Where(team.CountryCodeIn(dto.CountryCodes...))
	}

	// Get total count
	totalCount, err := baseQuery.Count(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed to count teams"), err)
	}

	// Build query for fetching teams
	tq := c.C.Team.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset).
		WithCaptain().
		WithMembers().
		WithVerifiedBy()

	if len(dto.CountryCodes) > 0 {
		tq = tq.Where(team.CountryCodeIn(dto.CountryCodes...))
	}

	teams, err := tq.All(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed to fetch teams"), err)
	}

	// Calculate pagination metadata
	totalPages := int(math.Ceil(float64(totalCount) / float64(dto.Limit)))
	currentPage := (dto.Offset / dto.Limit) + 1
	hasNext := dto.Offset+dto.Limit < totalCount
	hasPrev := dto.Offset > 0

	pagination := &PaginationMeta{
		Offset:      dto.Offset,
		Limit:       dto.Limit,
		Total:       totalCount,
		HasNext:     hasNext,
		HasPrev:     hasPrev,
		TotalPages:  totalPages,
		CurrentPage: currentPage,
	}

	return &PaginatedTeamsResponse{
		Items:      teams,
		Pagination: pagination,
	}, nil
}
