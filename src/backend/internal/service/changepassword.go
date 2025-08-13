package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

type ChangePasswordDto struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func (c *Client) ChangePassword(ctx context.Context, _user *ent.User, dto *ChangePasswordDto) (*ent.User, *string, error) {
	if _user.Password == "" && _user.GithubAccountID != nil {
		// github connected account without password set
	} else {
		err := bcrypt.CompareHashAndPassword([]byte(_user.Password), []byte(dto.OldPassword))
		if err != nil {
			return nil, nil, fmt.Errorf("invalid old password: %w", err)
		}
	}

	encryptedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return nil, nil, fmt.Errorf("generating bcrypt password failed: %w", err)
	}
	_user, err = c.C.User.
		UpdateOneID(_user.ID).
		SetPassword(string(encryptedPassword)).
		Save(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("updating user password failed: %w", err)
	}
	token, err := utils.GetToken(_user)
	if err != nil {
		return nil, nil, fmt.Errorf("getting token for user failed: %w", err)
	}
	return _user, &token, nil
}
