package service

import (
	"context"
	"fmt"

	"openctfbackend/ent"
	"openctfbackend/ent/user"
	"openctfbackend/ent/userprofile"
)

type UpdateOwnDto struct {
	Location         *string `json:"location"`
	GithubLink       *string `json:"github_link"`
	LinkedinLink     *string `json:"linkedin_link"`
	TwitterLink      *string `json:"twitter_link"`
	WebsiteLink      *string `json:"website_link"`
	WebSkillLevel    int     `json:"web_skill_level"`
	RevSkillLevel    int     `json:"rev_skill_level"`
	PwnSkillLevel    int     `json:"pwn_skill_level"`
	CryptoSkillLevel int     `json:"crypto_skill_level"`
	MiscSkillLevel   int     `json:"misc_skill_level"`
	ShowEmail        bool    `json:"show_email"`
	ShowLocation     bool    `json:"show_location"`
}

func (c *Client) UpdateProfile(
	ctx context.Context,
	_user *ent.User,
	dto *UpdateOwnDto,
) (*ent.UserProfile, error) {
	_userProfile, err := c.C.UserProfile.
		Query().
		Where(userprofile.HasUserWith(user.ID(_user.ID))).
		First(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user profile: %w", err)
	}
	builder := c.C.UserProfile.UpdateOne(_userProfile)
	if dto.Location != nil {
		builder = builder.SetLocation(*dto.Location)
	} else {
		builder = builder.ClearLocation()
	}
	if dto.GithubLink != nil {
		builder = builder.SetGithubLink(*dto.GithubLink)
	} else {
		builder = builder.ClearGithubLink()
	}
	if dto.LinkedinLink != nil {
		builder = builder.SetLinkedinLink(*dto.LinkedinLink)
	} else {
		builder = builder.ClearLinkedinLink()
	}
	if dto.TwitterLink != nil {
		builder = builder.SetTwitterLink(*dto.TwitterLink)
	} else {
		builder = builder.ClearTwitterLink()
	}
	if dto.WebsiteLink != nil {
		builder = builder.SetWebsiteLink(*dto.WebsiteLink)
	} else {
		builder = builder.ClearWebsiteLink()
	}
	builder = builder.
		SetWebSkillLevel(dto.WebSkillLevel).
		SetRevSkillLevel(dto.RevSkillLevel).
		SetPwnSkillLevel(dto.PwnSkillLevel).
		SetCryptoSkillLevel(dto.CryptoSkillLevel).
		SetMiscSkillLevel(dto.MiscSkillLevel).
		SetShowEmail(dto.ShowEmail).
		SetShowLocation(dto.ShowLocation)
	up, err := builder.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}
	return up, nil
}
