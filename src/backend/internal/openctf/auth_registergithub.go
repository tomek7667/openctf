package openctf

import (
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) AuthRegisterGithub(ctx *gin.Context) {
	var err error
	// TODO: create account
	rest.FailOrReturn(ctx, map[string]any{
		// "user":  user,
		// "token": *token,
	}, err)
}
