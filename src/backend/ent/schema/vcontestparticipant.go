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
type VContestParticipant struct {
	ent.View
}

func (VContestParticipant) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
SELECT
	p.contest_places AS contest_id,
	p.place_associated_team AS team_id,
	MIN(p.place) AS best_place
FROM
	places p
WHERE
	p.place_associated_team IS NOT NULL
GROUP BY
	p.contest_places,
	p.place_associated_team;
`),
	}
}

func (VContestParticipant) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("contest_id"),
		field.Int("team_id"),
		field.Int("best_place"),
	})
}
