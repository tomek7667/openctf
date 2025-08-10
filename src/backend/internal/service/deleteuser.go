package service

import (
	"context"

	"openctfbackend/ent/user"
)

// DeleteUserByUsername is only to be used by other BE functionalities, never to be invoked by the actual user.
func (c *Client) DeleteUserByUsername(ctx context.Context, username string) error {
	_, err := c.C.User.
		Delete().
		Where(user.Username(username)).
		Exec(ctx)
	if err != nil {
		return err
	}
	return nil
}
