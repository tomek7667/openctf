package openctf

import (
	"net/http"
	"strconv"

	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) TeamsGetOne(ctx *gin.Context) {
	teamIdStr := ctx.Param("teamId")
	teamId, err := strconv.Atoi(teamIdStr)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	team, err := h.ServiceClient.GetTeam(ctx, teamId)
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
