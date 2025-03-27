package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
	"openctfbackend/ent/user"
)

type VerifyTeamDto struct {
	TeamID int `json:"teamId"`
}

var ErrVerifyTeamInsufficientPermissions = errors.New("you don't have the required permission level to verify a team")

func (c *Client) VerifyTeam(ctx context.Context, verifier *ent.User, dto *VerifyTeamDto) (*ent.Team, error) {
	if verifier.PermissionLevel != user.PermissionLevelModerator &&
		verifier.PermissionLevel != user.PermissionLevelAdministrator {
		return nil, ErrVerifyTeamInsufficientPermissions
	}

	t, err := c.C.Team.Get(ctx, dto.TeamID)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed getting the team of %d id for verification", dto.TeamID), err)
	}
	if t.VerifiedAt != nil {
		existingVerifier := t.QueryVerifiedBy().FirstX(ctx)
		if existingVerifier.ID == verifier.ID {
			return nil, fmt.Errorf("you already verified this teams")
		} else {
			return nil, fmt.Errorf("this team was already verified by %s", existingVerifier.Username)
		}
	}

	t, err = t.
		Update().
		SetVerifiedAt(time.Now()).
		SetVerifiedBy(verifier).
		Save(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed saving the team of %d id when verifying", dto.TeamID), err)
	}
	t, err = c.C.Team.
		Query().
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		Where(team.ID(t.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("team has been verified but couldn't retrieve it"), err)
	}

	return t, nil
}
