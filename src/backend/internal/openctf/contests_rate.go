package openctf

import (
	"net/http"
	"strconv"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// ContestsRate handles rating a contest by a user.
//
//	@Summary		Rate a contest
//	@Description	Allows a user to rate a contest and returns the updated rating.
//	@Tags			contests
//	@Accept			json
//	@Produce		json
//	@Security		Authorization
//	@Param			contestId	path		int						true	"Contest ID"
//	@Param			body		body		service.RateContestDto	true	"Rating details"
//	@Success		200			{object}	map[string]any			"Updated rating"
//	@Failure		400			{object}	map[string]any			"Bad request error"
//	@Failure		500			{object}	map[string]any			"Internal server error"
//	@Router			/contests/{contestId}/rate [post]
func (h *Handler) ContestsRate(ctx *gin.Context, user *ent.User) {
	teamIdStr := ctx.Param("contestId")
	contestId, err := strconv.Atoi(teamIdStr)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	dto := service.RateContestDto{}
	err = ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rating, err := h.ServiceClient.RateContest(ctx, user, contestId, &dto)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, map[string]any{
		"rating": rating,
	}, err)
}
