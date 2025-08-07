//go:build ignore

package main

import (
	"context"
	"fmt"
	"log/slog"
	"openctfbackend/internal/logger"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
	"github.com/joho/godotenv"
)

var serviceClient *service.Client

func getCreds() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=%s search_path=%s",
		utils.Getenv("POSTGRES_HOST", "127.0.0.1"),
		utils.Getenv("POSTGRES_PORT", "30001"),
		utils.Getenv("POSTGRES_USER", "localuser"),
		utils.Getenv("POSTGRES_DB", "postgres"),
		utils.Getenv("POSTGRES_PASSWORD", "localpassword"),
		utils.Getenv("SSL_MODE", "disable"),
		"openctf",
	)
}

func init() {
	godotenv.Load(".env.prod")
	logger.SetLogLevel()
}

func main() {
	// sql/execquery
	err := entc.Generate("./ent/schema", &gen.Config{
		Features: []gen.Feature{
			gen.FeatureUpsert,
			gen.FeatureExecQuery,
			gen.FeatureVersionedMigration,
		},
	})
	if err != nil {
		slog.Error(
			"ent generate failed",
			"error", err,
		)
	} else {
		slog.Info("finished successfully")
	}

	serviceClient, err = service.New(getCreds())
	if err != nil {
		slog.Error("initializing ent client failed", "err", err)
		panic(err)
	}
	schemaSql := utils.MustReadFileSync("./schema.sql")
	_, err = serviceClient.GetEnt().ExecContext(context.Background(), schemaSql)
	if err != nil {
		slog.Error("executing schema.sql failed", "err", err)
	} else {
		slog.Debug("executing schema.sql finished")
	}
}
