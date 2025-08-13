package github

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func (c *Client) GetPrimaryEmail(ctx context.Context, accessToken string) (*string, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", "https://api.github.com/user/emails", nil)
	if err != nil {
		return nil, fmt.Errorf("creating request failed: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make a request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get primary email: %s", resp.Status)
	}
	var emails []struct {
		Email      string `json:"email"`
		Primary    bool   `json:"primary"`
		Verified   bool   `json:"verified"`
		Visibility string `json:"string"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&emails); err != nil {
		return nil, fmt.Errorf("decoding response body failed: %w", err)
	}
	if len(emails) == 0 {
		return nil, fmt.Errorf("no github emails found associated with specified account")
	}
	for _, email := range emails {
		if email.Primary && email.Verified {
			return &email.Email, nil
		}
	}
	return &emails[0].Email, nil
}
