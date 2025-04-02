package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/contest"
)

// `GetContestsToBeUpdatedByPlacesCrawler` should retrieve db contests that:
// - have no places
// - have `end` in the past
// - have ctftime id defined
func (c *Client) GetContestsToBeUpdatedByPlacesCrawler(ctx context.Context) ([]*ent.Contest, error) {
	cntsts, err := c.C.Contest.
		Query().
		Where(
			contest.And(
				contest.Not(contest.HasPlaces()),
				contest.EndLTE(time.Now()),
				contest.CtftimeIDNotNil(),
			),
		).
		WithOrganizers().
		WithPlaces().
		All(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed getting the contests"), err)
	}
	return cntsts, nil
}
