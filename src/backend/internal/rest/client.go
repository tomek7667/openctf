package rest

import (
	"log/slog"
	"strings"
	"time"

	"openctfbackend/docs"
	"openctfbackend/internal/utils"

	"github.com/gin-contrib/cors"
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
	c.Router.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Split(utils.Getenv("ALLOWED_ORIGINS", "http://rce.wtf:3000,http://127.0.0.1:3000"), ","),
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposeHeaders:    []string{"Content-Length", "Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))
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
