package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/user"
	"openctfbackend/internal/github"
	"openctfbackend/internal/utils"
)

func (c *Client) RegisterGithub(
	ctx context.Context,
	ghEmail string,
	ghInfo *github.User,
) (*ent.User, *string, error) {
	tx, err := c.C.BeginTx(ctx, nil)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to initialize transaction: %w", err)
	}

	u, err := tx.User.
		Create().
		SetUsername(ghInfo.Login).
		SetEmail(ghEmail).
		// SetLogo(),
		SetGithubAccountID(ghInfo.ID).
		SetGithubUsername(ghInfo.Login).
		SetGithubName(ghInfo.Name).
		SetGithubAvatarURL(ghInfo.AvatarURL).
		SetGithubEmail(ghEmail).
		SetPermissionLevel(user.DefaultPermissionLevel).
		SetPassword("").
		SetConfirmationCode(fmt.Sprintf("%08d", utils.RandInt(0, 99999999))).
		Save(ctx)
	if err != nil {
		return nil, nil, rollback(tx, fmt.Errorf("failed registering github user: %w", err))
	}
	_, err = tx.UserProfile.
		Create().
		SetUserID(u.ID).
		Save(ctx)
	if err != nil {
		return nil, nil, rollback(tx, fmt.Errorf("failed creating user profile: %w", err))
	}
	_, err = c.AddActivity(
		ctx,
		tx,
		WelcomeActivityType,
		"Joined OpenCTF community!",
		"",
		u.ID,
	)
	if err != nil {
		return nil, nil, rollback(tx, fmt.Errorf("failed adding welcome activity for user %s: %w", u.Email, err))
	}
	if err := tx.Commit(); err != nil {
		return nil, nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	token, err := utils.GetToken(u)
	if err != nil {
		return nil, nil, errors.Join(fmt.Errorf("failed getting token for new github user; id=%d", u.ID), err)
	}

	return u, &token, nil
}
