package rest

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func FailOrReturn(ctx *gin.Context, output any, err error, message ...string) {
	if err != nil {
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
