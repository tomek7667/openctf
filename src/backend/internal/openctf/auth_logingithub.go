package openctf

import (
	"net/http"

	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthLoginGithub(ctx *gin.Context) {
	dto := service.CodeDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	token, err := h.GithubClient.GetUserAccessToken(ctx, dto.Code)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": "Failed to connect to GitHub: " + err.Error(),
			"data":    nil,
		})
		return
	}
	email, err := h.GithubClient.GetPrimaryEmail(ctx, *token)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": "Failed to get GitHub email: " + err.Error(),
			"data":    nil,
		})
		return
	}
	ghUser, err := h.GithubClient.GetUserInfo(ctx, *token)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": "Failed to get GitHub user info: " + err.Error(),
			"data":    nil,
		})
		return
	}
	user, token, err := h.ServiceClient.LoginGithub(ctx, *email, ghUser)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, map[string]any{
		"user":  user,
		"token": *token,
	}, err)
}
