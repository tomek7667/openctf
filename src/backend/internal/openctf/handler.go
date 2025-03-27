package openctf

import (
	"log/slog"

	"openctfbackend/internal/service"

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
	RestClient    RestClient
	ServiceClient *service.Client
}

func New(restClient RestClient, serviceClient *service.Client) *Handler {
	return &Handler{
		RestClient:    restClient,
		ServiceClient: serviceClient,
	}
}

func (h *Handler) Handle() {
	slog.Info("starting openctf handler")
	go h.DbHealth()

	h.AddRoutes_ApiAuth()
	h.AddRoutes_ApiTeams()

	defer h.ServiceClient.C.Close()
	slog.Info("serving")
	h.RestClient.Serve()
}
