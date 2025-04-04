package openctf

import (
	"log/slog"
)

func (h *Handler) Handle() {
	slog.Info("starting openctf handler")
	go h.DbHealth()

	h.AddRoutes_ApiAuth()
	h.AddRoutes_ApiTeams()
	h.AddRoutes_ApiContests()

	defer func() {
		slog.Warn("openctf.Handle is closing the database")
		h.ServiceClient.GetEnt().Close()
	}()
	slog.Info("serving")
	h.RestClient.Serve()
}
