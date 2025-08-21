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
WITH team_year AS (
  SELECT
    t.*,
    COALESCE((EXTRACT(YEAR FROM c.end)), EXTRACT(YEAR FROM NOW())) AS "year",
    COALESCE(SUM(p.assigned_weight_points), 0) AS "team_points",
	(
		SELECT
			COUNT(tm.user_id)
		FROM
			"team_members" tm
		WHERE
			t.id = tm.team_id
	) AS "members",
	AVG(p.place) AS "avg_place",
	COUNT(p.id) AS "contests_count",
	(
		SELECT
			COUNT(p2.id)
		FROM
			places p2
		WHERE
			p2.place_associated_team = t.id
			AND p2.place = 1
	) AS "contests_won"
  FROM teams t
  LEFT JOIN places p ON
  	p.place_associated_team = t.id
  LEFT JOIN contests c ON
  	c.id = p.contest_places
  GROUP BY
  	t.id,
	t.name,
	EXTRACT(YEAR FROM c.end)
)
SELECT
  ty.*,
  ROW_NUMBER() OVER (
    PARTITION BY ty."year"
    ORDER BY ty.team_points DESC, ty.id ASC
  ) AS "rank"
FROM team_year ty;
`),
	}
}

func (AggregatedYearlyTeam) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		// basically copy+paste from teams
		field.Int("id"),
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
		field.Int("rank"),
		field.Float("team_points").Nillable().Optional(),
		field.Int("members").Nillable().Optional(),
		field.Float("avg_place").Nillable().Optional(),
		field.Int("contests_count"),
		field.Int("contests_won"),
	})
}
