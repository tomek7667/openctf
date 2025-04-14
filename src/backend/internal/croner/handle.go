package croner

import (
	"log/slog"
	"time"
)

func (h *Handler) Handle() {
	slog.Info("starting croner handler")
	defer func() {
		slog.Warn("croner.Handle is closing the database")
		h.ServiceClient.GetEnt().Close()
	}()
	// run it every 24 hours to check if if new pool should be created
	ticker := time.NewTicker(time.Hour * 24)
	err := h.IntervalFunc()
	if err != nil {
		slog.Error(
			"the initial croner action errored",
			"err", err,
		)
		panic(err)
	}

	for range ticker.C {
		slog.Info("croner: ticker ticked, performing periodic task")
		err = h.IntervalFunc()
		if err != nil {
			slog.Error(
				"croner interval func failed",
				"err", err,
			)
		}
	}
}
