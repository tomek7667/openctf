package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Activity holds the schema definition for the Activity entity.
type Activity struct {
	ent.Schema
}

// Fields of the Activity.
func (Activity) Fields() []ent.Field {
	return []ent.Field{
		field.String("type").NotEmpty(),
		field.String("title"),
		field.String("description"),
		field.Time("date").Default(time.Now()),
	}
}

// Edges of the Activity.
func (Activity) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("user", User.Type).Unique().Required(),
	}
}
