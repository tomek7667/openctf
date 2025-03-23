package rest

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
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
	slog.Info("starting rest client", "port", c.Port)
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
	c.Router.Run(":" + c.Port)
}
