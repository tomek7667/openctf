package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
)

func (c *Client) GetPlatformStatistics(ctx context.Context) (*ent.AggregatedPlatformStatistics, error) {
	stats, err := c.C.AggregatedPlatformStatistics.Query().First(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get platform statistics: %w", err)
	}
	return stats, nil
}
