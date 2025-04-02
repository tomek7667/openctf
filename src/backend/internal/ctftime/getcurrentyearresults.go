package ctftime

import (
	"context"
	"time"
)

func (c *Client) GetCurrentYearResults(ctx context.Context) (*CtftimeResultsResponse, error) {
	y := time.Now().Year()
	return c.GetResults(ctx, y)
}
