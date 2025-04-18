-- Create "aggregated_contests_difficulties" view
CREATE OR REPLACE VIEW "aggregated_contests_difficulties" ("contest_id", "contest_name", "end", "avg_difficulty") AS SELECT
	c.id AS "contest_id",
	c.name AS "contest_name",
	c."end" AS "end",
	AVG(wr.difficulty) AS "avg_difficulty"
FROM
	contests c
RIGHT JOIN
	weight_ratings wr 
ON
	c.id = wr.weight_rating_contest
GROUP BY
	c.id;
