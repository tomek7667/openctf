package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
)

func (c *Client) AddActivity(
	ctx context.Context,
	tx *ent.Tx,
	activityType, title, description string,
	userId int,
) (*ent.Activity, error) {
	var err error
	if tx == nil {
		tx, err = c.C.BeginTx(ctx, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to begin tx when adding activity: %w", err)
		}
	}
	activity, err := tx.Activity.
		Create().
		SetType(activityType).
		SetTitle(title).
		SetDescription(description).
		SetUserID(userId).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create activity '%s': %w", title, err)
	}
	return activity, nil
}
