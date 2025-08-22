package service

import (
	"context"
	"time"

	"openctfbackend/ent"
)

type CreateCrawlerTeamDto struct {
	CtftimeTeamID   int
	CtftimeTeamName string
}

func (c *Client) CreateCrawlerTeam(ctx context.Context, tx *ent.Tx, dto *CreateCrawlerTeamDto) (*ent.Team, error) {
	return tx.Team.Create().
		SetName(dto.CtftimeTeamName).
		SetCountryCode("GLOBAL").
		AddMembers(c.AdminUser).
		SetCaptain(c.AdminUser).
		SetRecruiting(false).
		SetCtftimeID(dto.CtftimeTeamID).
		SetDescription("This team has been automatically imported from ctftime. If you are the captain of the team and would like to take it over, please do contact the administrators or moderators of openctf.").
		SetVerifiedAt(time.Now()).
		SetVerifiedBy(c.AdminUser).
		Save(ctx)
}
