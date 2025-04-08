package openctf

import (
	"openctfbackend/ent"
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

// AuthMe retrieves the authenticated user's information.
//
//	@Summary		Get authenticated user
//	@Description	Returns the details of the currently authenticated user.
//	@Tags			authentication
//	@Accept			json
//	@Produce		json
//	@Security		Authorization
//	@Success		200	{object}	map[string]any	"Authenticated user details"
//	@Failure		401	{object}	map[string]any	"Unauthorized error"
//	@Failure		500	{object}	map[string]any	"Internal server error"
//	@Router			/auth/me [get]
func (h *Handler) AuthMe(ctx *gin.Context, user *ent.User) {
	rest.FailOrReturn(ctx, map[string]any{
		"user": user,
	}, nil)
}
