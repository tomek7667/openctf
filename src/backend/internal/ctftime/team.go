package ctftime

type Team struct {
	Academic     bool   `json:"academic"`
	University   string `json:"university"`
	PrimaryAlias string `json:"primary_alias"`
	Name         string `json:"name"`
	Rating       map[string]struct {
		OrganizerPoints float64 `json:"organizer_points"`
		RatingPoints    float64 `json:"rating_points"`
		RatingPlace     int     `json:"rating_place"`
	} `json:"rating"`
	Logo    string   `json:"logo"`
	Country string   `json:"country"`
	ID      int      `json:"id"`
	Aliases []string `json:"aliases"`
}
