package service

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/internal/utils"
)

// `verifyToken` takes an authorization token and returns the id of the user if it's valid
func verifyToken(token string) (int, error) {
	data, err := utils.JwtVerify(token, utils.Getenv(
		"JWT_SECRET",
		"8c7fafb856380624fa60b22e7baf311d",
	))
	if err != nil {
		return -1, err
	}
	return int(data["id"].(float64)), nil
}

// `VerifyToken` takes context and authorization token from the `Authorization` header and returns the user instance
func (c *Client) VerifyToken(ctx context.Context, token string) (*ent.User, error) {
	userId, err := verifyToken(token)
	if err != nil {
		return nil, err
	}
	user, err := c.C.User.Get(ctx, userId)
	if err != nil {
		return nil, err
	}
	return user, nil
}
