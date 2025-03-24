package openctf

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"time"

	"openctfbackend/ent/user"
	"openctfbackend/internal/ent"
	"openctfbackend/internal/utils"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
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

func (h *Handler) ObserveDb() {
	// adding default admin for the service in the database
	admin, err := h.EntClient.C.User.
		Query().
		Where(user.Username("admin")).
		First(context.Background())
	if err != nil {
		adminServicePassword := utils.Getenv("ADMIN_SERVICE_PASSWORD", "Password123!")
		if adminServicePassword == "Password123!" {
			slog.Warn("using default admin password. DO NOT allow this log to happen in production", "env variable for JWT_SECRET", os.Getenv("JWT_SECRET"))
		}
		encryptedPassword, _ := bcrypt.GenerateFromPassword(
			[]byte(adminServicePassword), bcrypt.DefaultCost,
		)
		admin, err = h.EntClient.C.User.
			Create().
			SetUsername("admin").
			SetPermissionLevel(user.PermissionLevelAdministrator).
			SetPassword(string(encryptedPassword)).
			Save(context.Background())
		if err != nil {
			panic(errors.Join(
				fmt.Errorf("creating the default admin failed"),
				err,
			))
		}
	}

	// lifecheck on connection to the database
	ticker := time.NewTicker(15 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		if _, err := h.EntClient.C.User.Get(context.Background(), admin.ID); err != nil {
			slog.Error("database unavailable", "error", err)
		} else {
			// slog.Info("database is available")
		}
	}
}

func (h *Handler) Handle() {
	slog.Info("starting openctf handler")
	go h.ObserveDb()

	h.AddRoutes_ApiAuth()

	defer h.EntClient.C.Close()
	slog.Info("serving")
	h.RestClient.Serve()
}
