package openctf

import (
	"log/slog"
	"net/http"

	"openctfbackend/internal/ent"
	"openctfbackend/internal/rest"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-gonic/gin"
)

func (h *Handler) AddRoutes_ApiAuth() {
	slog.Info("registering auth api")

	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/login", ratelimit.InMemoryOptions{}, func(ctx *gin.Context) {
		dto := ent.LoginDto{}
		err := ctx.ShouldBind(&dto)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, map[string]any{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
			return
		}
		user, token, err := h.EntClient.Login(ctx, &dto)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, map[string]any{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
			return
		}
		rest.FailOrReturn(ctx, map[string]any{
			"user":  user,
			"token": *token,
		}, err)
	})

	h.RestClient.AddRateLimitedRoute("POST", "/api/auth/register", ratelimit.InMemoryOptions{}, func(ctx *gin.Context) {
		dto := ent.RegisterDto{}
		err := ctx.ShouldBind(&dto)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, map[string]any{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
			return
		}
		user, token, err := h.EntClient.Register(ctx, &dto)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, map[string]any{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
			return
		}
		rest.FailOrReturn(ctx, map[string]any{
			"user":  user,
			"token": *token,
		}, err)
	})
}
