package rest

import (
	"fmt"
	"log/slog"
	"net/http"
	"time"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
)

func keyFunc(c *gin.Context) string {
	return c.ClientIP()
}

func errorHandler(c *gin.Context, info ratelimit.Info) {
	slog.Debug(
		"too many requests handler",
		"requester", c.ClientIP(),
		"can try again in", time.Until(info.ResetTime).String(),
	)
	c.JSON(http.StatusTooManyRequests, map[string]any{
		"success": false,
		"message": fmt.Sprintf(
			"Too many requests. Try again in %s",
			time.Until(info.ResetTime).String(),
		),
	})
}

func (c *Client) AddRoute(method, path string, handlers ...gin.HandlerFunc) {
	c.Router.Handle(method, path, handlers...)
}

func (c *Client) AddRateLimitedRoute(
	method, path string,
	opts ratelimit.InMemoryOptions,
	handlers ...gin.HandlerFunc,
) {
	if opts.Rate == 0 {
		opts.Rate = 5 * time.Second
	}
	if opts.Limit == 0 {
		opts.Limit = 15
	}
	store := ratelimit.InMemoryStore(&opts)
	mw := ratelimit.RateLimiter(store, &ratelimit.Options{
		ErrorHandler: errorHandler,
		KeyFunc:      keyFunc,
	})
	_handlers := []gin.HandlerFunc{
		mw,
	}
	_handlers = append(_handlers, handlers...)
	c.AddRoute(method, path, _handlers...)
}
