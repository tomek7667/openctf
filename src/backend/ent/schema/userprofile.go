package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// UserProfile holds the schema definition for the UserProfile entity.
type UserProfile struct {
	ent.Schema
}

// Fields of the UserProfile.
func (UserProfile) Fields() []ent.Field {
	return []ent.Field{
		field.String("location").Optional().MaxLen(30),
		field.String("github_link").Optional(),
		field.String("linkedin_link").Optional(),
		field.String("twitter_link").Optional(),
		field.String("website_link").Optional(),
		field.Int("web_skill_level").Default(0).Min(0).Max(100),
		field.Int("rev_skill_level").Default(0).Min(0).Max(100),
		field.Int("pwn_skill_level").Default(0).Min(0).Max(100),
		field.Int("crypto_skill_level").Default(0).Min(0).Max(100),
		field.Int("misc_skill_level").Default(0).Min(0).Max(100),
		field.Bool("show_email").Default(false),
		field.Bool("show_location").Default(false),
	}
}

// Edges of the UserProfile.
func (UserProfile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required(),
	}
}
