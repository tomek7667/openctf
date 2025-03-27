package ctftime

import (
	"errors"
	"fmt"
	"net/http"
)

var ErrTeamNotFound = errors.New("there's no such team on ctftime")

func (c *Client) GetTeam(id int) (*Team, error) {
	resp, err := http.Get(fmt.Sprintf(
		"%s/teams/%d/",
		c.BaseURL, id,
	))
	if err != nil {
		return nil, errors.Join(fmt.Errorf("something went wrong when getting a team from ctftime"), err)
	}
	if resp.StatusCode == http.StatusNotFound {
		return nil, ErrTeamNotFound
	}
	return ReadJson[Team](resp.Body)
}
