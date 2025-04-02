package service

import (
	"context"
	"fmt"
	"strings"

	"openctfbackend/ent"
)

type CreateCtftimePlaceDto struct {
	TeamName         string  `json:"team_name"`
	Place            int     `json:"place"`
	ContestPoints    float64 `json:"contest_points"`
	ContestID        int     `json:"contest_id"`
	AssociatedTeamID *int    `json:"associated_team_id"`
}

func sanitizeCtftimeTeamName(ctftimeTeamName string) string {
	sanitized := ""
	for _, r := range ctftimeTeamName {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == ' ' || r == '_' || r == '-' {
			sanitized += string(r)
		} else {
			sanitized += fmt.Sprintf("%X", r)
		}
	}
	return strings.TrimSpace(sanitized)
}

func (c *Client) CreateCtftimePlace(ctx context.Context, dto *CreateCtftimePlaceDto) *ent.PlaceCreate {
	placeCreate := c.C.Place.
		Create().
		SetTeamName(sanitizeCtftimeTeamName(dto.TeamName)).
		SetPlace(dto.Place).
		SetContestPoints(dto.ContestPoints).
		SetAssociatedContestID(dto.ContestID)
	if dto.AssociatedTeamID != nil && *dto.AssociatedTeamID != 0 {
		placeCreate.SetAssociatedTeamID(*dto.AssociatedTeamID)
	}
	return placeCreate
}
