package openctf

import (
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// TeamsList retrieves a list of teams.
//
//	@Summary		Get list of teams
//	@Description	Fetches and returns a list of teams based on the provided criteria.
//	@Tags			teams
//	@Accept			json
//	@Produce		json
//	@Param			offset			query		int				false	"Pagination offset"
//	@Param			limit			query		int				false	"Pagination limit"
//	@Param			countryCodes	query		[]string		false	"Country codes to include"
//	@Success		200				{object}	map[string]any	"List of teams"
//	@Failure		400				{object}	map[string]any	"Bad request error"
//	@Failure		500				{object}	map[string]any	"Internal server error"
//	@Router			/teams/list [get]
func (h *Handler) TeamsList(ctx *gin.Context) {
	var dto service.ListTeamsDto

	if err := ctx.ShouldBindQuery(&dto); err != nil {
		ctx.JSON(400, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	teams, err := h.ServiceClient.ListTeams(ctx, &dto)
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
