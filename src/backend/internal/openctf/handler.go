package openctf

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/internal/ctftime"
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

type ServiceClient interface {
	GetEnt() *ent.Client

	CreateTeam(ctx context.Context, captain *ent.User, dto *service.CreateTeamDto) (*ent.Team, error)
	GetTeam(ctx context.Context, teamId int) (*ent.Team, error)
	ListTeams(ctx context.Context, dto *service.ListTeamsDto) ([]*ent.Team, error)
	Login(ctx context.Context, dto *service.LoginDto) (*ent.User, *string, error)
	Register(ctx context.Context, dto *service.RegisterDto) (*ent.User, *string, error)
	VerifyTeam(ctx context.Context, verifier *ent.User, dto *service.VerifyTeamDto) (*ent.Team, error)
	MergeTeams(ctx context.Context, user *ent.User, dto *service.MergeTeamsDto) (*ent.Team, error)
	VerifyToken(ctx context.Context, token string) (*ent.User, error)
}

type CtftimeClient interface {
	GetTeam(id int) (*ctftime.Team, error)
}

type Handler struct {
	RestClient    RestClient
	ServiceClient ServiceClient
	CtftimeClient CtftimeClient
}

func New(
	restClient RestClient,
	serviceClient ServiceClient,
	ctftimeClient CtftimeClient,
) *Handler {
	return &Handler{
		RestClient:    restClient,
		ServiceClient: serviceClient,
		CtftimeClient: ctftimeClient,
	}
}
