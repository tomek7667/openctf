package openctf

import (
	"openctfbackend/internal/rest"

	"github.com/gin-gonic/gin"
)

func (h *Handler) StatisticsList(ctx *gin.Context) {
	stats, err := h.ServiceClient.GetPlatformStatistics(ctx)

	rest.FailOrReturn(ctx, stats, err)
}
