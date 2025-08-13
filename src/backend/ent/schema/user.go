package schema

import (
	"regexp"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type User struct {
	ent.Schema
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").Match(regexp.MustCompile("[a-z0-9_-]+$")).Unique(),
		field.String("email").Match(regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$`)).Unique(),
		field.Time("email_confirmed_at").Nillable().Optional().StructTag(`json:"email_confirmed_at"`),
		field.String("confirmation_code").Nillable().Optional().Sensitive(),
		field.Enum("permission_level").Values("player", "moderator", "administrator").Default("player"),
		field.String("description").Nillable().Optional(),
		field.String("password").Sensitive(),
		field.Time("created_at").Default(time.Now()).Immutable(),
		field.Bytes("logo").MaxLen(50 * 1024 * 1024).Nillable().Optional(), // Max 50 MB
		field.Int64("github_account_id").Nillable().Optional(),
		field.String("github_username").Nillable().Optional(),
		field.String("github_name").Nillable().Optional(),
		field.String("github_email").Nillable().Optional(),
		field.String("github_avatar_url").Nillable().Optional(),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("teams", Team.Type).Ref("members"),
	}
}
