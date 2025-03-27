package ctftime

import (
	"encoding/json"
	"io"
)

type Client struct {
	BaseURL string
}

func New(baseUrl string) (*Client, error) {
	return &Client{
		BaseURL: baseUrl,
	}, nil
}

func ReadJson[T any](rc io.ReadCloser) (*T, error) {
	body, err := io.ReadAll(rc)
	if err != nil {
		return nil, err
	}
	var obj *T
	err = json.Unmarshal(body, &obj)
	if err != nil {
		return nil, err
	}
	return obj, nil
}
