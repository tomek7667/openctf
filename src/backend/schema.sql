-- Create openctf schema
CREATE SCHEMA IF NOT EXISTS openctf;
SET search_path TO openctf;

-- Create "aggregated_contests_difficulties" view
CREATE OR REPLACE VIEW "aggregated_contests_difficulties" ("contest_id", "contest_name", "end", "organizers_id", "avg_difficulty", "participants") AS
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

-- Create "aggregated_user_statistics" view
CREATE OR REPLACE VIEW "aggregated_user_statistics" ("total_views", "writeups_authored", "contests_participated", "user_id") AS
SELECT
	1 as "total_views",
	2 as "writeups_authored",
	3 as "contests_participated",
	u.id as "user_id"
FROM
	"users" u;

-- Create "aggregated_platform_statistics" view
CREATE OR REPLACE VIEW "aggregated_platform_statistics" ("total_users", "total_teams", "total_upcoming_events", "total_past_events", "total_live_events") AS
SELECT
	(SELECT COUNT(id) FROM "users") AS "total_users",
	(SELECT COUNT(id) FROM "teams") AS "total_teams",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() < "start") AS "total_upcoming_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "end") AS "total_past_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "start" AND NOW() < "end") AS "total_live_events";

-- Create "aggregated_contests" view
DROP VIEW "aggregated_contests";
CREATE OR REPLACE VIEW "aggregated_contests" (
	"id", "name", "description", "rules", "prizes",
	"start", "end", "url", "ctftime_id", "assigned_weight_points",
	"logo_url", "contest_organizers", "duration", "rating", "participants"
) AS
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

-- Create "aggregated_teams_details" view
CREATE OR REPLACE VIEW "aggregated_teams_details" (
	"id", "name", "description", "ctftime_id", "ctftime_verified_at",
	"verified_at", "country_code", "team_logo_url", "banner_image_url",
	"discord_url", "github_url", "recruiting", "contact_info", "looking_for",
	"website_url", "avg_place", "years_active", "contest_history", "achievements",
	"members", "captain", "verified_by"
) AS
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
group by t.id;