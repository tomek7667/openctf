package schema

import (
	"regexp"
	"time"

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
		field.String("email").Match(regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$`)).Unique(),
		field.Time("email_confirmed_at").Optional().Nillable(),
		field.String("confirmation_code").Optional().Nillable().Sensitive(),
		field.Enum("permission_level").Values("player", "moderator", "administrator").Default("player"),
		field.String("description").Optional(),
		field.String("password").Sensitive(),
		field.Time("created_at").Default(time.Now()).Immutable(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("playing_for", Team.Type),
	}
}
