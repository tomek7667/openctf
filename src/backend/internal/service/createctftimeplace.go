package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/place"
)

type CreateCtftimePlaceDto struct {
	TeamName         string  `json:"team_name"`
	Place            int     `json:"place"`
	ContestPoints    float64 `json:"contest_points"`
	ContestID        int     `json:"contest_id"`
	AssociatedTeamID *int    `json:"associated_team_id"`
}

func (c *Client) CreateCtftimePlace(ctx context.Context, dto *CreateCtftimePlaceDto) (*ent.Place, error) {
	placeCreate := c.C.Place.
		Create().
		SetTeamName(dto.TeamName).
		SetPlace(dto.Place).
		SetContestPoints(dto.ContestPoints).
		SetAssociatedContestID(dto.ContestID)
	if dto.AssociatedTeamID != nil && *dto.AssociatedTeamID != 0 {
		placeCreate.SetAssociatedTeamID(*dto.AssociatedTeamID)
	}
	p, err := placeCreate.Save(ctx)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("creating the place in db failed"),
			err,
		)
	}
	p, err = c.C.Place.
		Query().
		WithAssociatedTeam().
		WithAssociatedContest().
		Where(place.ID(p.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("place has been created but couldn't retrieve it"),
			err,
		)
	}

	return p, nil
}
