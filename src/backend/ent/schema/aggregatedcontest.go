package schema

import (
	"regexp"

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
type AggregatedContest struct {
	ent.View
}

func (AggregatedContest) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
SELECT
	c.*,
	(
		SELECT
			AVG(cr.rating)
		FROM
			contest_ratings cr
		WHERE
			cr.contest_rating_contest = c.id
	) AS "rating",
	(
		SELECT
			COUNT(p.id)
		FROM
			places p
		WHERE
			p."contest_places" = c.id
	) as "participants"
FROM
	contests c;
`),
	}
}

func (AggregatedContest) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		// basically copy+paste from contests
		field.Int("id"),
		field.String("name").Match(regexp.MustCompile("[a-z0-9A-Z _-]+$")).Unique(),
		field.String("description").Nillable().Optional(),
		field.String("rules").Nillable().Optional(),
		field.String("prizes").Nillable().Optional(),
		field.Time("start"),
		field.Time("end"),
		field.Float("duration").Comment("duration of the contest in hours"),
		field.String("url").Match(regexp.MustCompile(`https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)`)).Nillable().Optional(),
		field.Int("ctftime_id").Nillable().Optional(), // automatically loaded ctftime event id if the ctf was submitted by the crawler and not an openctf user.
		field.Int("assigned_weight_points").Default(0).StructTag(`json:"assigned_weight_points"`),
		field.String("logo_url").Nillable().Optional(),

		// aggregated fields
		field.Float("rating").Nillable().Optional(),
		field.Int("participants").Nillable().Optional(),
	})
}
