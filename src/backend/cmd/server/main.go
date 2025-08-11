package main

import (
	"fmt"
	"log/slog"
	"os"
	"sync"

	"openctfbackend/internal/crawler"
	"openctfbackend/internal/croner"
	"openctfbackend/internal/ctftime"
	"openctfbackend/internal/logger"
	"openctfbackend/internal/openctf"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

	"github.com/joho/godotenv"
	"github.com/tomek7667/goimail/icloud"
)

var (
	restClient    *rest.Client
	serviceClient *service.Client
	ctftimeClient *ctftime.Client
	icloudClient  *icloud.Client
)

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
	var err error
	godotenv.Load(".env.local")
	logger.SetLogLevel()

	restClient = rest.New(utils.Getenv("APP_PORT", "7999"))
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
	icloudClient, err = icloud.New(
		utils.Getenv("ICLOUD_EMAIL", ""),
		utils.Getenv("ICLOUD_SENDER_EMAIL", ""),
		utils.Getenv("ICLOUD_APP_SPECIFIC_PASSWORD", ""),
	)
}

// SetupSwaggerDocs configures the global docs settings for Swagger.
//
//	@title						OpenCTF API
//	@version					1.0
//	@description				OpenCTF API backend swagger docs. In order to use locked endpoints, paste your `Authorization` token after clicking the `Authorize` button. You can obtain one by either registering or logging in.
//	@host						127.0.0.1:7999
//	@BasePath					/api
//	@schemes					http https
//	@securityDefinitions.apikey	Authorization
//	@in							header
//	@name						Authorization
func main() {
	openctf := openctf.New(
		restClient,
		serviceClient,
		ctftimeClient,
		icloudClient,
	)
	crawler := crawler.New(
		serviceClient,
		ctftimeClient,
	)
	croner := croner.New(
		serviceClient,
	)
	if len(os.Args) > 1 {
		slog.Info("the args are", "args", os.Args)
		switch os.Args[1] {
		case "openctf":
			openctf.Handle()
		case "crawler":
			crawler.Handle()
			return
		case "croner":
			croner.Handle()
			return
		case "version", "v", "--version", "-v":
			fmt.Println(openctf.GetVersion())
			return
		default:
			slog.Error("unknown command", "command", os.Args[1])
			os.Exit(1)
		}

	}

	wg := &sync.WaitGroup{}
	wg.Add(3)
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
				slog.Error("panic recovered in croner.Handle", "err", r)
			}
		}()
		croner.Handle()
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
