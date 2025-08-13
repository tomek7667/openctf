package utils

import (
	"fmt"
	"io"
	"net/http"
)

func GetImageFromUrl(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to get image from '%s': %w", url, err)
	}
	defer resp.Body.Close()
	b, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read image data from '%s': %w", url, err)
	}
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get image from '%s': received status code %d", url, resp.StatusCode)
	}
	if len(b) == 0 {
		return nil, fmt.Errorf("image data from '%s' is empty", url)
	}
	return b, nil
}
