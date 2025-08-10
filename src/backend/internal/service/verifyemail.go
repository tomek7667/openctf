package service

import (
	"context"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/user"
	"openctfbackend/internal/utils"
)

type VerifyEmailDto struct {
	Code string `json:"code"`
}

func (c *Client) VerifyEmail(ctx context.Context, dto *VerifyEmailDto) (*ent.User, *string, error) {
	u, err := c.C.User.Query().Where(user.ConfirmationCode(dto.Code)).First(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("invalid confirmation code: %w", err)
	}
	// Mark the user as verified
	u, err = u.Update().
		SetConfirmationCode("").
		SetEmailConfirmedAt(time.Now()).
		Save(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("failed saving confirmed user: %w", err)
	}
	token, err := utils.GetToken(u)
	if err != nil {
		return nil, nil, fmt.Errorf("failed getting token for confirmed user; id=%d: %w", u.ID, err)
	}

	return u, &token, nil
}
