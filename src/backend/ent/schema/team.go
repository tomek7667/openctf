package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Team struct {
	ent.Schema
}

func (Team) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Unique(),
		field.String("description").Optional(),
		field.Int("ctftime_id").Optional().Nillable(),
		field.Time("ctftime_verified_at").Optional().Nillable(),
		field.Bytes("logo").MaxLen(50 * 1024 * 1024).Optional(), // Max 50 MB
		field.Time("verified_at").Optional().Nillable(),
	}
}

func (Team) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("captain", User.Type).Unique(),
		edge.To("verified_by", User.Type).Unique(),
		edge.To("members", User.Type),
	}
}
