package openctf

import (
	"net/http"
	"strconv"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ContestsCreate(ctx *gin.Context, user *ent.User) {
	dto := service.CreateContestDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	orgsIdStr := ctx.Query("organizersId")
	if orgsIdStr == "" {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": "you must supply your 'organizersId' in query - who will be organising the contest",
			"data":    nil,
		})
		return
	}
	orgsId, err := strconv.Atoi(orgsIdStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	team, err := h.ServiceClient.GetTeam(ctx, orgsId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	if team.Edges.Captain.ID != user.ID {
		ctx.JSON(http.StatusForbidden, map[string]any{
			"success": false,
			"message": "you must be the team's captain in order to create a contest",
			"data":    nil,
		})
		return
	}

	contest, err := h.ServiceClient.CreateContest(ctx, team, &dto)
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
