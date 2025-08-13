package openctf

import (
	"fmt"
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthConnectGithub(ctx *gin.Context, user *ent.User) {
	dto := service.ConnectGithubDto{}
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
	u, err := h.ServiceClient.ConnectGithub(
		ctx,
		user,
		*email,
		ghUser,
	)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": fmt.Sprintf("Failed connecting GitHub account: %v", err),
			"data":    nil,
		})
		return
	}
	openctfToken, err := utils.GetToken(u)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": fmt.Sprintf("Failed getting token for user %s: %v", user.Username, err),
			"data":    nil,
		})
		return
	}
	rest.FailOrReturn(ctx, map[string]any{
		"user":  u,
		"token": openctfToken,
	}, err)
}
