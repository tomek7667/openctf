package schema

import (
	"regexp"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").Match(regexp.MustCompile("[a-z0-9_-]+$")).Unique(),
		field.Enum("permission_level").Values("player", "moderator", "administrator").Default("player"),
		field.String("description").Optional(),
		field.String("password").Sensitive(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("playing_for", Team.Type),
	}
}
