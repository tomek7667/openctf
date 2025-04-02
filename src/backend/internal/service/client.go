package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/migrate"

	_ "github.com/lib/pq"
)

type Client struct {
	C *ent.Client
}

func New(credentials string) (*Client, error) {
	client, err := ent.Open("postgres", credentials)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed opening connection to pg"), err)
	}
	if err := client.Schema.Create(context.Background(), migrate.WithDropIndex(true),
		migrate.WithDropColumn(true),
	); err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating schema resources"), err)
	}

	return &Client{
		C: client,
	}, nil
}

func (c *Client) GetEnt() *ent.Client {
	return c.C
}
