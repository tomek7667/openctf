// Code generated by ent, DO NOT EDIT.

package migrate

import (
	"entgo.io/ent/dialect/sql/schema"
	"entgo.io/ent/schema/field"
)

var (
	// ContestsColumns holds the columns for the "contests" table.
	ContestsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "name", Type: field.TypeString, Unique: true},
		{Name: "description", Type: field.TypeString, Nullable: true},
		{Name: "rules", Type: field.TypeString, Nullable: true},
		{Name: "prizes", Type: field.TypeString, Nullable: true},
		{Name: "start", Type: field.TypeTime},
		{Name: "end", Type: field.TypeTime},
		{Name: "url", Type: field.TypeString, Nullable: true},
		{Name: "ctftime_id", Type: field.TypeInt, Nullable: true},
		{Name: "assigned_weight_points", Type: field.TypeInt, Default: 0},
		{Name: "contest_organizers", Type: field.TypeInt, Nullable: true},
	}
	// ContestsTable holds the schema information for the "contests" table.
	ContestsTable = &schema.Table{
		Name:       "contests",
		Columns:    ContestsColumns,
		PrimaryKey: []*schema.Column{ContestsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "contests_teams_organizers",
				Columns:    []*schema.Column{ContestsColumns[10]},
				RefColumns: []*schema.Column{TeamsColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
	}
	// ContestRatingsColumns holds the columns for the "contest_ratings" table.
	ContestRatingsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "rating", Type: field.TypeInt},
		{Name: "relevant", Type: field.TypeBool, Default: false},
		{Name: "contest_rating_user", Type: field.TypeInt},
		{Name: "contest_rating_contest", Type: field.TypeInt},
	}
	// ContestRatingsTable holds the schema information for the "contest_ratings" table.
	ContestRatingsTable = &schema.Table{
		Name:       "contest_ratings",
		Columns:    ContestRatingsColumns,
		PrimaryKey: []*schema.Column{ContestRatingsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "contest_ratings_users_user",
				Columns:    []*schema.Column{ContestRatingsColumns[3]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.NoAction,
			},
			{
				Symbol:     "contest_ratings_contests_contest",
				Columns:    []*schema.Column{ContestRatingsColumns[4]},
				RefColumns: []*schema.Column{ContestsColumns[0]},
				OnDelete:   schema.NoAction,
			},
		},
		Indexes: []*schema.Index{
			{
				Name:    "contestrating_contest_rating_user_contest_rating_contest",
				Unique:  true,
				Columns: []*schema.Column{ContestRatingsColumns[3], ContestRatingsColumns[4]},
			},
		},
	}
	// PlacesColumns holds the columns for the "places" table.
	PlacesColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "team_name", Type: field.TypeString},
		{Name: "place", Type: field.TypeInt},
		{Name: "ctftime_team_id", Type: field.TypeInt, Nullable: true},
		{Name: "contest_points", Type: field.TypeFloat64, Nullable: true},
		{Name: "openctf_points", Type: field.TypeFloat64, Nullable: true},
		{Name: "associated_contest_id", Type: field.TypeInt},
		{Name: "assigned_weight_points", Type: field.TypeInt, Default: 0},
		{Name: "contest_places", Type: field.TypeInt, Nullable: true},
		{Name: "place_associated_team", Type: field.TypeInt, Nullable: true},
	}
	// PlacesTable holds the schema information for the "places" table.
	PlacesTable = &schema.Table{
		Name:       "places",
		Columns:    PlacesColumns,
		PrimaryKey: []*schema.Column{PlacesColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "places_contests_places",
				Columns:    []*schema.Column{PlacesColumns[8]},
				RefColumns: []*schema.Column{ContestsColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "places_teams_associated_team",
				Columns:    []*schema.Column{PlacesColumns[9]},
				RefColumns: []*schema.Column{TeamsColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
		Indexes: []*schema.Index{
			{
				Name:    "place_team_name_ctftime_team_id_associated_contest_id",
				Unique:  true,
				Columns: []*schema.Column{PlacesColumns[1], PlacesColumns[3], PlacesColumns[6]},
			},
		},
	}
	// TeamsColumns holds the columns for the "teams" table.
	TeamsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "name", Type: field.TypeString, Unique: true},
		{Name: "description", Type: field.TypeString, Nullable: true},
		{Name: "ctftime_id", Type: field.TypeInt, Nullable: true},
		{Name: "ctftime_verified_at", Type: field.TypeTime, Nullable: true},
		{Name: "logo", Type: field.TypeBytes, Nullable: true, Size: 52428800},
		{Name: "verified_at", Type: field.TypeTime, Nullable: true},
		{Name: "team_captain", Type: field.TypeInt, Nullable: true},
		{Name: "team_verified_by", Type: field.TypeInt, Nullable: true},
	}
	// TeamsTable holds the schema information for the "teams" table.
	TeamsTable = &schema.Table{
		Name:       "teams",
		Columns:    TeamsColumns,
		PrimaryKey: []*schema.Column{TeamsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "teams_users_captain",
				Columns:    []*schema.Column{TeamsColumns[7]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
			{
				Symbol:     "teams_users_verified_by",
				Columns:    []*schema.Column{TeamsColumns[8]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.SetNull,
			},
		},
	}
	// UsersColumns holds the columns for the "users" table.
	UsersColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "username", Type: field.TypeString, Unique: true},
		{Name: "email", Type: field.TypeString, Unique: true},
		{Name: "email_confirmed_at", Type: field.TypeTime, Nullable: true},
		{Name: "confirmation_code", Type: field.TypeString, Nullable: true},
		{Name: "permission_level", Type: field.TypeEnum, Enums: []string{"player", "moderator", "administrator"}, Default: "player"},
		{Name: "description", Type: field.TypeString, Nullable: true},
		{Name: "password", Type: field.TypeString},
		{Name: "created_at", Type: field.TypeTime},
	}
	// UsersTable holds the schema information for the "users" table.
	UsersTable = &schema.Table{
		Name:       "users",
		Columns:    UsersColumns,
		PrimaryKey: []*schema.Column{UsersColumns[0]},
	}
	// TeamMembersColumns holds the columns for the "team_members" table.
	TeamMembersColumns = []*schema.Column{
		{Name: "team_id", Type: field.TypeInt},
		{Name: "user_id", Type: field.TypeInt},
	}
	// TeamMembersTable holds the schema information for the "team_members" table.
	TeamMembersTable = &schema.Table{
		Name:       "team_members",
		Columns:    TeamMembersColumns,
		PrimaryKey: []*schema.Column{TeamMembersColumns[0], TeamMembersColumns[1]},
		ForeignKeys: []*schema.ForeignKey{
			{
				Symbol:     "team_members_team_id",
				Columns:    []*schema.Column{TeamMembersColumns[0]},
				RefColumns: []*schema.Column{TeamsColumns[0]},
				OnDelete:   schema.Cascade,
			},
			{
				Symbol:     "team_members_user_id",
				Columns:    []*schema.Column{TeamMembersColumns[1]},
				RefColumns: []*schema.Column{UsersColumns[0]},
				OnDelete:   schema.Cascade,
			},
		},
	}
	// Tables holds all the tables in the schema.
	Tables = []*schema.Table{
		ContestsTable,
		ContestRatingsTable,
		PlacesTable,
		TeamsTable,
		UsersTable,
		TeamMembersTable,
	}
)

func init() {
	ContestsTable.ForeignKeys[0].RefTable = TeamsTable
	ContestRatingsTable.ForeignKeys[0].RefTable = UsersTable
	ContestRatingsTable.ForeignKeys[1].RefTable = ContestsTable
	PlacesTable.ForeignKeys[0].RefTable = ContestsTable
	PlacesTable.ForeignKeys[1].RefTable = TeamsTable
	TeamsTable.ForeignKeys[0].RefTable = UsersTable
	TeamsTable.ForeignKeys[1].RefTable = UsersTable
	TeamMembersTable.ForeignKeys[0].RefTable = TeamsTable
	TeamMembersTable.ForeignKeys[1].RefTable = UsersTable
}
