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
type AggregatedTeamsDetails struct {
	ent.View
}

func (AggregatedTeamsDetails) Annotations() []schema.Annotation {
	return []schema.Annotation{
		entsql.View(`
select
	t.id as "id",
	t.name as "name",
	t.description as "description",
	t.ctftime_id as "ctftime_id",
	t.ctftime_verified_at as "ctftime_verified_at",
	t.verified_at as "verified_at",
	t.country_code as "country_code",
	t.team_logo_url as "team_logo_url",
	t.banner_image_url as "banner_image_url",
	t.discord_url as "discord_url",
	t.github_url as "github_url",
	t.recruiting as "recruiting",
	t.contact_info as "contact_info",
	t.looking_for as "looking_for",
	t.website_url as "website_url",
	-- current place
	-- -- TODO
	-- points
	-- -- TODO
	-- avg_place
	(
		select
			avg(p.place)
		from
			places p
		where
			p.place_associated_team = t.id
	) as "avg_place",
	-- years_active
	extract(year from (now() - t.created_at)) as "years_active",
	-- contest_history
	coalesce((
		select
			json_agg(json_build_object(
				'id', c.id,
				'name', c."name",
				'year', extract(year from c."end")::int,
				'start', c."start",
				'end', c."end",
				'place', p.place,
				'rating', ( -- nullable
					select
						avg(cr.rating)
					from
						contest_ratings cr
					where
						cr.relevant is true and
						cr.contest_rating_contest = c.id
				),
				'openctf_points', p.openctf_points,
				'assigned_weight_points', p.assigned_weight_points,
				'participants', (
					select
						count(pp.id)
					from
						places pp
					where
						pp.contest_places = p.contest_places
				)
			))
		from
			places p
		left join
			contests c on
			p.associated_contest_id = c.id
		where
			p.place_associated_team = t.id
	), '[]'::json) as "contest_history",
	-- achievements
	coalesce((
		select
			json_agg(json_build_object(
				'id', ta.id,
				'name', ta."name",
				'unlocked_at', ta.unlocked_at
			))
		from
			team_achievements ta
		where
			t.id = ta.team_achievement_team
	), '[]'::json) as "achievements",
	-- members
	(
		select
			json_agg(json_build_object(
				'id', u.id,
				'username', u.username,
				'description', u.description,
				'logo_url', coalesce(
					u.logo_url,
					u.github_avatar_url
				),
				'email_confirmed_at', u.email_confirmed_at,
				'created_at', u.created_at,
				'email', u.email
			))
		from
			users u
		inner join
			team_members tm on
			tm.user_id = u.id
		where
			t.id = tm.team_id
	) as "members",
	-- captain
	(
		select
			json_build_object(
				'id', u.id,
				'username', u.username,
				'description', u.description,
				'logo_url', coalesce(
					u.logo_url,
					u.github_avatar_url
				),
				'email_confirmed_at', u.email_confirmed_at,
				'created_at', u.created_at,
				'email', u.email
			)
		from
			users u
		where
			u.id = t.team_captain
		limit 1
	) as "captain",
	-- verified by
	(
		select
			json_build_object(
				'id', u.id,
				'username', u.username,
				'description', u.description,
				'logo_url', coalesce(
					u.logo_url,
					u.github_avatar_url
				),
				'email_confirmed_at', u.email_confirmed_at,
				'created_at', u.created_at,
				'email', u.email
			)
		from
			users u
		where
			u.id = t.team_verified_by 
		limit 1
	) as "verified_by"
from
	teams t
group by t.id
`),
	}
}

type TeamsDetailsContest struct {
	Id                   int       `json:"id"`
	Name                 string    `json:"name"`
	Year                 int       `json:"year"`
	Start                time.Time `json:"start"`
	End                  time.Time `json:"end"`
	Place                int       `json:"place"`
	Rating               *float64  `json:"rating"`
	OpenctfPoints        int       `json:"openctf_points"`
	AssignedWeightPoints int       `json:"assigned_weight_points"`
	Participants         int       `json:"participants"`
}

type TeamsDetailsAchievement struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	UnlockedAt time.Time `json:"unlocked_at"`
}

type TeamsDetailsUser struct {
	Id               int        `json:"id"`
	Username         string     `json:"username"`
	Description      *string    `json:"description"`
	LogoUrl          *string    `json:"logo_url"`
	EmailConfirmedAt *time.Time `json:"email_confirmed_at"`
	CreatedAt        time.Time  `json:"created_at"`
	Email            string     `json:"email"`
}

func (AggregatedTeamsDetails) Fields() []ent.Field {
	return TrimOmitEmptyTag([]ent.Field{
		field.Int("id"),
		field.String("name"),
		field.String("description").Nillable().Optional(),
		field.Int("ctftime_id").Nillable().Optional(),
		field.Time("ctftime_verified_at").Nillable().Optional(),
		field.Time("verified_at").Nillable().Optional(),
		field.String("country_code"),
		field.String("team_logo_url").Nillable().Optional(),
		field.String("banner_image_url").Nillable().Optional(),
		field.String("discord_url").Nillable().Optional(),
		field.String("github_url").Nillable().Optional(),
		field.Bool("recruiting"),
		field.String("contact_info").Nillable().Optional(),
		field.JSON("looking_for", []string{}).Optional(),
		field.String("website_url").Nillable().Optional(),
		field.Float("avg_place").Nillable().Optional(),
		field.Int("years_active"),
		field.JSON("contest_history", []TeamsDetailsContest{}).Optional(),
		field.JSON("achievements", []TeamsDetailsAchievement{}).Optional(),
		field.JSON("members", []TeamsDetailsUser{}).Optional(),
		field.JSON("captain", TeamsDetailsUser{}).Optional(),
		field.JSON("verified_by", TeamsDetailsUser{}).Optional(),
	})
}
