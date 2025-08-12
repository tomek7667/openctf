package openctf

import (
	"context"

	"openctfbackend/ent"
	"openctfbackend/internal/ctftime"
	"openctfbackend/internal/service"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
	"github.com/tomek7667/goimail/icloud"
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
	DeleteUserByUsername(ctx context.Context, username string) error
	VerifyEmail(ctx context.Context, dto *service.VerifyEmailDto) (*ent.User, *string, error)
	VerifyTeam(ctx context.Context, verifier *ent.User, dto *service.VerifyTeamDto) (*ent.Team, error)
	MergeTeams(ctx context.Context, user *ent.User, dto *service.MergeTeamsDto) (*ent.Team, error)
	VerifyToken(ctx context.Context, token string) (*ent.User, error)
	CreateContest(ctx context.Context, organizers *ent.Team, dto *service.CreateContestDto) (*ent.Contest, error)
	GetContest(ctx context.Context, contestId int) (*ent.Contest, error)
	ListContests(ctx context.Context, dto *service.ListContestsDto) ([]*ent.Contest, error)
	RateContestOpinion(
		ctx context.Context,
		requester *ent.User,
		contestId int,
		dto *service.RateContestDto,
	) (*ent.ContestRating, error)
	GetProfile(ctx context.Context, userId int) (*service.Profile, error)
	UpdateProfile(
		ctx context.Context,
		user *ent.User,
		dto *service.UpdateOwnDto,
	) (*ent.UserProfile, error)
}

type CtftimeClient interface {
	GetTeam(id int) (*ctftime.Team, error)
}

type MailerClient interface {
	SendMail(subject, body string, options *icloud.SendMailOptions, to ...string) error
}

type Handler struct {
	RestClient    RestClient
	ServiceClient ServiceClient
	CtftimeClient CtftimeClient
	MailerClient  MailerClient
}

func New(
	restClient RestClient,
	serviceClient ServiceClient,
	ctftimeClient CtftimeClient,
	mailerClient MailerClient,
) *Handler {
	return &Handler{
		RestClient:    restClient,
		ServiceClient: serviceClient,
		CtftimeClient: ctftimeClient,
		MailerClient:  mailerClient,
	}
}

func (*Handler) GetVersion() string {
	return version
}
