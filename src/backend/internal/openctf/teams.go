package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
)

func (h *Handler) AddRoutes_ApiTeams() {
	slog.Info("registering teams api")

	h.RestClient.AddRateLimitedRoute("GET", "/api/teams/:teamId", ratelimit.InMemoryOptions{}, h.TeamsGetOne)
	h.RestClient.AddRateLimitedRoute("GET", "/api/teams/list", ratelimit.InMemoryOptions{}, h.TeamsList)
	h.RestClient.AddRateLimitedRoute("GET", "/api/teams/leaderboard", ratelimit.InMemoryOptions{}, h.TeamsGetLeaderboard)
	// h.RestClient.AddRateLimitedRoute("GET", "/api/teams/ranking", ratelimit.InMemoryOptions{}, h.TeamsRanking) // TODO: before this, create view with aggregated scores for each team each year; this endpoint will receive data from this view; filtered out by provided query params
	h.RestClient.AddRateLimitedRoute("POST", "/api/teams/create", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsCreate))
	h.RestClient.AddRateLimitedRoute("POST", "/api/teams/verify", ratelimit.InMemoryOptions{}, h.WithAuth(h.TeamsVerify))
}
