package openctf

import (
	"fmt"
	"net/http"

	"openctfbackend/ent"
	"openctfbackend/internal/rest"
	"openctfbackend/internal/utils"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthDisconnectGithub(ctx *gin.Context, user *ent.User) {
	if user.GithubAccountID == nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": "this account is not linked with any github account",
			"data":    nil,
		})
		return
	}
	u, err := h.ServiceClient.DisconnectGithub(ctx, user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, map[string]any{
			"success": false,
			"message": "Failed to disconnect from GitHub: " + err.Error(),
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
