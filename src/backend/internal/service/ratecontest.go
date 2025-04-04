package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"openctfbackend/ent"
)

type RateContestDto struct {
	Rating int `json:"rating"`
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

func (c *Client) RateContest(
	ctx context.Context,
	requester *ent.User,
	contestId int,
	dto *RateContestDto,
) (*ent.ContestRating, error) {
	// if the user is not a member of any team that took part in the contest and got
	// at least top 15%, then the rating "relevant" field should be set to false.
	// isInAnyTeam := false
	res, err := c.C.QueryContext(ctx, SqlUserTeamPlaceInContest, requester.ID, contestId)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("something went wrong while finding your place in the contest"),
			err,
		)
	}
	defer res.Close()
	var place, totalPlaces int
	if res.Next() {
		if err := res.Scan(&place, &totalPlaces); err != nil {
			return nil, errors.Join(
				fmt.Errorf("failed to scan result"),
				err,
			)
		}
	}
	// TODO fix  "failed to scan result\nsql: Scan error on column index 0, name \"place\": converting NULL to int is unsupported",
	// for unexisting -- there was this sql func something like unwrap or sth like this that chooses first non null val, maybe return -1 then
	slog.Info("found n places", "r", place, "e", totalPlaces)
	return nil, nil
}
