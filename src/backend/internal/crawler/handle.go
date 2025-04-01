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

	initialErr := h.Crawl(tickerDuration)
	if initialErr != nil {
		slog.Error(
			"the initial crawler run errored",
			"err", initialErr,
		)
		panic(initialErr)
	}

	for range ticker.C {
		slog.Info("crawler: ticker ticked, performing periodic task")
		// Add your periodic task logic here
		err = h.Crawl(tickerDuration)
		if err != nil {
			slog.Error(
				"crawler crawl failed",
				"err", err,
			)
		}
	}
}
