package openctf

import (
	"net/http"
	"strconv"

	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

// TeamsGetOne retrieves details of a specific team by its ID.
//
//	@Summary		Get team details
//	@Description	Retrieves information about a specific team using its unique ID.
//	@Tags			teams
//	@Accept			json
//	@Produce		json
//	@Param			teamId	path		int				true	"Team ID"
//	@Success		200		{object}	map[string]any	"Team details"
//	@Failure		400		{object}	map[string]any	"Bad request error"
//	@Failure		500		{object}	map[string]any	"Internal server error"
//	@Router			/teams/{teamId} [get]
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
