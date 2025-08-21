package schema

import (
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
type AggregatedPlatformStatistics struct {
	ent.View
}

func (AggregatedPlatformStatistics) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
SELECT
	(SELECT COUNT(id) FROM "users") AS "total_users",
	(SELECT COUNT(id) FROM "teams") AS "total_teams",
	(
		SELECT 
			COUNT(t.id)
		FROM
			"teams" t
		WHERE
			t.recruiting = TRUE
	) AS "total_teams_recruiting",
	(
		SELECT 
			COUNT(DISTINCT t.country_code)
		FROM
			"teams" t
		WHERE
			t.country_code IS NOT NULL AND t.country_code != '' AND t.country_code != 'global'
	) AS "total_teams_distinct_countries",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() < "start") AS "total_upcoming_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "end") AS "total_past_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "start" AND NOW() < "end") AS "total_live_events";
`),
	}
}

func (AggregatedPlatformStatistics) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("total_users"),
		field.Int("total_teams"),
		field.Int("total_teams_recruiting"),
		field.Int("total_teams_distinct_countries"),
		field.Int("total_upcoming_events"),
		field.Int("total_past_events"),
		field.Int("total_live_events"),
	})
}
