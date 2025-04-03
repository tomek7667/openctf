package crawler

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"openctfbackend/ent"
	"openctfbackend/internal/service"
)

func (h *Handler) CrawlPlaces() error {
	slog.Info("running the places crawler")

	contests, err := h.ServiceClient.GetContestsToBeUpdatedByPlacesCrawler(context.TODO())
	if err != nil {
		return errors.Join(
			fmt.Errorf("crawl places failed getting existing contests from the database"),
			err,
		)
	}
	slog.Info(
		"found contests to be updated by the places crawler",
		"num of contests", len(contests),
	)
	for _, c := range contests {
		scores, err := h.CtftimeClient.GetEventPlaces(*c.CtftimeID)
		if err != nil {
			slog.Warn(
				"requesting or parsing places of an ctftime event failed",
				"err", err,
				"contest id", *c.CtftimeID,
				"contest name", c.Name,
			)
			continue
		}
		if len(scores) == 0 {
			continue
		}

		var createQueries []*ent.PlaceCreate
		for _, score := range scores {
			var associatedDbTeamID *int
			// get db team for potential edge
			dbTeam, err := h.ServiceClient.GetCtftimeTeam(
				context.TODO(), score.CtftimeTeamID,
			)
			if err == nil && dbTeam.ID != 0 {
				associatedDbTeamID = &dbTeam.ID
			}

			// create place in the db
			createdPlaceQuery := h.ServiceClient.CreateCtftimePlace(context.TODO(), &service.CreateCtftimePlaceDto{
				ContestID:        c.ID,
				TeamName:         score.CtftimeTeamName,
				Place:            score.Place,
				ContestPoints:    score.CtfPoints,
				AssociatedTeamID: associatedDbTeamID,
			})
			createQueries = append(createQueries, createdPlaceQuery)
		}

		// actually creating the places in the places table
		createdPlaces, err := h.ServiceClient.GetEnt().
			Place.
			CreateBulk(createQueries...).
			Save(context.TODO())
		if err != nil {
			slog.Error(
				"saving ctftime places in the database failed",
				"err", err,
				"contest ctftime name", c.Name,
				"contest ctftime id", *c.CtftimeID,
				"contest db id", c.ID,
			)
			continue
		}

		// updating the contest places
		_, err = h.ServiceClient.GetEnt().Contest.UpdateOne(c).AddPlaces(createdPlaces...).Save(context.TODO())
		if err != nil {
			slog.Error(
				"failed updating the contest with new places",
				"err", err,
				"contest", c.Name,
				"places amount to be saved", len(createdPlaces),
				"last place example", createdPlaces[len(createdPlaces)-1],
			)
			continue
		}
		slog.Info("saved places for contest", "contest name", c.Name, "amount of created places", len(createdPlaces))
	}
	slog.Info("places crawler finished")
	return nil
}
