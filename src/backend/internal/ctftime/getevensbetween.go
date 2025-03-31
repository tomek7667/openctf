package ctftime

import (
	"errors"
	"fmt"
	"net/http"
	"time"
)

func (c *Client) GetEventsBetween(start, finish time.Time) ([]Event, error) {
	limit := 1000000 // TODO: figure out if that's the way
	// https://ctftime.org/api/v1/events/?limit={number}&start={timestamp}&finish={timestamp}
	resp, err := http.Get(fmt.Sprintf(
		"%s/events/?limit=%d&start=%d&finish=%d",
		c.BaseURL, limit, start.Unix(), finish.Unix(),
	))
	if err != nil {
		return nil, errors.Join(fmt.Errorf("something went wrong when getting a team from ctftime"), err)
	}
	if resp.StatusCode == http.StatusNotFound {
		return nil, ErrTeamNotFound
	}
	arr, err := ReadJson[[]Event](resp.Body)
	return *arr, err
}
