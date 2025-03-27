package openctf

import (
	"openctfbackend/ent"
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthMe(ctx *gin.Context, user *ent.User) {
	rest.FailOrReturn(ctx, map[string]any{
		"user": user,
	}, nil)
}
