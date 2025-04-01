package main

import (
	"fmt"
	"log/slog"
	"sync"

	"openctfbackend/internal/crawler"
	"openctfbackend/internal/ctftime"
	"openctfbackend/internal/logger"
	"openctfbackend/internal/openctf"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"
)

var (
	restClient    *rest.Client
	serviceClient *service.Client
	ctftimeClient *ctftime.Client
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
	ctftimeClient, err = ctftime.New(utils.Getenv("CTFTIME_API_URL", "https://ctftime.org/api/v1"))
	if err != nil {
		slog.Error("initializing ctftime client failed", "err", err)
		panic(err)
	}
}

func main() {
	openctf := openctf.New(
		restClient,
		serviceClient,
		ctftimeClient,
	)
	crawler := crawler.New(
		serviceClient,
		ctftimeClient,
	)

	wg := &sync.WaitGroup{}
	wg.Add(2)
	go func() {
		defer wg.Done()
		defer func() {
			if r := recover(); r != nil {
				slog.Error("panic recovered in crawler.Handle", "err", r)
			}
		}()
		crawler.Handle()
	}()
	go func() {
		defer wg.Done()
		defer func() {
			if r := recover(); r != nil {
				slog.Error("panic recovered in openctf.Handle", "err", r)
			}
		}()
		openctf.Handle()
	}()
	wg.Wait()
}
