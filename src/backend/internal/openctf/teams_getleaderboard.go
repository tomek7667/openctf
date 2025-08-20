package openctf

import (
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

func (h *Handler) TeamsGetLeaderboard(ctx *gin.Context) {
	var dto service.GetCurrentYearLeaderboardDto
	if err := ctx.ShouldBindQuery(&dto); err != nil {
		ctx.JSON(400, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	leaderboard, err := h.ServiceClient.GetCurrentYearLeaderboard(ctx, &dto)
	if err != nil {
		ctx.JSON(500, gin.H{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, gin.H{
		"leaderboard": leaderboard,
	}, nil)
}
