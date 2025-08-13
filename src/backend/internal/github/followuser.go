package github

import (
	"context"
	"fmt"
	"net/http"
)

func (c *Client) FollowUser(ctx context.Context, username, accessToken string) error {
	req, err := http.NewRequestWithContext(ctx, "PUT", fmt.Sprintf("https://api.github.com/user/following/%s", username), nil)
	if err != nil {
		return fmt.Errorf("creating request failed: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make a request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("failed to follow user '%s': %s", username, resp.Status)
	}
	return nil
}
