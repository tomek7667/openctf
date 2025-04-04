package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
)

func (h *Handler) AddRoutes_ApiContests() {
	slog.Info("registering teams api")

	// h.RestClient.AddRateLimitedRoute("GET", "/api/contests/:contestId", ratelimit.InMemoryOptions{}, h.TeamsGetOne)
	// h.RestClient.AddRateLimitedRoute("GET", "/api/contests/list", ratelimit.InMemoryOptions{}, h.TeamsList)
	// h.RestClient.AddRateLimitedRoute("POST", "/api/contests/create", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsCreate))
	h.RestClient.AddRateLimitedRoute("POST", "/api/contests/:contestId/rate", ratelimit.InMemoryOptions{}, h.WithAuth(h.ContestsRate))
}
