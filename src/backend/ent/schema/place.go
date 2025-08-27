package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type Place struct {
	ent.Schema
}

func (Place) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("team_name").NotEmpty(),
		field.Int("place").Min(1),
		field.Int("ctftime_team_id").Nillable().Optional(),
		field.Float("contest_points").Min(0).Nillable().Optional().Comment("the actual amount of points obtained by the place holder in the ctf"),
		field.Int("associated_contest_id"),
		field.Float("assigned_weight_points").Default(0),
	})
}

func (Place) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("associated_team", Team.Type).Unique(),
	}
}

func (Place) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("team_name", "ctftime_team_id", "associated_contest_id").Unique(),
	}
}
