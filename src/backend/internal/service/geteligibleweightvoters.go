package service

import (
	"context"
	"fmt"
)

type EligibleWeightVoter struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	TeamID   int    `json:"team_id"`
	TeamName string `json:"team_name"`
	Place    int    `json:"place"`
}

const SqlGetEligibleWeightVoters = `
-- SqlGetEligibleWeightVoters ($1 = contestId :: int8)
WITH ranked AS (
  SELECT
    v.team_id,
    v.best_place,
    ROW_NUMBER() OVER (ORDER BY v.best_place, v.team_id) AS place_rank,
    COUNT(*)  OVER ()                                    AS total_participants
  FROM "v_contest_participants" v
  WHERE v.contest_id = $1
),
cut AS (
  SELECT GREATEST(1, LEAST(15, CEIL(0.05 * COALESCE(MAX(total_participants),0)::numeric)))::int AS k
  FROM ranked
)
SELECT
  u.id   AS user_id,
  u.username,
  t.id   AS team_id,
  t.name AS team_name,
  r.best_place AS place
FROM ranked r
JOIN cut ON TRUE
JOIN teams t ON t.id = r.team_id
JOIN users u ON u.id = t.team_captain
WHERE r.place_rank <= cut.k
ORDER BY r.best_place, t.id;
`

func (c *Client) GetEligibleWeightVoters(ctx context.Context, contestId int) ([]EligibleWeightVoter, error) {
	rows, err := c.C.QueryContext(ctx, SqlGetEligibleWeightVoters, contestId)
	if err != nil {
		return nil, fmt.Errorf("query eligible weight voters: %w", err)
	}
	defer rows.Close()

	voters := []EligibleWeightVoter{}
	for rows.Next() {
		var v EligibleWeightVoter
		if err := rows.Scan(&v.UserID, &v.Username, &v.TeamID, &v.TeamName, &v.Place); err != nil {
			return nil, fmt.Errorf("scan eligible weight voters: %w", err)
		}
		voters = append(voters, v)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate eligible weight voters: %w", err)
	}
	var uniqueVoters []EligibleWeightVoter
	seen := make(map[int]bool)
	for _, v := range voters {
		if !seen[v.UserID] {
			uniqueVoters = append(uniqueVoters, v)
			seen[v.UserID] = true
		}
	}
	return uniqueVoters, nil
}
