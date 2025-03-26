package openctf

import (
	"openctfbackend/ent"

	"github.com/gin-gonic/gin"
)

// `WithAuth` is a middleware, that prevents the request from going further
// unless it contains an `Authorization` header with signed by the backend jwt token.
// If the token is valid, the `*ent.User` instance will be set into the `ctx` and can be retrieved by
// `ctx.Get("user").(*ent.User)` in the request further. It takes only one argument: `wrappee`,
// which is the function that will receive the user object in both the parameter and the `ctx`.
func (h *Handler) WithAuth(wrappee func(ctx *gin.Context, user *ent.User)) func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		token := ctx.GetHeader("Authorization")
		if token == "" {
			ctx.JSON(401, map[string]string{
				"error": "missing authorization header",
			})
			ctx.Abort()
			return
		}
		user, err := h.ServiceClient.VerifyToken(ctx, token)
		if err != nil {
			ctx.JSON(401, map[string]string{
				"error": err.Error(),
			})
			ctx.Abort()
			return
		}
		ctx.Set("user", user)
		wrappee(ctx, user)
		// ctx.Next()
	}
}
