package openctf

import (
	"net/http"

	"openctfbackend/internal/ent"
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthRegister(ctx *gin.Context) {
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
}
