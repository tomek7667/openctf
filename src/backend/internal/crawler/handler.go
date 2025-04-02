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
	GetCtftimeTeam(ctx context.Context, teamId int) (*ent.Team, error)
	GetContestsToBeUpdatedByPlacesCrawler(ctx context.Context) ([]*ent.Contest, error)
	CreateContest(ctx context.Context, dto *service.CreateContestDto) (*ent.Contest, error)
	CreateCtftimePlace(ctx context.Context, dto *service.CreateCtftimePlaceDto) (*ent.Place, error)
}

type CtftimeClient interface {
	GetTeam(id int) (*ctftime.Team, error)
	GetEventsBetween(ctx context.Context, start, finish time.Time) ([]ctftime.Event, error)
	GetCurrentYearResults(ctx context.Context) (*ctftime.CtftimeResultsResponse, error)
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
