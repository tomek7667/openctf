package openctf

import (
	"log/slog"
)

func (h *Handler) AddRoutes_ApiStatistics() {
	slog.Info("registering statistics api")

	h.RestClient.AddRoute("GET", "/api/statistics", h.StatisticsList)
}
