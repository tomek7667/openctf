package openctf

import (
	"net/http"

	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"

	"github.com/gin-gonic/gin"
)

// AuthRegister handles user registration.
//
//	@Summary		Register user
//	@Description	Registers a new user and returns a token upon successful registration.
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Param			body	body		service.RegisterDto	true	"Registration details"
//	@Success		200		{object}	map[string]any		"User and token"
//	@Failure		400		{object}	map[string]any		"Bad request error"
//	@Failure		500		{object}	map[string]any		"Internal server error"
//	@Router			/auth/register [post]
func (h *Handler) AuthRegister(ctx *gin.Context) {
	dto := service.RegisterDto{}
	err := ctx.ShouldBind(&dto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, map[string]any{
			"success": false,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}
	user, token, err := h.ServiceClient.Register(ctx, &dto)
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
