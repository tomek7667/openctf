package openctf

import (
	"log/slog"
)

func (h *Handler) AddRoutes_ApiProfiles() {
	slog.Info("registering profiles api")

	h.RestClient.AddRoute("GET", "/api/profiles/me", h.WithAuth(h.ProfilesGetOwn))
	h.RestClient.AddRoute("POST", "/api/profiles/me", h.WithAuth(h.ProfilesUpdateOwn))
}
