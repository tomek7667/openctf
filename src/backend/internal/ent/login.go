package ent

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"openctfbackend/ent"
	"openctfbackend/ent/user"
	"openctfbackend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

var ErrUserNotFoundOrPass = errors.New("user not found or password mismatch")

type LoginDto struct {
	Identity string `json:"identity"`
	Password string `json:"password"`
}

func (c *Client) Login(ctx context.Context, dto *LoginDto) (*ent.User, *string, error) {
	u, err := c.C.User.
		Query().
		Where(
			user.Or(
				user.Username(dto.Identity),
				user.Email(dto.Identity),
			),
		).
		First(ctx)
	if err != nil {
		return nil, nil, ErrUserNotFoundOrPass
	}
	err = bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(dto.Password))
	if err != nil {
		slog.Debug(
			"logging in failed; invalid password",
			"err", err,
		)
		return nil, nil, ErrUserNotFoundOrPass
	}
	token, err := utils.GetToken(u)
	if err != nil {
		return nil, nil, errors.Join(fmt.Errorf("failed getting token for new user; id=%d", u.ID), err)
	}
	return u, &token, nil
}
