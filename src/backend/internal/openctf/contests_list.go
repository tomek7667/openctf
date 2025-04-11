package openctf

import (
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// ContestsList retrieves a list of contests.
//
//	@Summary		Get list of contests
//	@Description	Fetches and returns a list of contests based on the provided criteria.
//	@Tags			contests
//	@Accept			json
//	@Produce		json
//	@Param			offset	query	int	false	"Pagination offset"
//	@Param			limit	query	int	false	"Pagination limit"
//	@Success		200		{object}	map[string]any	"List of contests"
//	@Failure		400		{object}	map[string]any	"Bad request error"
//	@Failure		500		{object}	map[string]any	"Internal server error"
//	@Router			/contests/list [get]
func (h *Handler) ContestsList(ctx *gin.Context) {
	var dto service.ListContestsDto

	if err := ctx.ShouldBindQuery(&dto); err != nil {
		ctx.JSON(400, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	teams, err := h.ServiceClient.ListContests(ctx, &dto)
	if err != nil {
		ctx.JSON(500, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	rest.FailOrReturn(ctx, gin.H{
		"teams": teams,
	}, nil)
}
