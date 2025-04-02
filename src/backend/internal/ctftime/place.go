package ctftime

type Place struct {
	CtftimeTeamID int    `json:"team_id"`
	Points        string `json:"points"`
	Place         int    `json:"place"`
}
