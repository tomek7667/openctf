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
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "end") AS "total_upcoming_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() < "start") AS "total_past_events",
	(SELECT COUNT(id) FROM "contests" WHERE NOW() > "start" AND NOW() < "end") AS "total_live_events";
