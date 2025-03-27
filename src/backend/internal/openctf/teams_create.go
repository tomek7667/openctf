package openctf

import (
	"log/slog"
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handler) TeamsCreate(ctx *gin.Context, user *ent.User) {
	dto := service.CreateTeamDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	if dto.CtftimeID != 0 {
		ctftimeTeam, err := h.CtftimeClient.GetTeam(dto.CtftimeID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, map[string]any{
				"success": false,
				"message": err.Error(),
				"data":    nil,
			})
			return
		}
		if ctftimeTeam.Logo != "" {
			logo, err := utils.GetImage(ctftimeTeam.Logo)
			if err != nil {
				slog.Warn(
					"found ctftime team when creating a new team, but retrieving logo failed",
					"err", err,
					"ctftime team", ctftimeTeam,
				)
			} else {
				dto.Logo = logo
			}
		}
	}

	team, err := h.ServiceClient.CreateTeam(ctx, user, &dto)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, map[string]any{
		"team": team,
	}, err)
}
