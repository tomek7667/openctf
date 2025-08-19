package schema

import (
	"regexp"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type Contest struct {
	ent.Schema
}

func (Contest) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("name").Match(regexp.MustCompile("[a-z0-9A-Z _-]+$")).Unique(),
		field.String("description").Nillable().Optional(),
		field.String("rules").Nillable().Optional(),
		field.String("prizes").Nillable().Optional(),
		field.Time("start"),
		field.Time("end"),
		field.Float("duration").Comment("duration of the contest in hours"),
		field.String("url").Match(regexp.MustCompile(`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`)).Nillable().Optional(),
		field.Int("ctftime_id").Nillable().Optional(), // automatically loaded ctftime event id if the ctf was submitted by the crawler and not an openctf user.
		field.Int("assigned_weight_points").Default(0).StructTag(`json:"assigned_weight_points"`),
		field.String("logo_url").Nillable().Optional(),
	})
}

func (Contest) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("organizers", Team.Type).Unique(),
		edge.To("places", Place.Type).Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
