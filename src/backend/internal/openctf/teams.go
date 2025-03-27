package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
)

func (h *Handler) AddRoutes_ApiTeams() {
	slog.Info("registering teams api")

	h.RestClient.AddRateLimitedRoute("GET", "/api/teams/list", ratelimit.InMemoryOptions{}, h.TeamsList)
	h.RestClient.AddRateLimitedRoute("POST", "/api/teams/create", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsCreate))
	h.RestClient.AddRateLimitedRoute("POST", "/api/teams/verify", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsVerify))
	h.RestClient.AddRateLimitedRoute("POST", "/api/teams/verify", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsVerify))
}
