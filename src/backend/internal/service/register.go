package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/user"
	"openctfbackend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

type RegisterDto struct {
	Username    string `json:"username"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Description string `json:"description"`
}

func (c *Client) Register(ctx context.Context, dto *RegisterDto) (*ent.User, *string, error) {
	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, nil, err
	}

	u, err := c.C.User.
		Create().
		SetUsername(dto.Username).
		SetEmail(dto.Email).
		SetPermissionLevel(user.DefaultPermissionLevel).
		SetDescription(dto.Description).
		SetPassword(string(encryptedPassword)).
		SetConfirmationCode(fmt.Sprintf("%08d", utils.RandInt(0, 99999999))).
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
