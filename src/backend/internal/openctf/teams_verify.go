package openctf

import (
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// TeamsVerify handles team verification.
//
//	@Summary		Verify team
//	@Description	Verifies a team based on the provided data.
//	@Tags			teams
//	@Accept			json
//	@Produce		json
//	@Security		Authorization
//	@Param			body	body		service.VerifyTeamDto	true	"Team verification data"
//	@Success		200		{object}	map[string]any			"Verified team details"
//	@Failure		400		{object}	map[string]any			"Bad request error"
//	@Failure		500		{object}	map[string]any			"Internal server error"
//	@Router			/teams/verify [post]
func (h *Handler) TeamsVerify(ctx *gin.Context, user *ent.User) {
	dto := service.VerifyTeamDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	team, err := h.ServiceClient.VerifyTeam(ctx, user, &dto)
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
