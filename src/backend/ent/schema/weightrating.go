package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type WeightRating struct {
	ent.Schema
}

func (WeightRating) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("difficulty").Min(0).Max(100),
	})
}

func (WeightRating) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("captains_team", Team.Type).Unique().Required(),
		edge.To("contest", Contest.Type).Unique().Required(),
	}
}

func (WeightRating) Indexes() []ent.Index {
	return []ent.Index{
		index.Edges("captains_team", "contest").Unique(),
	}
}
