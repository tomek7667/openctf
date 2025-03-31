package crawler

import (
	"log/slog"
	"time"

	"openctfbackend/ent"
	"openctfbackend/internal/ctftime"
)

type ServiceClient interface {
	GetEnt() *ent.Client

	// TODO: CreateEvent()
}

type CtftimeClient interface {
	GetEventsBetween(start, finish time.Time) ([]ctftime.Event, error)
}

type Handler struct {
	ServiceClient ServiceClient
	CtftimeClient CtftimeClient
}

func New(
	serviceClient ServiceClient,
	ctftimeClient CtftimeClient,
) *Handler {
	return &Handler{
		ServiceClient: serviceClient,
		CtftimeClient: ctftimeClient,
	}
}

func (h *Handler) Handle() {
	slog.Info("starting crawler handler")
	defer h.ServiceClient.GetEnt().Close()
}
