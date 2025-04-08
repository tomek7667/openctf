package rest

import (
	"log/slog"
	"time"

	"openctfbackend/docs"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Client struct {
	Port   string
	Router *gin.Engine
}

func New(port string) *Client {
	c := &Client{
		Port: port,
	}
	c.Router = gin.New()
	return c
}

func (c *Client) Serve() {
	slog.Info("starting rest client", "port", c.Port, "mode", gin.Mode())
	c.Router.Use(gin.Recovery())
	c.Router.Use(
		gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
			slog.Debug(
				"http request log",
				"client ip", param.ClientIP,
				"time", param.TimeStamp.Format(time.RFC1123),
				"method", param.Method,
				"path", param.Path,
				"proto", param.Request.Proto,
				"status code", param.StatusCode,
				"latency", param.Latency,
				"user agent", param.Request.UserAgent(),
				"error message", param.ErrorMessage,
			)
			return ""
		}),
	)

	// Automatic swagger docs based on comments
	docs.SwaggerInfo.BasePath = "/api"
	c.Router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler, ginSwagger.PersistAuthorization(true)))

	c.Router.Run(":" + c.Port)
}
