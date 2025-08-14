package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
)

type CreateContestDto struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Rules       string    `json:"ctftimeId,omitempty"`
	Prizes      string    `json:"prizes,omitempty"`
	Start       time.Time `json:"start"`
	End         time.Time `json:"end"`
	Url         string    `json:"url"`
	CtftimeID   *int
}

func (c *Client) CreateContest(ctx context.Context, organizers *ent.Team, dto *CreateContestDto) (*ent.Contest, error) {
	if dto.CtftimeID != nil {
	}
	createOp := c.C.Contest.
		Create().
		SetName(dto.Name).
		SetDescription(dto.Description).
		SetRules(dto.Rules).
		SetPrizes(dto.Prizes).
		SetStart(dto.Start).
		SetEnd(dto.End).
		SetDuration(dto.End.Sub(dto.Start).Hours()).
		SetURL(dto.Url)

		// the contest must have organizers or have ctftime ID
	if dto.CtftimeID != nil && *dto.CtftimeID != 0 {
		createOp.SetCtftimeID(*dto.CtftimeID)
		if organizers != nil {
			createOp.SetOrganizers(organizers)
		}
	} else {
		createOp.SetOrganizers(organizers)
	}

	ctst, err := createOp.
		Save(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a contest"), err)
	}
	ctst, err = c.C.Contest.
		Query().
		WithOrganizers().
		WithPlaces().
		Where(contest.ID(ctst.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("contest has been created but couldn't retrieve it"), err)
	}
	return ctst, nil
}
