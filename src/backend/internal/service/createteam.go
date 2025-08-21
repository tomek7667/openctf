package service

import (
	"context"
	"errors"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/team"
	"openctfbackend/internal/achievements"
)

type CreateTeamDto struct {
	Name           string   `json:"name"`
	Description    *string  `json:"description"`
	CountryCode    string   `json:"country_code"`
	TeamLogoUrl    *string  `json:"team_logo_url"`
	BannerImageUrl *string  `json:"banner_image_url"`
	WebsiteUrl     *string  `json:"website_url"`
	DiscordUrl     *string  `json:"discord_url"`
	GithubUrl      *string  `json:"github_url"`
	Recruiting     bool     `json:"recruiting"`
	ContactInfo    *string  `json:"contact_info"`
	LookingFor     []string `json:"looking_for"`
	CtftimeID      *int     `json:"ctftime_id,omitempty"`
}

func (c *Client) CreateTeam(ctx context.Context, captain *ent.User, dto *CreateTeamDto) (*ent.Team, error) {
	tx, err := c.C.BeginTx(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("beginning transaction failed: %w", err)
	}
	teamCreate := tx.Team.
		Create().
		SetName(dto.Name).
		SetCountryCode(dto.CountryCode).
		AddMembers(captain).
		SetCaptain(captain).
		SetRecruiting(dto.Recruiting)
	if dto.CtftimeID != nil && *dto.CtftimeID != 0 {
		teamCreate.SetCtftimeID(*dto.CtftimeID)
	}
	if dto.Description != nil && *dto.Description != "" {
		teamCreate.SetDescription(*dto.Description)
	}
	if dto.TeamLogoUrl != nil && *dto.TeamLogoUrl != "" {
		teamCreate.SetTeamLogoURL(*dto.TeamLogoUrl)
	}
	if dto.BannerImageUrl != nil && *dto.BannerImageUrl != "" {
		teamCreate.SetBannerImageURL(*dto.BannerImageUrl)
	}
	if dto.WebsiteUrl != nil && *dto.WebsiteUrl != "" {
		teamCreate.SetWebsiteURL(*dto.WebsiteUrl)
	}
	if dto.DiscordUrl != nil && *dto.DiscordUrl != "" {
		teamCreate.SetDiscordURL(*dto.DiscordUrl)
	}
	if dto.GithubUrl != nil && *dto.GithubUrl != "" {
		teamCreate.SetGithubURL(*dto.GithubUrl)
	}
	if dto.ContactInfo != nil && *dto.ContactInfo != "" {
		teamCreate.SetContactInfo(*dto.ContactInfo)
	}
	if len(dto.LookingFor) > 0 {
		teamCreate.SetLookingFor(dto.LookingFor)
	} else {
		teamCreate.SetLookingFor([]string{})
	}

	t, err := teamCreate.Save(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("failed creating a team"), err)
	}
	_, err = c.AddActivity(ctx, tx, TeamActivityType, "Created a team", dto.Name, captain.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to add activity for team creation: %w", err)
	}
	_, err = c.CheckAddAchievement(ctx, tx, achievements.CreatedTeamAchievement, captain)
	if err != nil {
		return nil, fmt.Errorf("failed to check and add achievement for team creation: %w", err)
	}
	if err := tx.Commit(); err != nil {
		return nil, fmt.Errorf("committing transaction failed: %w", err)
	}

	t, err = c.C.Team.
		Query().
		WithCaptain().
		WithMembers().
		WithVerifiedBy().
		Where(team.ID(t.ID)).
		First(ctx)
	if err != nil {
		return nil, errors.Join(fmt.Errorf("team has been created but couldn't retrieve it"), err)
	}
	return t, nil
}
