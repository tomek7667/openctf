package crawler

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strconv"

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

	addedPlaces := 0
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
			_, err = h.ServiceClient.CreateCtftimePlace(context.TODO(), &service.CreateCtftimePlaceDto{
				TeamName:         ctftimeTeam.Name,
				Place:            score.Place,
				ContestPoints:    points,
				ContestID:        c.ID,
				AssociatedTeamID: associatedDbTeamID,
			})
			if err != nil {
				slog.Error(
					"failed creating ctftime place in the database",
					"err", err,
					"contest", c.Name,
					"score team id", score.CtftimeTeamID,
				)
			} else {
				addedPlaces++
			}
		}
	}
	slog.Info("places crawler finished", "added places", addedPlaces)
	return nil
}
