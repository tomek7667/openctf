package service

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"openctfbackend/ent"
	"openctfbackend/ent/migrate"
	"openctfbackend/ent/user"

	_ "github.com/lib/pq"
)

type Client struct {
	C         *ent.Client
	AdminUser *ent.User
}

func New(credentials string) (*Client, error) {
	client, err := ent.Open("postgres", credentials)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed opening connection to pg"), err)
	}
	if err := client.Schema.Create(
		context.Background(),
		migrate.WithDropIndex(true),
		migrate.WithDropColumn(true),
	); err != nil {
		slog.Error("schema create failed", "err", err)
		return nil, errors.Join(fmt.Errorf("failed creating schema resources"), err)
	}
	c := &Client{
		C: client,
	}
	admin, err := client.User.Query().Where(user.Username("admin")).First(context.Background())
	if err != nil {
		return nil, fmt.Errorf("failed to get admin user: %w", err)
	}
	c.AdminUser = admin
	return c, nil
}

func (c *Client) GetEnt() *ent.Client {
	return c.C
}
