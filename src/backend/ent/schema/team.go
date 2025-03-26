package schema

import (
	"regexp"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Team holds the schema definition for the Team entity.
type Team struct {
	ent.Schema
}

// Fields of the Team.
func (Team) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Match(regexp.MustCompile("[a-z0-9 _-]+$")).Unique(),
		field.String("description").Optional(),
		field.Bytes("logo").MaxLen(50 * 1024 * 1024).Optional(), // Max 50 MB
		field.Time("verified_at").Optional().Nillable(),
	}
}

// Edges of the Team.
func (Team) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("captain", User.Type).Unique(),
	}
}
