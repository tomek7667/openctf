package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// UserProfile holds the schema definition for the UserProfile entity.
type UserProfile struct {
	ent.Schema
}

// Fields of the UserProfile.
func (UserProfile) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("location").Nillable().Optional().MaxLen(30),
		field.String("github_link").Nillable().Optional(),
		field.String("linkedin_link").Nillable().Optional(),
		field.String("twitter_link").Nillable().Optional(),
		field.String("website_link").Nillable().Optional(),
		field.Int("web_skill_level").Default(0).Min(0).Max(100),
		field.Int("rev_skill_level").Default(0).Min(0).Max(100),
		field.Int("pwn_skill_level").Default(0).Min(0).Max(100),
		field.Int("crypto_skill_level").Default(0).Min(0).Max(100),
		field.Int("misc_skill_level").Default(0).Min(0).Max(100),
		field.Bool("show_email").Default(false),
		field.Bool("show_location").Default(false),
	})
}

// Edges of the UserProfile.
func (UserProfile) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required().Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
