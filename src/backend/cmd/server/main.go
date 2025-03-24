package main

import (
	"log/slog"

	"openctfbackend/internal/ent"
	"openctfbackend/internal/logger"
	"openctfbackend/internal/openctf"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/utils"

	_ "github.com/mattn/go-sqlite3"
)

var (
	restClient *rest.Client
	entClient  *ent.Client
)

func init() {
	var err error
	logger.SetLogLevel()

	restClient = rest.New(utils.Getenv("PORT", "7999"))
	entClient, err = ent.New()
	if err != nil {
		slog.Error("initializing ent client failed", "err", err)
		panic(err)
	}
}

func main() {
	handler := openctf.New(restClient, entClient)

	handler.Handle()
}
