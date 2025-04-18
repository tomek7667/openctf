package croner

import (
	"context"
	"log/slog"
	"time"

	"openctfbackend/ent/aggregatedcontestsdifficulties"
)

func getMonthBeforeTimestamp(current time.Time) time.Time {
	return current.AddDate(0, -1, 0)
}

func (h *Handler) IntervalFunc() error {
	ec := h.ServiceClient.GetEnt()
	now := time.Now().AddDate(0, 0, 13)
	before := getMonthBeforeTimestamp(now)

	// 1. if today is 1st, check if any of the ctfs that ended in currentmonth1st+lastmonth-lastmonth1st have assigned weight points;
	// 	1b. if they do, return nil; else:
	if now.Day() != 1 {
		slog.Debug("points assignment skipped as today is not the day", "the day", now.Day())
		return nil
	}
	aggCount := ec.AggregatedContestsDifficulties.Query().Where(
		aggregatedcontestsdifficulties.And(
			aggregatedcontestsdifficulties.EndGTE(before),
			aggregatedcontestsdifficulties.EndLTE(now),
		),
	).CountX(context.Background())
	slog.Debug("today is the day for the points assignments", "today", now.Format(time.RFC1123), "month before", before.Format(time.RFC1123), "contest found between before and now", aggCount)
	if aggCount > 0 {
		return nil
	}

	// 2. gather all ctfs that have ended in currentmonth1st+lastmonth-lastmonth1st; and comply with `docs\RATING_AND_POINTS.md` conditions
	// 3. get avg out all weight ratings for all
	// 4. normalize the difficulties with Math.floor to 0 decimal points wrt. the whole pool 100;

	// TODO: implement
	return nil
}
