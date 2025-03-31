package schema

import (
	"regexp"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Place struct {
	ent.Schema
}

func (Place) Fields() []ent.Field {
	return []ent.Field{
		field.String("team_name").Match(regexp.MustCompile("[a-z0-9 _-]+$")).Unique(),
		field.Int("place").Min(1),
		field.Float("contest_points").Min(0).Optional().Nillable().Comment("the actual amount of points obtained by the place holder in the ctf"),
		field.Float("openctf_points").Min(0).Optional().Nillable().Comment("these points are normalized based on contest_points being max multiplied by the ctf weight"),
		field.Int("assigned_weight_points").Default(0),
	}
}

func (Place) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("contest", Contest.Type).Required().Unique(),
		edge.To("associated_team", Team.Type).Unique(),
	}
}
