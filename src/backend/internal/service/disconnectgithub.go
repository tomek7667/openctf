package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
)

func (c *Client) DisconnectGithub(
	ctx context.Context,
	_user *ent.User,
) (*ent.User, error) {
	u, err := _user.Update().
		ClearGithubAccountID().
		ClearGithubUsername().
		ClearGithubName().
		ClearGithubAvatarURL().
		ClearGithubEmail().
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update user with cleared GitHub info: %w", err)
	}
	return u, nil
}
