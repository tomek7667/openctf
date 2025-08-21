package achievements

import "openctfbackend/ent/achievement"

var CreatedTeamAchievement = AchievementType{
	Name:        "CAPTAIN",
	Description: "Created a team",
	Rarity:      achievement.RarityCommon,
}
