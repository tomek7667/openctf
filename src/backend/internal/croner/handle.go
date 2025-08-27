package croner

import (
	"log/slog"
	"time"
)

func (h *Handler) Handle() {
	slog.Info("starting croner handler")
	defer func() {
		slog.Error("croner.Handle closed for some reason, this should not have happened")
	}()
	// run it every 24 hours to check if if new pool should be created
	ticker := time.NewTicker(time.Hour * 24)
	err := h.AssignWeight()
	if err != nil {
		slog.Error(
			"the initial croner action errored",
			"err", err,
		)
		panic(err)
	}

	for range ticker.C {
		slog.Info("croner: ticker ticked, performing periodic task")
		err = h.AssignWeight()
		if err != nil {
			slog.Error(
				"croner interval func failed",
				"err", err,
			)
		}
	}
}
