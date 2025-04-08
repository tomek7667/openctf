package openctf

import (
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// TeamsMerge handles merging of two teams.
//
//	@Summary		Merge teams
//	@Description	Merges two teams into one based on the provided details.
//	@Tags			teams
//	@Accept			json
//	@Produce		json
//	@Security		Authorization
//	@Param			body	body		service.MergeTeamsDto	true	"Details for merging teams"
//	@Success		200		{object}	map[string]any			"Merged team details"
//	@Failure		400		{object}	map[string]any			"Bad request error"
//	@Failure		500		{object}	map[string]any			"Internal server error"
//	@Router			/teams/merge [post]
func (h *Handler) TeamsMerge(ctx *gin.Context, user *ent.User) {
	dto := service.MergeTeamsDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	team, err := h.ServiceClient.MergeTeams(ctx, user, &dto)
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
