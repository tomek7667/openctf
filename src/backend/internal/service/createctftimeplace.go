package service

import (
	"context"

	"openctfbackend/ent"
)

type CreateCtftimePlaceDto struct {
	TeamName         string `json:"team_name"`
	CtftimeTeamID    *int
	Place            int     `json:"place"`
	ContestPoints    float64 `json:"contest_points"`
	ContestID        int     `json:"contest_id"`
	AssociatedTeamID *int    `json:"associated_team_id"`
}

func (c *Client) CreateCtftimePlace(ctx context.Context, dto *CreateCtftimePlaceDto) *ent.PlaceCreate {
	placeCreate := c.C.Place.
		Create().
		SetTeamName(dto.TeamName).
		SetPlace(dto.Place).
		SetContestPoints(dto.ContestPoints).
		SetAssociatedContestID(dto.ContestID)
	if dto.AssociatedTeamID != nil && *dto.AssociatedTeamID != 0 {
		placeCreate.SetAssociatedTeamID(*dto.AssociatedTeamID)
	}
	if dto.CtftimeTeamID != nil && *dto.CtftimeTeamID != 0 {
		placeCreate.SetCtftimeTeamID(*dto.CtftimeTeamID)
	}
	return placeCreate
}
