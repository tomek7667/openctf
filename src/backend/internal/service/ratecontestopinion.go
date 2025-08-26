package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/contestrating"
)

type RateContestOpinionDto struct {
	Rating  int     `json:"rating"`
	Comment *string `json:"comment"`
}

const SqlUserTeamPlaceInContest = `
select
	(
		select
				max(p.place)
		from
			places p
		left join team_members tm on
			p.place_associated_team = tm.team_id
		where
				p.associated_contest_id = $2
			and
				tm.user_id = $1
	) as "place",
	(
	select
		count(id)
	from
		places
	where
		associated_contest_id = $2
	) as "total_places";
`

func (c *Client) RateContestOpinion(
	ctx context.Context,
	requester *ent.User,
	contestId int,
	dto *RateContestOpinionDto,
) (*ent.ContestRating, error) {
	// if the user is not a member of any team that took part in the contest and got
	// at least top 30%, then the rating "relevant" field should be set to false.
	res, err := c.C.QueryContext(ctx, SqlUserTeamPlaceInContest, requester.ID, contestId)
	if err != nil {
		return nil, fmt.Errorf("something went wrong while finding your place in the contest: %w", err)
	}
	defer res.Close()
	var place sql.NullInt64
	var totalPlaces int
	if res.Next() {
		if err := res.Scan(&place, &totalPlaces); err != nil {
			return nil, errors.Join(
				fmt.Errorf("failed to scan result"),
				err,
			)
		}
	}
	if !place.Valid {
		return nil, fmt.Errorf("place was not found")
	}
	relevant := false
	if float64(place.Int64) <= float64(totalPlaces)*0.30 {
		relevant = true
	}
	createContestOpinonQ := c.C.ContestRating.
		Create().
		SetRating(dto.Rating).
		SetRelevant(relevant).
		SetUserID(requester.ID).
		SetContestID(contestId)
	if dto.Comment != nil && *dto.Comment != "" {
		createContestOpinonQ.SetComment(*dto.Comment)
	}

	_opinion, err := createContestOpinonQ.Save(ctx)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("failed creating the contest rating in the database"),
			err,
		)
	}
	opinion, err := c.C.ContestRating.
		Query().
		WithContest().
		WithUser().
		Where(contestrating.ID(_opinion.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("the rating was created in the database but there was a problem with retrieving it"),
			err,
		)
	}
	return opinion, nil
}
