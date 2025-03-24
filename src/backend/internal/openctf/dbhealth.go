package openctf

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"time"

	"openctfbackend/ent/user"
	"openctfbackend/internal/utils"

	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) DbHealth() {
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
			SetEmail("admin@local.host").
			SetEmailConfirmedAt(time.Now()).
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
