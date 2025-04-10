package openctf

import (
	"net/http"
	"strconv"

	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

// ContestGetOne retrieves details of a specific contest by its ID.
//
//	@Summary		Get contest details
//	@Description	Retrieves information about a specific contest using its unique ID.
//	@Tags			contests
//	@Accept			json
//	@Produce		json
//	@Param			contestId	path		int				true	"Contest ID"
//	@Success		200			{object}	map[string]any	"Contest details"
//	@Failure		400			{object}	map[string]any	"Bad request error"
//	@Failure		500			{object}	map[string]any	"Internal server error"
//	@Router			/contests/{contestId} [get]
func (h *Handler) ContestGetOne(ctx *gin.Context) {
	contestIdStr := ctx.Param("contestId")
	contestId, err := strconv.Atoi(contestIdStr)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	contest, err := h.ServiceClient.GetContest(ctx, contestId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, map[string]any{
		"contest": contest,
	}, err)
}
