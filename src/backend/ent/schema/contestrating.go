package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type ContestRating struct {
	ent.Schema
}

func (ContestRating) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("rating").Min(0).Max(5).StructTag(`json:"rating"`),
		field.Bool("relevant").
			Default(false).
			StructTag(`json:"relevant"`).
			Comment("this will be true if the user is in a team that was participating in at least top 15%"),
		field.Text("comment").Optional().Nillable(),
	})
}

func (ContestRating) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required(),
		edge.To("contest", Contest.Type).Unique().Required(),
	}
}

func (ContestRating) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("user", "contest").Unique(),
	}
}
