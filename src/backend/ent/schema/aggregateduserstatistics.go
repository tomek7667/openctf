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
type AggregatedUserStatistics struct {
	ent.View
}

func (AggregatedUserStatistics) Annotations() []schema.Annotation {
	return []schema.Annotation{ // TODO: When writeups are done and views are implemented
		entsql.View(`
SELECT
	1 as "total_views",
	2 as "writeups_authored",
	3 as "contests_participated",
	u.id as "user_id"
FROM
	"users" u
`),
	}
}

func (AggregatedUserStatistics) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("total_views"),
		field.Int("writeups_authored"),
		field.Int("contests_participated"),
		field.Int("user_id"),
	})
}
