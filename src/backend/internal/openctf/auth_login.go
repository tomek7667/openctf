package openctf

import (
	"net/http"

	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// AuthLogin handles user authentication and login.
//
//	@Summary		Authenticate user
//	@Description	Authenticates a user and returns a token upon successful login.
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Param			body	body		service.LoginDto	true	"Login credentials"
//	@Success		200		{object}	map[string]any		"User and token"
//	@Failure		400		{object}	map[string]any		"Bad request error"
//	@Failure		500		{object}	map[string]any		"Internal server error"
//	@Router			/auth/login [post]
func (h *Handler) AuthLogin(ctx *gin.Context) {
	dto := service.LoginDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	user, token, err := h.ServiceClient.Login(ctx, &dto)
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
