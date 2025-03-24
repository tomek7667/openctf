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
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterDto struct {
	Username    string `json:"username"`
	Password    string `json:"password"`
	Description string `json:"description"`
}

func (c *Client) Login(ctx context.Context, dto *LoginDto) (*ent.User, *string, error) {
	u, err := c.C.User.Query().Where(user.Username(dto.Username)).First(ctx)
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

func (c *Client) Register(ctx context.Context, dto *RegisterDto) (*ent.User, *string, error) {
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, nil, err
	}

	u, err := c.C.User.
		Create().
		SetUsername(dto.Username).
		SetPermissionLevel(user.DefaultPermissionLevel).
		SetDescription(dto.Description).
		SetPassword(string(encryptedPassword)).
		Save(ctx)
	if err != nil {
		return nil, nil, errors.Join(fmt.Errorf("failed creating user"), err)
	}
	token, err := utils.GetToken(u)
	if err != nil {
		return nil, nil, errors.Join(fmt.Errorf("failed getting token for new user; id=%d", u.ID), err)
	}

	return u, &token, nil
}
