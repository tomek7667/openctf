package schema

import (
	"regexp"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Contest struct {
	ent.Schema
}

func (Contest) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Match(regexp.MustCompile("[a-z0-9 _-]+$")).Unique(),
		field.String("description").Optional().Nillable(),
		field.String("rules").Optional().Nillable(),
		field.String("prizes").Optional().Nillable(),
		field.Time("start"),
		field.Time("end"),
		field.String("url").Match(regexp.MustCompile(`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`)).Optional().Nillable(),
		field.Int("ctftime_id").Optional().Nillable(), // automatically loaded ctftime event id if the ctf was submitted by the crawler and not an openctf user.
		field.Int("assigned_weight_points").Default(0),
	}
}

func (Contest) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("organizers", Team.Type).Unique(),
	}
}
