package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Team struct {
	ent.Schema
}

func (Team) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("name").Unique(),
		field.String("description").Nillable().Optional(),
		field.String("country_code").Default("global"),
		field.String("team_logo_url").Nillable().Optional(),
		field.String("banner_image_url").Nillable().Optional(),
		field.String("website_url").Nillable().Optional(),
		field.String("discord_url").Nillable().Optional(),
		field.String("github_url").Nillable().Optional(),
		field.Bool("recruiting").Default(false),
		field.String("contact_info").Nillable().Optional(),
		field.JSON("looking_for", []string{}).Optional(),
		field.Time("created_at").Default(time.Now()).Immutable(),

		field.Int("ctftime_id").Nillable().Optional(),
		field.Time("ctftime_verified_at").Nillable().Optional(),
		field.Time("verified_at").Nillable().Optional(),
	})
}

func (Team) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("captain", User.Type).Unique(),
		edge.To("verified_by", User.Type).Unique(),
		edge.To("members", User.Type),
	}
}
