package crawler

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"

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

	ctftimeResponse, err := h.CtftimeClient.GetCurrentYearResults(context.TODO())
	if err != nil {
		return errors.Join(
			fmt.Errorf("crawl places failed getting current year results"),
			err,
		)
	}
	slog.Info(
		"ctftime response received crawl places",
	)

	for _, c := range contests {
		res, exists := (*ctftimeResponse)[*c.CtftimeID]
		if !exists {
			slog.Debug(
				"this ctf doesn't have the results in the ctftime reponse",
				"contest id", *c.CtftimeID,
				"contest name", c.Name,
			)
			continue
		}

		var createQueries []*ent.PlaceCreate
		slog.Debug("preparing bulk create", "scores to be prepared", len(res.Scores), "contest", c.Name)
		for _, score := range res.Scores {
			var points float64
			if points, err = strconv.ParseFloat(score.Points, 64); err != nil {
				slog.Error(
					"failed parsing points to float64",
					"err", err,
					"score", score,
				)
				continue
			}

			// get ctftime team for db Place
			ctftimeTeam, err := h.CtftimeClient.GetTeam(score.CtftimeTeamID)
			if err != nil {
				slog.Error(
					"failed getting the team from ctftime",
					"err", err,
					"score that failed", score,
					"contest", c.Name,
				)
				continue
			}

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
				TeamName:         ctftimeTeam.Name,
				Place:            score.Place,
				ContestPoints:    points,
				ContestID:        c.ID,
				AssociatedTeamID: associatedDbTeamID,
			})
			createQueries = append(createQueries, createdPlaceQuery)
		}
		createdPlaces, err := h.ServiceClient.GetEnt().Place.CreateBulk(createQueries...).Save(context.TODO())
		if err != nil {
			slog.Error(
				"saving ctftime places in the database failed",
				"err", err,
				"contest ctftime name", c.Name,
				"contest ctftime id", c.CtftimeID,
			)
			continue
		}

		// 	addedPlaces++
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
