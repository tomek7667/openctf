package github

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
)

func (c *Client) StarRepo(ctx context.Context, owner, repo, accessToken string) error {
	url := fmt.Sprintf("https://api.github.com/user/starred/%s/%s", url.PathEscape(owner), url.PathEscape(repo))
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
			"failed to star repo",
			"owner", owner,
			"repo", repo,
			"url", url,
			"access token that failed", accessToken,
			"status code", resp.StatusCode,
			"response", string(s),
		)
		return fmt.Errorf("failed to star repo: %s", resp.Status)
	}
	return nil
}
