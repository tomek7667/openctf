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
type AggregatedContestsDifficulties struct {
	ent.View
}

func (AggregatedContestsDifficulties) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
SELECT
	c.id AS "contest_id",
	c.name AS "contest_name",
	c."end" AS "end",
	c.contest_organizers as "organizers_id",
	AVG(wr.difficulty) AS "avg_difficulty",
	(
		SELECT
			COUNT(p.id)
		FROM
			places p
		WHERE
			p.associated_contest_id = c.id
	) AS "participants"
FROM
	contests c
RIGHT JOIN
	weight_ratings wr
ON
	c.id = wr.weight_rating_contest
WHERE
	NOW() > c."end" AND
	c.contest_organizers IS NOT NULL AND
	(
		SELECT
			COUNT(p.id)
		FROM
			places p
		WHERE
			p.contest_places = c.id
	) > 50 AND
	(
		SELECT
			COUNT(pr.id)
		FROM
			contests pr
		WHERE
			pr."contest_organizers" IS NOT NULL AND
			pr."contest_organizers" = c."contest_organizers" AND
			(pr.id != c.id) AND
			(pr.end) < (NOW() - INTERVAL '6 month')
	) > 0
GROUP BY
	c.id;
`),
	}
}

func (AggregatedContestsDifficulties) Fields() []ent.Field {
	return []ent.Field{
		field.Int("contest_id"),
		field.String("contest_name"),
		field.Time("end"),
		field.Int("organizers_id"),
		field.Float("avg_difficulty"),
		field.Int("participants"),
	}
}
