package utils

import (
	"errors"
	"fmt"
	"io"
	"net/http"
)

func GetImage(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("something went wrong when getting the picture from the url"), err)
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
