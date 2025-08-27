package croner

import (
	"context"
	"fmt"
	"log/slog"
	"math"
	"slices"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedcontestsdifficulty"
	"openctfbackend/ent/place"
)

func getMonthBeforeTimestamp(current time.Time) time.Time {
	return current.AddDate(0, -1, 0)
}

func (h *Handler) AssignWeight() error {
	ctx := context.Background()
	ec := h.ServiceClient.GetEnt()
	now := time.Now().AddDate(0, 0, 4)
	before := getMonthBeforeTimestamp(now)

	// 1. if today is 1st, check if any of the ctfs that ended in currentmonth1st+lastmonth-lastmonth1st have assigned weight points;
	// 	1b. if they do, return nil; else:
	if now.Day() != 1 {
		slog.Debug("points assignment skipped as today is not the day", "the day", now.Day(), "should be", 1)
		return nil
	}
	// this is querying contests where organiers' have organized a ctf previously in time
	// of at least 6 months before and with at least 50 teams taking part in.
	aggCount := ec.AggregatedContestsDifficulty.Query().Where(
		aggregatedcontestsdifficulty.And(
			aggregatedcontestsdifficulty.EndGTE(before),
			aggregatedcontestsdifficulty.EndLTE(now),
		),
	).CountX(ctx)
	slog.Debug("today is the day for the points assignments", "today", now.Format(time.RFC1123), "month before", before.Format(time.RFC1123), "contest found between before and now", aggCount)
	if aggCount == 0 {
		slog.Info("no contests found that should have the weight assigned")
		return nil
	}

	// 2. gather all ctfs that have ended in currentmonth1st+lastmonth-lastmonth1st; and comply with `docs\RATING_AND_POINTS.md` conditions
	records := ec.AggregatedContestsDifficulty.Query().Where(
		aggregatedcontestsdifficulty.And(
			aggregatedcontestsdifficulty.EndGT(before),
			aggregatedcontestsdifficulty.EndLT(now),
		),
	).AllX(ctx)
	if len(records) == 0 {
		slog.Info("no contests found that should have the weight assigned")
		return nil
	}
	for _, r := range records {
		if r.AssignedWeightPoints > 0 {
			return fmt.Errorf("at least one of the contests to be rated was already rated '%d': %s", r.ContestID, r.ContestName)
		}
	}
	slog.Debug("the stuff to be weighted found", "number of records found", len(records), "end greater than", before, "end less than or equal now", now, "example first record", records[0])

	// 3. normalize the difficulties with Math.floor to 0 decimal points wrt. the whole pool 100;
	const MONTHLY_POINTS = 100
	const MIN_QUALITY_POINTS = 1
	const MAX_QUALITY_POINTS = 5
	const MIN_DIFFICULTY_POINTS = 0
	const MAX_DIFFICULTY_POINTS = 100
	const MAX_CALCULATED_VALUE = MAX_QUALITY_POINTS * MAX_DIFFICULTY_POINTS

	results := map[int]float64{}
	var total_score float64 = 0
	for _, record := range records {
		calculated_value := record.AvgQuality * record.AvgDifficulty
		results[record.ContestID] = calculated_value
		total_score += calculated_value
	}
	tx, err := h.ServiceClient.GetEnt().BeginTx(ctx, nil)
	if err != nil {
		slog.Error("failed to start transaction", "error", err)
		return err
	}
	defer tx.Rollback()

	for contest_id, calculated_value := range results {
		assigned_weight_points := int(math.Floor(MONTHLY_POINTS * (calculated_value / total_score)))
		_, err = tx.Contest.
			UpdateOneID(contest_id).
			SetAssignedWeightPoints(assigned_weight_points).
			Save(ctx)
		if err != nil {
			return fmt.Errorf("failed to assign weight points to '%d' contest to '%d': %w", contest_id, assigned_weight_points, err)
		}

		// 4. assign places the points associated with this specific contest
		places, err := tx.Place.Query().Where(place.AssociatedContestIDEQ(contest_id)).All(ctx)
		if err != nil {
			return fmt.Errorf("failed to retrieve places of contest %d: %w", contest_id, err)
		}
		if len(places) == 0 {
			return fmt.Errorf("contest '%d' to be point-assigned doesn't have places submitted. Moderators should contact the contest organizers about submitting the leaderboard to be eligible. Otherwise the contest will be skipped", contest_id)
		}
		first_place_idx := slices.IndexFunc(places, func(p *ent.Place) bool {
			return p.Place == 1
		})
		if first_place_idx == -1 {
			return fmt.Errorf("contest '%d' to be point-assigned doesn't have 1st place assigned. Moderators should contact the contest organizers about submitting the leaderboard to be eligible. Otherwise the contest will be skipped", contest_id)
		}
		for _, place := range places {
			place_points := 1.0 / float64(place.Place)
			score_points := (*place.ContestPoints) / (*places[first_place_idx].ContestPoints)
			if score_points <= 0 {
				continue
			}
			place_result := ((score_points + place_points) * float64(assigned_weight_points)) / (1.0 / (1.0 + (float64(place.Place) / float64(len(places)))))
			_, err = tx.Place.UpdateOneID(place.ID).SetAssignedWeightPoints(place_result).Save(ctx)
			if err != nil {
				return fmt.Errorf("failed to assign weight points to place '%d' of contest '%d' to '%f': %w", place.ID, contest_id, place_result, err)
			}
		}
		slog.Info("assigned weight points to contest", "contest_id", contest_id, "assigned_weight_points", assigned_weight_points, "places", len(places))
	}
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit tx: %w", err)
	}
	return nil
}
