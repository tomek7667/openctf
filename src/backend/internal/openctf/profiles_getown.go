package openctf

import (
	"openctfbackend/ent"
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) ProfilesGetOwn(ctx *gin.Context, user *ent.User) {
	profile, err := h.ServiceClient.GetProfile(ctx, user.ID)
	rest.FailOrReturn(ctx, profile, err)
}
