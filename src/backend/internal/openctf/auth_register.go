package openctf

import (
	"fmt"
	"net/http"

	"openctfbackend/internal/rest"
	"openctfbackend/internal/service"
	"openctfbackend/internal/utils"

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
	// user.ConfirmationCode
	err = h.MailerClient.SendMail(
		"[openctf] confirm your account",
		fmt.Sprintf(`
			Hello %s,
			<br>
			Please confirm your account by clicking the link below:
			<br>
			<a href="%s">Confirm Account</a>
			<br>
			Thank you for registering with us!
		`,
			user.Username,
			fmt.Sprintf("%s/confirm?code=%s", utils.Getenv("APP_URL", "https://openctf.cyber-man.pl/"), *user.ConfirmationCode),
		),
		nil,
		user.Email,
	)
	if err != nil {
		h.ServiceClient.DeleteUserByUsername(ctx, user.Username)
		err = fmt.Errorf("failed to send confirmation e-mail to %s: %w", dto.Email, err)
	}
	rest.FailOrReturn(ctx, map[string]any{
		"user":  user,
		"token": *token,
	}, err)
}
