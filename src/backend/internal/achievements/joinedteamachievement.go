package achievements

import "openctfbackend/ent/achievement"

var JoinedTeamAchievement = AchievementType{
	Name:        "TEAM PLAYER",
	Description: "Joined a team",
	Rarity:      achievement.RarityCommon,
}
