package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type ContestRating struct {
	ent.Schema
}

func (ContestRating) Fields() []ent.Field {
	return []ent.Field{
		field.Int("rating").Min(0).Max(5),
		field.Bool("relevant").
			Default(false).
			Comment("this will be true if the user is in a team that was participating in at least top 15%"),
	}
}

func (ContestRating) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required(),
		edge.To("contest", User.Type).Unique().Required(),
	}
}
