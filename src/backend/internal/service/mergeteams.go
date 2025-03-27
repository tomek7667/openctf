package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
)

type MergeTeamsDto struct {
	MergerID int `json:"mergerId"`
	MergeeID int `json:"mergeeId"`
}

// `MergeTeams` currently adds members of mergee team to merger team and then deletes the mergee team.
func (c *Client) MergeTeams(ctx context.Context, user *ent.User, dto *MergeTeamsDto) (*ent.Team, error) {
	tmr, err := c.C.Team.
		Query().
		Where(team.ID(dto.MergerID)).
		WithCaptain().
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("finding merger team failed"), err)
	}
	tme, err := c.C.Team.
		Query().
		Where(team.ID(dto.MergeeID)).
		WithCaptain().
		WithMembers().
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("finding mergee team failed"), err)
	}

	if tmr.Edges.Captain.ID != user.ID {
		return nil, fmt.Errorf("you're not a captain of %s", tmr.Name)
	}
	if tme.Edges.Captain.ID != user.ID {
		return nil, fmt.Errorf("you're not a captain of %s", tme.Name)
	}

	tx, err := c.C.BeginTx(ctx, &sql.TxOptions{})
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed starting a transaction"), err)
	}
	tmrUpdated, err := tx.Client().Team.
		UpdateOne(tmr).
		AddMembers(tme.Edges.Members...).
		Save(ctx)
	if err != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			err = errors.Join(err, errors.Join(fmt.Errorf("rollbacking merger failed"), rollbackErr))
		}
		return nil, errors.Join(fmt.Errorf("failed updating merger team with members"), err)
	}
	err = tx.Client().Team.DeleteOne(tme).Exec(ctx)
	if err != nil {
		rollbackErr := tx.Rollback()
		if rollbackErr != nil {
			err = errors.Join(err, errors.Join(fmt.Errorf("rollbacking merger failed"), rollbackErr))
		}
		return nil, errors.Join(fmt.Errorf("failed removing mergee team"), err)
	}
	err = tx.Commit()
	if err != nil {
		return nil, errors.Join(fmt.Errorf("merging teams failed"), err)
	}
	return c.C.Team.Query().
		Where(team.ID(tmrUpdated.ID)).
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		First(ctx)
}
