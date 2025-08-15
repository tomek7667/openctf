package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// TeamAchievement holds the schema definition for the TeamAchievement entity.
type TeamAchievement struct {
	ent.Schema
}

// Fields of the TeamAchievement.
func (TeamAchievement) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("name").Unique(),
		field.Time("unlocked_at").Default(time.Now()),
	})
}

// Edges of the TeamAchievement.
func (TeamAchievement) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("team", Team.Type).Unique().Required().Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
