package crawler

import (
	"context"
	"time"

	"openctfbackend/ent"
	"openctfbackend/internal/ctftime"
	"openctfbackend/internal/service"
)

type ServiceClient interface {
	GetEnt() *ent.Client

	GetContestByCtftimeID(ctx context.Context, ctftimeID int) (*ent.Contest, error)
	CreateContest(ctx context.Context, dto *service.CreateContestDto) (*ent.Contest, error)
}

type CtftimeClient interface {
	GetEventsBetween(ctx context.Context, start, finish time.Time) ([]ctftime.Event, error)
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
