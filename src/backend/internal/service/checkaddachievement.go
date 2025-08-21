package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/achievement"
	"openctfbackend/ent/user"
	"openctfbackend/internal/achievements"
)

func (c *Client) CheckAddAchievement(
	ctx context.Context,
	tx *ent.Tx,
	ac achievements.AchievementType,
	_user *ent.User,
) (*ent.Achievement, error) {
	// if the achievement exists we don't want to duplicate it, just return it
	existingAchievement, err := c.C.Achievement.
		Query().
		Where(
			achievement.And(
				achievement.HasUserWith(user.ID(_user.ID)),
				achievement.Name(ac.Name),
			),
		).
		All(ctx)
	if err != nil {
		return nil, fmt.Errorf("getting an achievement called '%s' to check if it exists failed: %w", ac.Name, err)
	}
	if len(existingAchievement) > 0 {
		return existingAchievement[0], nil
	}

	shouldCommit := tx == nil
	if tx == nil {
		tx, err = c.C.BeginTx(ctx, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to begin tx when adding achievement: %w", err)
		}
	}
	_achievement, err := tx.Achievement.
		Create().
		SetRarity(ac.Rarity).
		SetName(ac.Name).
		SetDescription(ac.Description).
		SetUser(_user).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create achievement '%s': %w", ac.Name, err)
	}
	if shouldCommit {
		if err = tx.Commit(); err != nil {
			return nil, fmt.Errorf("failed to commit add achievement: %w", err)
		}
	}
	return _achievement, nil
}
