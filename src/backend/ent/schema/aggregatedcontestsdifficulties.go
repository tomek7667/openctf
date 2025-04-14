package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema"
	"entgo.io/ent/schema/field"
)

type AggregatedContestsDifficulties struct {
	ent.View
}

func (AggregatedContestsDifficulties) Annotations() []schema.Annotation {
	// TODO: this doesn't show in dbeaver-figure out what's the problem with creating this view.
	return []schema.Annotation{
		entsql.View(`
SELECT
	c.id,
	c.name,
	c."end",
	AVG(wr.difficulty) AS "avg_difficulty"
FROM
	contests c
RIGHT JOIN
	weight_ratings wr 
ON
	c.id = wr.weight_rating_contest
GROUP BY
	c.id
`),
	}
}

func (AggregatedContestsDifficulties) Fields() []ent.Field {
	return []ent.Field{
		field.Int("id"),
		field.String("name"),
		field.Time("end"),
		field.Float("avg_difficulty"),
	}
}
