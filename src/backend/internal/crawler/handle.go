package crawler

import (
	"log/slog"
	"strconv"
	"time"

	"openctfbackend/internal/utils"
)

func (h *Handler) Handle() {
	slog.Info("starting crawler handler")
	defer func() {
		slog.Warn("crawler.Handle is closing the database")
		h.ServiceClient.GetEnt().Close()
	}()
	intervalS := utils.Getenv("CRAWLER_INTERVAL", "604800")
	interval, err := strconv.Atoi(intervalS)
	if err != nil {
		panic(err)
	}
	tickerDuration := time.Duration(interval) * time.Second
	ticker := time.NewTicker(tickerDuration)
	defer ticker.Stop()

	initialErr := h.CrawlContests(tickerDuration)
	if initialErr != nil {
		slog.Error(
			"the initial contests crawler run errored",
			"err", initialErr,
		)
		panic(initialErr)
	}
	initialErr = h.CrawlPlaces()
	if initialErr != nil {
		slog.Error(
			"the initial places crawler run errored",
			"err", initialErr,
		)
		panic(initialErr)
	}

	for range ticker.C {
		slog.Info("crawler: ticker ticked, performing periodic task")
		// Add your periodic task logic here
		err = h.CrawlContests(tickerDuration)
		if err != nil {
			slog.Error(
				"crawler contest crawl failed",
				"err", err,
			)
		}
		err = h.CrawlPlaces()
		if err != nil {
			slog.Error(
				"crawler places crawl failed",
				"err", err,
			)
		}
	}
}
