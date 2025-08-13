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

func (c *Client) LoginGithub(
	ctx context.Context,
	ghEmail string,
	ghInfo *github.User,
) (*ent.User, *string, error) {
	tx, err := c.C.BeginTx(ctx, nil)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to initialize transaction: %w", err)
	}

	u, err := tx.User.
		Query().
		Where(
			user.And(
				user.GithubAccountID(ghInfo.ID),
				user.GithubEmail(ghEmail),
			),
		).First(ctx)
	if err != nil {
		return nil, nil, rollback(tx, fmt.Errorf("getting user failed: %w", err))
	}

	token, err := utils.GetToken(u)
	if err != nil {
		return nil, nil, errors.Join(fmt.Errorf("failed getting token for github user; id=%d", u.ID), err)
	}

	return u, &token, nil
}
