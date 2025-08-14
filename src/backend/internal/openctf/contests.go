package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
)

func (h *Handler) AddRoutes_ApiContests() {
	slog.Info("registering contests api")

	h.RestClient.AddRateLimitedRoute("GET", "/api/contests/:contestId", ratelimit.InMemoryOptions{}, h.ContestGetOne)
	h.RestClient.AddRateLimitedRoute("GET", "/api/contests", ratelimit.InMemoryOptions{}, h.ContestsList)
	h.RestClient.AddRateLimitedRoute("POST", "/api/contests/create", ratelimit.InMemoryOptions{}, h.WithAuth(h.ContestsCreate))
	// h.RestClient.AddRateLimitedRoute("POST", "/api/contests/finish", ratelimit.InMemoryOptions{}, h.WithAuth(h.ContestsFinish)) // TODO: implement this; submit scores; firstly make the weight points
	h.RestClient.AddRateLimitedRoute("POST", "/api/contests/:contestId/rate", ratelimit.InMemoryOptions{}, h.WithAuth(h.ContestsRate))
}
