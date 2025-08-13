package github

import (
	"fmt"
)

type Client struct {
	clientSecret string
	ClientId     string
}

func New(clientSecret, clientId string) (*Client, error) {
	if clientSecret == "" || clientId == "" {
		return nil, fmt.Errorf("you must supply client secret and client id")
	}
	return &Client{
		clientSecret: clientSecret,
		ClientId:     clientId,
	}, nil
}
