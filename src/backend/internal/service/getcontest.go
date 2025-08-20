package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
	"openctfbackend/ent/place"
)

func (c *Client) GetContest(ctx context.Context, contestId int) (*ent.Contest, error) {
	return c.C.Contest.
		Query().
		Where(contest.ID(contestId)).
		WithOrganizers().
		WithPlaces(func(pq *ent.PlaceQuery) {
			pq.
				WithAssociatedTeam().
				Order(ent.Asc(place.FieldPlace))
		}).
		First(ctx)
}
