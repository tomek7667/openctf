package service

import (
	"context"
	"fmt"
)

type EligibleOpinionVoter struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	TeamID   int    `json:"team_id"`
	TeamName string `json:"team_name"`
	Place    int    `json:"place"`
}

const SqlGetEligibleOpinionVoters = `
-- SqlGetEligibleOpinionVoters ($1 = contestId :: int)
WITH ranked AS (
  SELECT
    v.team_id,
    v.best_place AS place,
    ROW_NUMBER() OVER (ORDER BY v.best_place, v.team_id) AS place_rank,
    COUNT(*)  OVER ()                                    AS total_participants
  FROM "v_contest_participants" v
  WHERE v.contest_id = $1
),
cut AS (
  -- K = min(50, ceil(30% of participants)), but at least 1
  SELECT GREATEST(1, LEAST(50, CEIL(0.30 * COALESCE(MAX(total_participants), 0)::numeric)))::int AS k
  FROM ranked
)
SELECT
  u.id::int   AS user_id,
  u.username  AS username,
  t.id::int   AS team_id,
  t.name      AS team_name,
  r.place::int AS place
FROM ranked r
JOIN cut ON TRUE
JOIN teams t ON t.id = r.team_id
JOIN users u ON u.id = t.team_captain
WHERE r.place_rank <= cut.k
ORDER BY r.place, t.id;
`

func (c *Client) GetEligibleOpinionVoters(ctx context.Context, contestId int) ([]EligibleOpinionVoter, error) {
	rows, err := c.C.QueryContext(ctx, SqlGetEligibleOpinionVoters, contestId)
	if err != nil {
		return nil, fmt.Errorf("query eligible opinion voters: %w", err)
	}
	defer rows.Close()

	voters := []EligibleOpinionVoter{}
	for rows.Next() {
		var v EligibleOpinionVoter
		if err := rows.Scan(&v.UserID, &v.Username, &v.TeamID, &v.TeamName, &v.Place); err != nil {
			return nil, fmt.Errorf("scan eligible opinion voters: %w", err)
		}
		voters = append(voters, v)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate eligible opinion voters: %w", err)
	}
	var uniqueVoters []EligibleOpinionVoter
	seen := make(map[int]bool)
	for _, v := range voters {
		if !seen[v.UserID] {
			uniqueVoters = append(uniqueVoters, v)
			seen[v.UserID] = true
		}
	}
	return uniqueVoters, nil
}
