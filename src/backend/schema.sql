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