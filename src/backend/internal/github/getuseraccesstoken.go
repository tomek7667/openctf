package github

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"strings"
)

func (c *Client) GetUserAccessToken(ctx context.Context, code string) (*string, error) {
	body := map[string]string{
		"client_id":     c.ClientId,
		"client_secret": c.clientSecret,
		"code":          code,
	}
	marshalled, err := json.Marshal(body)
	if err != nil {
		return nil, fmt.Errorf("marshalling body failed: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://github.com/login/oauth/access_token", bytes.NewBuffer(marshalled))
	if err != nil {
		return nil, fmt.Errorf("creating request failed: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("User-Agent", "openctf-app")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make a request: %w", err)
	}
	defer resp.Body.Close()
	responseBody, _ := io.ReadAll(resp.Body)

	var respBody struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(responseBody, &respBody); err != nil || respBody.AccessToken == "" {
		var errBody struct {
			ErrorDescription string `json:"error_description"`
			ErrorCode        string `json:"error"`
		}
		err = json.Unmarshal(responseBody, &errBody)
		if err != nil {
			slog.Debug(
				"unmarshalling err body from github failed unmarshal failed",
				"err", err,
				"response body", strings.Split(string(responseBody), `"<!DOCTYPE html>\n<html>`)[0],
			)
			return nil, fmt.Errorf("invalid github response body. Check the logs or contact the admin.")
		}
		return nil, fmt.Errorf("decoding github response body failed: %s", errBody.ErrorDescription)
	}
	return &respBody.AccessToken, nil
}
