package openctf

import (
	"log/slog"

	"openctfbackend/internal/ent"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
)

type RestClient interface {
	AddRateLimitedRoute(
		method, path string,
		opts ratelimit.InMemoryOptions,
		handlers ...gin.HandlerFunc,
	)
	AddRoute(method, path string, handlers ...gin.HandlerFunc)
	Serve()
}

type Handler struct {
	RestClient RestClient
	EntClient  *ent.Client
}

func New(restClient RestClient, entClient *ent.Client) *Handler {
	return &Handler{
		RestClient: restClient,
		EntClient:  entClient,
	}
}

func (h *Handler) Handle() {
	slog.Info("starting openctf handler")
	go h.DbHealth()

	h.AddRoutes_ApiAuth()

	defer h.EntClient.C.Close()
	slog.Info("serving")
	h.RestClient.Serve()
}
