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
	return []ent.Field{
		field.String("team_name").NotEmpty(),
		field.Int("place").Min(1),
		field.Int("ctftime_team_id").Optional().Nillable(),
		field.Float("contest_points").Min(0).Optional().Nillable().Comment("the actual amount of points obtained by the place holder in the ctf"),
		field.Float("openctf_points").Min(0).Optional().Nillable().Comment("these points are normalized based on contest_points being max multiplied by the ctf weight"),
		field.Int("associated_contest_id"),
		field.Int("assigned_weight_points").Default(0),
	}
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
