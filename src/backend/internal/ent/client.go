package ent

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"

	_ "github.com/mattn/go-sqlite3"
)

type Client struct {
	C *ent.Client
}

func New() (*Client, error) {
	client, err := ent.Open("sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed opening connection to sqlite"), err)
	}
	if err := client.Schema.Create(context.Background()); err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating schema resources"), err)
	}

	return &Client{
		C: client,
	}, nil
}
