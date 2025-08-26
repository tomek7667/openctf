package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
)

type RateContestDifficultyDto struct {
	Difficulty int     `json:"difficulty"`
	Comment    *string `json:"comment"`
}

const SqlCaptainPlaceInContest = `
select
	(
		select
				max(p.place)
		from
			places p
		left join teams t on
			p.place_associated_team = t.id
		where
				p.associated_contest_id = $2
			and
				t.team_captain = $1
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

func (c *Client) RateContestDifficulty(
	ctx context.Context,
	requester *ent.User,
	contestId int,
	dto *RateContestDifficultyDto,
) (*ent.ContestRating, error) {
	// TODO: team captain id extract based on team id;
	return nil, fmt.Errorf("not implemented yet")
	// res, err := c.C.QueryContext(ctx, SqlCaptainPlaceInContest, requester.ID, contestId)
	// if err != nil {
	// 	return nil, errors.Join(
	// 		fmt.Errorf("something went wrong while finding your team's place in the contest"),
	// 		err,
	// 	)
	// }
	// defer res.Close()
	// var place sql.NullInt64
	// var totalPlaces int
	// if res.Next() {
	// 	if err := res.Scan(&place, &totalPlaces); err != nil {
	// 		return nil, errors.Join(
	// 			fmt.Errorf("failed to scan result"),
	// 			err,
	// 		)
	// 	}
	// }
	// if !place.Valid {
	// 	return nil, fmt.Errorf("place was not found")
	// }
	// relevant := false
	// if float64(place.Int64) <= float64(totalPlaces)*0.05 {
	// 	relevant = true
	// }
	// createContestOpinonQ := c.C.WeightRating.
	// 	Create().
	// 	SetDifficulty(dto.Difficulty).
	// 	SetCaptainsTeamID(requester.).
	// 	SetContestID(contestId)

	// _opinion, err := createContestOpinonQ.Save(ctx)
	// if err != nil {
	// 	return nil, errors.Join(
	// 		fmt.Errorf("failed creating the contest rating in the database"),
	// 		err,
	// 	)
	// }
	// opinion, err := c.C.ContestRating.
	// 	Query().
	// 	WithContest().
	// 	WithUser().
	// 	Where(contestrating.ID(_opinion.ID)).
	// 	First(ctx)
	// if err != nil {
	// 	return nil, errors.Join(
	// 		fmt.Errorf("the rating was created in the database but there was a problem with retrieving it"),
	// 		err,
	// 	)
	// }
	// return opinion, nil
}
