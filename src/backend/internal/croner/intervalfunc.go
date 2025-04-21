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
	now := time.Now().AddDate(0, 0, 10)
	before := getMonthBeforeTimestamp(now)

	// 1. if today is 1st, check if any of the ctfs that ended in currentmonth1st+lastmonth-lastmonth1st have assigned weight points;
	// 	1b. if they do, return nil; else:
	if now.Day() != 1 {
		slog.Debug("points assignment skipped as today is not the day", "the day", now.Day(), "should be", 1)
		return nil
	}
	aggCount := ec.AggregatedContestsDifficulties.Query().Where(
		aggregatedcontestsdifficulties.And(
			aggregatedcontestsdifficulties.EndGTE(before),
			aggregatedcontestsdifficulties.EndLTE(now),
		),
	).CountX(context.Background())
	slog.Debug("today is the day for the points assignments", "today", now.Format(time.RFC1123), "month before", before.Format(time.RFC1123), "contest found between before and now", aggCount)
	if aggCount == 0 {
		slog.Info("no contests found that should have the weight assigned")
		return nil
	}

	// 2. gather all ctfs that have ended in currentmonth1st+lastmonth-lastmonth1st; and comply with `docs\RATING_AND_POINTS.md` conditions
	records := ec.AggregatedContestsDifficulties.Query().Where(
		aggregatedcontestsdifficulties.And(
			aggregatedcontestsdifficulties.EndGT(before),
			aggregatedcontestsdifficulties.EndLT(now),
		),
	).AllX(context.TODO())
	slog.Debug("the stuff to be weighted found", "number of records found", len(records), "end greater than", before, "end less than or equal now", now, "example first record", records[0])

	// 3. normalize the difficulties with Math.floor to 0 decimal points wrt. the whole pool 100;

	// TODO: implement
	return nil
}
