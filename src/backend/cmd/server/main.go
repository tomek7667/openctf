package main

import (
	"openctfbackend/internal/logger"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/utils"
)

var restClient *rest.Client

func init() {
	logger.SetLogLevel()

	restClient = rest.New(utils.Getenv("PORT", "7999"))
}

func main() {
	restClient.Serve()
}
