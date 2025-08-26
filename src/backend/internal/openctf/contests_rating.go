package openctf

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ContestsRating(ctx *gin.Context) {
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
	if contest == nil {
		ctx.JSON(http.StatusNotFound, map[string]any{
			"success": false,
			"message": "contest not found",
			"data":    nil,
		})
		return
	}

	weightRatings, err := h.ServiceClient.GetContestWeightRatings(ctx, contestId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	ratings, err := h.ServiceClient.GetContestRatings(ctx, contestId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	eligibleWeightVoters, err := h.ServiceClient.GetEligibleWeightVoters(ctx, contestId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	eligibleOpinionVoters, err := h.ServiceClient.GetEligibleOpinionVoters(ctx, contestId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	ctx.JSON(http.StatusOK, map[string]any{
		"success": true,
		"message": "ok",
		"data": map[string]any{
			"weight_ratings":          weightRatings,
			"opinion_ratings":         ratings,
			"eligible_weight_voters":  eligibleWeightVoters,
			"eligible_opinion_voters": eligibleOpinionVoters,
		},
	})
}
