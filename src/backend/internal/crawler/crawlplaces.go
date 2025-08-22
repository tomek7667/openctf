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
	ctx := context.Background()
	slog.Info("running the places crawler")

	contests, err := h.ServiceClient.GetContestsToBeUpdatedByPlacesCrawler(ctx)
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
			slog.Debug(
				"the contest doesn't have the places in ctftime yet",
				"contest name", c.Name,
				"contest id", *c.CtftimeID,
			)
			continue
		}

		tx, err := h.ServiceClient.GetEnt().BeginTx(ctx, nil)

		shouldAbort := false
		var createQueries []*ent.PlaceCreate
		for _, score := range scores {
			var associatedDbTeamID *int
			var dbTeam *ent.Team
			// get db team for potential edge
			dbTeam, err = h.ServiceClient.GetCtftimeTeam(
				ctx, score.CtftimeTeamID,
			)
			if err == nil && dbTeam.ID != 0 {
				associatedDbTeamID = &dbTeam.ID
			}

			// make teams if they don't exist by name; assign ctftime id and add verified for the admin user being a creator.
			if dbTeam == nil {
				dbTeam, err = h.ServiceClient.CreateCrawlerTeam(ctx, tx, &service.CreateCrawlerTeamDto{
					CtftimeTeamID:   score.CtftimeTeamID,
					CtftimeTeamName: score.CtftimeTeamName,
				})
				if err != nil {
					slog.Error(
						"creating crawler team failed",
						"contest", c.Name,
						"ctftime team id", score.CtftimeTeamID,
						"ctftime team name", score.CtftimeTeamName,
						"err", err,
					)
					shouldAbort = true
					break
				}
				associatedDbTeamID = &dbTeam.ID
			}

			// create place in the db
			createdPlaceQuery := h.ServiceClient.CreateCtftimePlace(ctx, tx, &service.CreateCtftimePlaceDto{
				ContestID:        c.ID,
				TeamName:         score.CtftimeTeamName,
				Place:            score.Place,
				ContestPoints:    score.CtfPoints,
				AssociatedTeamID: associatedDbTeamID,
			})
			createQueries = append(createQueries, createdPlaceQuery)
		}
		if shouldAbort {
			slog.Warn(
				"the contest will be rolled back as an error appeared along the way",
				"err", err,
				"contest name", c.Name,
			)
			err = tx.Rollback()
			if err != nil {
				slog.Error(
					"rolling back failed for crawled contest",
					"contest name", c.Name,
					"err", err,
				)
			}
			continue
		}

		// actually creating the places in the places table
		createdPlaces, err := tx.Place.
			CreateBulk(createQueries...).
			Save(ctx)
		if err != nil {
			err = tx.Rollback()
			if err != nil {
				slog.Error(
					"rolling back failed for crawled contest",
					"contest name", c.Name,
					"err", err,
				)
			}
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
		_, err = tx.Contest.UpdateOne(c).AddPlaces(createdPlaces...).Save(ctx)
		if err != nil {
			err = tx.Rollback()
			if err != nil {
				slog.Error(
					"rolling back failed for crawled contest",
					"contest name", c.Name,
					"err", err,
				)
			}
			slog.Error(
				"failed updating the contest with new places",
				"err", err,
				"contest", c.Name,
				"places amount to be saved", len(createdPlaces),
				"last place example", createdPlaces[len(createdPlaces)-1],
			)
			continue
		}

		if err = tx.Commit(); err != nil {
			slog.Error(
				"committing the transaction failed",
				"err", err,
				"contest name", c.Name,
				"places amount to be saved", len(createdPlaces),
			)
			continue
		}
		slog.Info("saved places for contest", "contest name", c.Name, "amount of created places", len(createdPlaces))
	}
	slog.Info("places crawler finished")
	return nil
}
