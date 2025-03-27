package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
)

func (h *Handler) AddRoutes_ApiAuth() {
	slog.Info("registering auth api")

	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/login", ratelimit.InMemoryOptions{}, h.AuthLogin)
	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/register", ratelimit.InMemoryOptions{}, h.AuthRegister)
	h.RestClient.AddRateLimitedRoute("GET", "/api/auth/me", ratelimit.InMemoryOptions{}, h.WithAuth(h.AuthMe))

	// TODO: add github sso auth/create
	// TODO: add reset password functionality
	// TODO: add remove account
}
