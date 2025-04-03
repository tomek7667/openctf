package main

import (
	"log/slog"

	"openctfbackend/internal/ctftime"
	"openctfbackend/internal/logger"
	"openctfbackend/internal/utils"
)

func init() {
	logger.SetLogLevel()
}

func main() {
	c, _ := ctftime.New(utils.Getenv("CTFTIME_API_URL", "https://ctftime.org/api/v1"))
	s, e := c.GetEventPlaces(2573)
	slog.Info("get event places from ctftime", "s", s, "e", e)
}
