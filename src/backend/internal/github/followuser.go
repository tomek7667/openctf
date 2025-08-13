package github

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
)

func (c *Client) FollowUser(ctx context.Context, username, accessToken string) error {
	url := fmt.Sprintf("https://api.github.com/user/following/%s", url.PathEscape(username))
	req, err := http.NewRequestWithContext(ctx, "PUT", url, nil)
	if err != nil {
		return fmt.Errorf("creating request failed: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+accessToken)
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "openctf-app")
	req.Header.Set("X-GitHub-Api-Version", "2022-11-28")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return fmt.Errorf("failed to make a request: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent {
		s, _ := io.ReadAll(resp.Body)
		slog.Debug(
			"failed to follow user",
			"username", username,
			"url", url,
			"access token that failed", accessToken,
			"status code", resp.StatusCode,
			"response", string(s),
		)
		return fmt.Errorf("failed to follow user '%s': %s", username, resp.Status)
	}
	return nil
}
