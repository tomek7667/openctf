package ctftime

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
)

// `CtftimeResultsResponse` the map of ctftime event id to title+scores
type CtftimeResultsResponse map[int]struct {
	Title  string  `json:"title"`
	Scores []Place `json:"scores"`
}

func (c *Client) GetResults(ctx context.Context, year int) (*CtftimeResultsResponse, error) {
	// https://ctftime.org/api/v1/results/{year}
	url := fmt.Sprintf(
		"%s/results/%d/",
		c.BaseURL, year,
	)

	slog.Debug("getting scores for year", "year", year, "url", url)
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
			fmt.Errorf("something went wrong when getting results from ctftime"),
			err,
		)
	}
	response, err := ReadJson[CtftimeResultsResponse](resp.Body)
	return response, err
}
