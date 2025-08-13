package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/internal/github"
)

type CodeDto struct {
	Code string `json:"code"`
}

func (c *Client) ConnectGithub(
	ctx context.Context,
	_user *ent.User,
	ghEmail string,
	ghInfo *github.User,
) (*ent.User, error) {
	u, err := _user.Update().
		SetGithubAccountID(ghInfo.ID).
		SetGithubUsername(ghInfo.Login).
		SetGithubName(ghInfo.Name).
		SetGithubAvatarURL(ghInfo.AvatarURL).
		SetGithubEmail(ghEmail).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update user with GitHub info: %w", err)
	}
	return u, nil
}
