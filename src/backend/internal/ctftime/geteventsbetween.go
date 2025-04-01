package ctftime

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"time"
)

func (c *Client) GetEventsBetween(ctx context.Context, start, finish time.Time) ([]Event, error) {
	limit := 1000000 // TODO: figure out if that's the way
	// https://ctftime.org/api/v1/events/?limit={number}&start={timestamp}&finish={timestamp}
	url := fmt.Sprintf(
		"%s/events/?limit=%d&start=%d&finish=%d",
		c.BaseURL, limit, start.Unix(), finish.Unix(),
	)

	slog.Debug("getting events between", "url", url)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, http.NoBody)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("something went wrong when constructing a request"),
			err,
		)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, errors.Join(
			fmt.Errorf("something went wrong when getting a team from ctftime"),
			err,
		)
	}

	if resp.StatusCode == http.StatusNotFound {
		return nil, ErrTeamNotFound
	}
	arr, err := ReadJson[[]Event](resp.Body)
	return *arr, err
}
