package main

import (
	"fmt"
	"log/slog"

	"openctfbackend/internal/logger"
	"openctfbackend/internal/openctf"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"
)

var (
	restClient    *rest.Client
	serviceClient *service.Client
)

func getCreds() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
		utils.Getenv("POSTGRES_HOST", "127.0.0.1"),
		utils.Getenv("POSTGRES_PORT", "30001"),
		utils.Getenv("POSTGRES_USER", "localuser"),
		utils.Getenv("POSTGRES_DB", "postgres"),
		utils.Getenv("POSTGRES_PASSWORD", "localpassword"),
		utils.Getenv("SSL_MODE", "disable"),
	)
}

func init() {
	var err error
	logger.SetLogLevel()

	restClient = rest.New(utils.Getenv("PORT", "7999"))
	serviceClient, err = service.New(getCreds())
	if err != nil {
		slog.Error("initializing ent client failed", "err", err)
		panic(err)
	}
}

func main() {
	handler := openctf.New(restClient, serviceClient)

	handler.Handle()
}
