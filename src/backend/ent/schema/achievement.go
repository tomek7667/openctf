package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// Achievement holds the schema definition for the Achievement entity.
type Achievement struct {
	ent.Schema
}

// Fields of the Achievement.
func (Achievement) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.String("name").Unique(),
		field.String("description"),
		field.Enum("rarity").Values("common", "rare", "epic", "legendary"),
		field.Time("unlocked_at").Default(time.Now()),
	})
}

// Edges of the Achievement.
func (Achievement) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required().Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}

func (Achievement) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("name").Edges("user").Unique(),
	}
}
