package openctf

import (
	"log/slog"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
)

func (h *Handler) AddRoutes_ApiAuth() {
	slog.Info("registering auth api")

	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/login", ratelimit.InMemoryOptions{}, h.AuthLogin)
	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/register", ratelimit.InMemoryOptions{}, h.AuthRegister)
	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/verify", ratelimit.InMemoryOptions{}, h.AuthVerify)
	h.RestClient.AddRateLimitedRoute("GET", "/api/auth/me", ratelimit.InMemoryOptions{}, h.WithAuth(h.AuthMe))
	h.RestClient.AddRoute("POST", "/api/auth/register-github", h.AuthRegisterGithub)
	h.RestClient.AddRoute("POST", "/api/auth/connect-github", h.WithAuth(h.AuthConnectGithub))
	h.RestClient.AddRoute("POST", "/api/auth/disconnect-github", h.WithAuth(h.AuthDisconnectGithub))
	h.RestClient.AddRoute("POST", "/api/auth/github/webhook", func(ctx *gin.Context) {
		slog.Info("gh webhook invoked")
	})
	// TODO: add reset password functionality
	// TODO: add remove account
}
