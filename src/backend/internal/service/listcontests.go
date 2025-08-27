package service

import (
	"context"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/aggregatedcontest"
)

type ContestStatus string

const (
	ContestStatusAll       ContestStatus = "all"
	ContestStatusOngoing   ContestStatus = "ongoing"
	ContestStatusFinished  ContestStatus = "finished"
	ContestStatusUpcoming  ContestStatus = "upcoming"
	ContestStatusCancelled ContestStatus = "cancelled"
)

type ListContestsDto struct {
	Offset    int           `json:"offset" form:"offset"`
	Limit     int           `json:"limit" form:"limit"`
	Search    string        `json:"search" form:"search"`
	Status    ContestStatus `json:"status" form:"status"`
	MinRating int           `json:"minRating" form:"minRating"`
	MaxRating int           `json:"maxRating" form:"maxRating"`
	MinWeight int           `json:"minWeight" form:"minWeight"`
	MaxWeight int           `json:"maxWeight" form:"maxWeight"`
	Year      int           `json:"year" form:"year"`
}

func (c *Client) ListContests(ctx context.Context, dto *ListContestsDto) ([]*ent.AggregatedContest, error) {
	if dto.Limit > 30 || dto.Limit <= 0 {
		dto.Limit = 30
	}
	if dto.Offset <= 0 {
		dto.Offset = 0
	}

	tq := c.C.AggregatedContest.
		Query().
		Limit(dto.Limit).
		Offset(dto.Offset)
	if len(dto.Search) > 0 {
		tq.Where(aggregatedcontest.NameContains(dto.Search))
	}
	if len(dto.Status) == 0 {
		dto.Status = ContestStatusAll
	}
	switch dto.Status {
	case ContestStatusFinished:
		tq.Where(aggregatedcontest.EndLT(time.Now()))
	case ContestStatusUpcoming:
		tq.Where(aggregatedcontest.StartLT(time.Now()))
	case ContestStatusOngoing:
		tq.Where(aggregatedcontest.And(
			aggregatedcontest.StartGT(time.Now()),
			aggregatedcontest.EndGT(time.Now()),
		))
	case ContestStatusAll:
		break
	default:
		return nil, fmt.Errorf("unsupported status type; available types")
	}
	if dto.MinRating > 0 {
		tq.Where(aggregatedcontest.RatingGTE(float64(dto.MinRating)))
	}
	if dto.MaxRating > 0 {
		tq.Where(aggregatedcontest.RatingLTE(float64(dto.MaxRating)))
	}
	if dto.MinWeight > 0 {
		tq.Where(aggregatedcontest.AssignedWeightPointsGTE(dto.MinWeight))
	}
	if dto.MaxWeight > 0 {
		tq.Where(aggregatedcontest.AssignedWeightPointsLTE(dto.MaxWeight))
	}
	if dto.Year > 0 {
		yearTime := time.Date(
			dto.Year,
			1,
			1,
			0, 0, 0, 0,
			time.UTC,
		)
		yearTimePlusYear := time.Date(
			dto.Year+1,
			1,
			1,
			0, 0, 0, 0,
			time.UTC,
		)
		tq.Where(aggregatedcontest.StartGT(yearTime))
		tq.Where(aggregatedcontest.StartLT(yearTimePlusYear))
	}
	t, err := tq.All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed listing contests: %w", err)
	}
	return t, nil
}
