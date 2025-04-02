package crawler

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"

	"openctfbackend/internal/service"
)

func (h *Handler) CrawlContests(interval time.Duration) error {
	slog.Info("running the contests crawler")

	start := time.Now().Add(-interval)
	finish := start.Add(interval)
	ctftimeEvents, err := h.CtftimeClient.GetEventsBetween(context.Background(), start, finish)
	if err != nil {
		return errors.Join(fmt.Errorf("getting ctf teams failed"), err)
	}
	slog.Debug("crawler found ctftime events", "num of events", len(ctftimeEvents))

	var errs error
	added := 0
	for _, ctftimeEvent := range ctftimeEvents {
		dbContest, err := h.ServiceClient.GetContestByCtftimeID(
			context.TODO(), ctftimeEvent.ID,
		)
		evExistsInDb := dbContest != nil && err == nil
		if err != nil && strings.Contains(err.Error(), "contest not found") {
			evExistsInDb = false
		} else if err != nil {
			errs = errors.Join(
				errs,
				errors.Join(
					fmt.Errorf("retrieving the contest from database failed"),
					err,
				),
			)
			continue
		}
		if evExistsInDb {
			// slog.Debug("event already exists in the database", "db contest", dbContest.Name, "err", err)
			continue
		}
		_, err = h.ServiceClient.CreateContest(
			context.TODO(),
			&service.CreateContestDto{
				Name:        ctftimeEvent.Title,
				Description: ctftimeEvent.Description,
				Rules:       "This event was automatically imported from ctftime which doesn't support adding rules to an event.",
				Prizes:      ctftimeEvent.Prizes,
				Start:       ctftimeEvent.Start,
				End:         ctftimeEvent.Finish,
				Url:         ctftimeEvent.URL,
				CtftimeID:   &ctftimeEvent.ID,
			},
		)
		if err != nil {
			errs = errors.Join(
				errs,
				errors.Join(
					fmt.Errorf("creating the contest in the database failed; ctftime event failed=%s", ctftimeEvent.Title),
					err,
				),
			)
			continue
		}
		added++
	}
	slog.Info(
		"added the ctftime events to the database",
		"amount of events added", added,
		"errors along the way", errs,
	)
	return nil
}
