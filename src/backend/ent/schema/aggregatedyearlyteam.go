package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
)

// The rest of the document, assumes you use Ent with Atlas Pro, as Ent does not have migration
// support for views or other database objects besides tables and relationships. However, using
// Atlas or its Pro subscription is not mandatory. Ent does not require a specific migration engine,
// and as long as the view exists in the database, the client should be able to query it.
// Due to the above, I created in `cmd/entgen/main.go` the code that runs schema.sql in the db.
type AggregatedYearlyTeam struct {
	ent.View
}

func (AggregatedYearlyTeam) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
SELECT
	t.*,
	EXTRACT(YEAR FROM c.end) AS "year",
	SUM(p.assigned_weight_points) AS "team_points"
FROM
	teams t
LEFT JOIN
	places p ON
	p.place_associated_team = t.id
INNER JOIN
	contests c ON
	c.id = p.contest_places
GROUP BY
	t.id,
	t.name,
	EXTRACT(YEAR FROM c.end);
`),
	}
}

func (AggregatedYearlyTeam) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		// basically copy+paste from teams
		field.String("name").Unique(),
		field.String("description").Nillable().Optional(),
		field.String("country_code").Default("global"),
		field.String("team_logo_url").Nillable().Optional(),
		field.String("banner_image_url").Nillable().Optional(),
		field.String("website_url").Nillable().Optional(),
		field.String("discord_url").Nillable().Optional(),
		field.String("github_url").Nillable().Optional(),
		field.Bool("recruiting").Default(false),
		field.String("contact_info").Nillable().Optional(),
		field.JSON("looking_for", []string{}).Optional(),
		field.Time("created_at").Default(time.Now()).Immutable(),
		field.Int("ctftime_id").Nillable().Optional(),
		field.Time("ctftime_verified_at").Nillable().Optional(),
		field.Time("verified_at").Nillable().Optional(),

		// aggregated fields
		field.Int("year"),
		field.Float("team_points").Nillable().Optional(),
	})
}
