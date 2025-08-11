package rest

import (
	"net/http"
	"slices"
	"strings"

	"openctfbackend/internal/utils"

	"github.com/gin-gonic/gin"
)

func FailOrReturn(ctx *gin.Context, output any, err error, message ...string) {
	if err != nil {
		origin := ctx.GetHeader("Origin")
		allowedOrigins := strings.Split(utils.Getenv("ALLOWED_ORIGINS", "http://rce.wtf:3000,http://127.0.0.1:3000"), ",")
		if slices.Contains(allowedOrigins, origin) {
			ctx.Header("Access-Control-Allow-Origin", origin)
			ctx.Header("Access-Control-Allow-Credentials", "true")
		}
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	msg := strings.Join(message, "; ")
	ctx.JSON(http.StatusOK, map[string]any{
		"success": true,
		"message": msg,
		"data":    output,
	})
}
