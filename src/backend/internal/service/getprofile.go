package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/achievement"
	"openctfbackend/ent/activity"
	"openctfbackend/ent/aggregateduserstatistics"
	"openctfbackend/ent/user"
	"openctfbackend/ent/userprofile"
)

type Profile struct {
	UserProfile    ent.UserProfile              `json:"userProfile"`
	LastActivities ent.Activities               `json:"lastActivities"`
	Achievements   ent.Achievements             `json:"achievements"`
	Statistics     ent.AggregatedUserStatistics `json:"statistics"`
}

func (c *Client) GetProfile(ctx context.Context, userId int) (*Profile, error) {
	userProfile, err := c.C.UserProfile.
		Query().
		Where(userprofile.HasUserWith(user.ID(userId))).
		First(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile with id '%d': %w", userId, err)
	}
	lastActivities, err := c.C.Activity.
		Query().
		Where(activity.HasUserWith(user.ID(userId))).
		Order(ent.Desc(activity.FieldDate)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get last activities for user with id '%d': %w", userId, err)
	}
	achievements, err := c.C.Achievement.
		Query().
		Where(achievement.HasUserWith(user.ID(userId))).
		Order(ent.Desc(achievement.FieldUnlockedAt)).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get achievements for user with id '%d': %w", userId, err)
	}
	statistics, err := c.C.AggregatedUserStatistics.
		Query().
		Where(aggregateduserstatistics.UserID(userId)).
		First(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get aggregated user statistics for user with id '%d': %w", userId, err)
	}

	return &Profile{
		UserProfile:    *userProfile,
		LastActivities: lastActivities,
		Achievements:   achievements,
		Statistics:     *statistics,
	}, nil
}
