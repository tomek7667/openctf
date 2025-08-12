package openctf

import (
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ProfilesUpdateOwn(ctx *gin.Context, user *ent.User) {
	dto := service.UpdateOwnDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	profile, err := h.ServiceClient.UpdateProfile(ctx, user, &dto)
	rest.FailOrReturn(ctx, profile, err)
}
