// Code generated by ent, DO NOT EDIT.

package place

import (
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

const (
	// Label holds the string label denoting the place type in the database.
	Label = "place"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldTeamName holds the string denoting the team_name field in the database.
	FieldTeamName = "team_name"
	// FieldPlace holds the string denoting the place field in the database.
	FieldPlace = "place"
	// FieldCtftimeTeamID holds the string denoting the ctftime_team_id field in the database.
	FieldCtftimeTeamID = "ctftime_team_id"
	// FieldContestPoints holds the string denoting the contest_points field in the database.
	FieldContestPoints = "contest_points"
	// FieldOpenctfPoints holds the string denoting the openctf_points field in the database.
	FieldOpenctfPoints = "openctf_points"
	// FieldAssociatedContestID holds the string denoting the associated_contest_id field in the database.
	FieldAssociatedContestID = "associated_contest_id"
	// FieldAssignedWeightPoints holds the string denoting the assigned_weight_points field in the database.
	FieldAssignedWeightPoints = "assigned_weight_points"
	// EdgeAssociatedTeam holds the string denoting the associated_team edge name in mutations.
	EdgeAssociatedTeam = "associated_team"
	// Table holds the table name of the place in the database.
	Table = "places"
	// AssociatedTeamTable is the table that holds the associated_team relation/edge.
	AssociatedTeamTable = "places"
	// AssociatedTeamInverseTable is the table name for the Team entity.
	// It exists in this package in order to avoid circular dependency with the "team" package.
	AssociatedTeamInverseTable = "teams"
	// AssociatedTeamColumn is the table column denoting the associated_team relation/edge.
	AssociatedTeamColumn = "place_associated_team"
)

// Columns holds all SQL columns for place fields.
var Columns = []string{
	FieldID,
	FieldTeamName,
	FieldPlace,
	FieldCtftimeTeamID,
	FieldContestPoints,
	FieldOpenctfPoints,
	FieldAssociatedContestID,
	FieldAssignedWeightPoints,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "places"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"contest_places",
	"place_associated_team",
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// TeamNameValidator is a validator for the "team_name" field. It is called by the builders before save.
	TeamNameValidator func(string) error
	// PlaceValidator is a validator for the "place" field. It is called by the builders before save.
	PlaceValidator func(int) error
	// ContestPointsValidator is a validator for the "contest_points" field. It is called by the builders before save.
	ContestPointsValidator func(float64) error
	// OpenctfPointsValidator is a validator for the "openctf_points" field. It is called by the builders before save.
	OpenctfPointsValidator func(float64) error
	// DefaultAssignedWeightPoints holds the default value on creation for the "assigned_weight_points" field.
	DefaultAssignedWeightPoints int
)

// OrderOption defines the ordering options for the Place queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByTeamName orders the results by the team_name field.
func ByTeamName(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldTeamName, opts...).ToFunc()
}

// ByPlace orders the results by the place field.
func ByPlace(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldPlace, opts...).ToFunc()
}

// ByCtftimeTeamID orders the results by the ctftime_team_id field.
func ByCtftimeTeamID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCtftimeTeamID, opts...).ToFunc()
}

// ByContestPoints orders the results by the contest_points field.
func ByContestPoints(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldContestPoints, opts...).ToFunc()
}

// ByOpenctfPoints orders the results by the openctf_points field.
func ByOpenctfPoints(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldOpenctfPoints, opts...).ToFunc()
}

// ByAssociatedContestID orders the results by the associated_contest_id field.
func ByAssociatedContestID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldAssociatedContestID, opts...).ToFunc()
}

// ByAssignedWeightPoints orders the results by the assigned_weight_points field.
func ByAssignedWeightPoints(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldAssignedWeightPoints, opts...).ToFunc()
}

// ByAssociatedTeamField orders the results by associated_team field.
func ByAssociatedTeamField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newAssociatedTeamStep(), sql.OrderByField(field, opts...))
	}
}
func newAssociatedTeamStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(AssociatedTeamInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, false, AssociatedTeamTable, AssociatedTeamColumn),
	)
}
