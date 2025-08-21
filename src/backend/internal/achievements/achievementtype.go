package achievements

import "openctfbackend/ent/achievement"

type AchievementType struct {
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Rarity      achievement.Rarity `json:"rarity"`
}
