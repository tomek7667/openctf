// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"openctfbackend/ent/place"
	"openctfbackend/ent/team"
	"strings"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
)

// Place is the model entity for the Place schema.
type Place struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// TeamName holds the value of the "team_name" field.
	TeamName string `json:"team_name,omitempty"`
	// Place holds the value of the "place" field.
	Place int `json:"place,omitempty"`
	// CtftimeTeamID holds the value of the "ctftime_team_id" field.
	CtftimeTeamID *int `json:"ctftime_team_id,omitempty"`
	// the actual amount of points obtained by the place holder in the ctf
	ContestPoints *float64 `json:"contest_points,omitempty"`
	// these points are normalized based on contest_points being max multiplied by the ctf weight
	OpenctfPoints *float64 `json:"openctf_points,omitempty"`
	// AssociatedContestID holds the value of the "associated_contest_id" field.
	AssociatedContestID int `json:"associated_contest_id,omitempty"`
	// AssignedWeightPoints holds the value of the "assigned_weight_points" field.
	AssignedWeightPoints int `json:"assigned_weight_points,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the PlaceQuery when eager-loading is set.
	Edges                 PlaceEdges `json:"edges"`
	contest_places        *int
	place_associated_team *int
	selectValues          sql.SelectValues
}

// PlaceEdges holds the relations/edges for other nodes in the graph.
type PlaceEdges struct {
	// AssociatedTeam holds the value of the associated_team edge.
	AssociatedTeam *Team `json:"associated_team,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// AssociatedTeamOrErr returns the AssociatedTeam value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e PlaceEdges) AssociatedTeamOrErr() (*Team, error) {
	if e.AssociatedTeam != nil {
		return e.AssociatedTeam, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: team.Label}
	}
	return nil, &NotLoadedError{edge: "associated_team"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Place) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case place.FieldContestPoints, place.FieldOpenctfPoints:
			values[i] = new(sql.NullFloat64)
		case place.FieldID, place.FieldPlace, place.FieldCtftimeTeamID, place.FieldAssociatedContestID, place.FieldAssignedWeightPoints:
			values[i] = new(sql.NullInt64)
		case place.FieldTeamName:
			values[i] = new(sql.NullString)
		case place.ForeignKeys[0]: // contest_places
			values[i] = new(sql.NullInt64)
		case place.ForeignKeys[1]: // place_associated_team
			values[i] = new(sql.NullInt64)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Place fields.
func (pl *Place) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case place.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			pl.ID = int(value.Int64)
		case place.FieldTeamName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field team_name", values[i])
			} else if value.Valid {
				pl.TeamName = value.String
			}
		case place.FieldPlace:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field place", values[i])
			} else if value.Valid {
				pl.Place = int(value.Int64)
			}
		case place.FieldCtftimeTeamID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field ctftime_team_id", values[i])
			} else if value.Valid {
				pl.CtftimeTeamID = new(int)
				*pl.CtftimeTeamID = int(value.Int64)
			}
		case place.FieldContestPoints:
			if value, ok := values[i].(*sql.NullFloat64); !ok {
				return fmt.Errorf("unexpected type %T for field contest_points", values[i])
			} else if value.Valid {
				pl.ContestPoints = new(float64)
				*pl.ContestPoints = value.Float64
			}
		case place.FieldOpenctfPoints:
			if value, ok := values[i].(*sql.NullFloat64); !ok {
				return fmt.Errorf("unexpected type %T for field openctf_points", values[i])
			} else if value.Valid {
				pl.OpenctfPoints = new(float64)
				*pl.OpenctfPoints = value.Float64
			}
		case place.FieldAssociatedContestID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field associated_contest_id", values[i])
			} else if value.Valid {
				pl.AssociatedContestID = int(value.Int64)
			}
		case place.FieldAssignedWeightPoints:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field assigned_weight_points", values[i])
			} else if value.Valid {
				pl.AssignedWeightPoints = int(value.Int64)
			}
		case place.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field contest_places", value)
			} else if value.Valid {
				pl.contest_places = new(int)
				*pl.contest_places = int(value.Int64)
			}
		case place.ForeignKeys[1]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field place_associated_team", value)
			} else if value.Valid {
				pl.place_associated_team = new(int)
				*pl.place_associated_team = int(value.Int64)
			}
		default:
			pl.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Place.
// This includes values selected through modifiers, order, etc.
func (pl *Place) Value(name string) (ent.Value, error) {
	return pl.selectValues.Get(name)
}

// QueryAssociatedTeam queries the "associated_team" edge of the Place entity.
func (pl *Place) QueryAssociatedTeam() *TeamQuery {
	return NewPlaceClient(pl.config).QueryAssociatedTeam(pl)
}

// Update returns a builder for updating this Place.
// Note that you need to call Place.Unwrap() before calling this method if this Place
// was returned from a transaction, and the transaction was committed or rolled back.
func (pl *Place) Update() *PlaceUpdateOne {
	return NewPlaceClient(pl.config).UpdateOne(pl)
}

// Unwrap unwraps the Place entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (pl *Place) Unwrap() *Place {
	_tx, ok := pl.config.driver.(*txDriver)
	if !ok {
		panic("ent: Place is not a transactional entity")
	}
	pl.config.driver = _tx.drv
	return pl
}

// String implements the fmt.Stringer.
func (pl *Place) String() string {
	var builder strings.Builder
	builder.WriteString("Place(")
	builder.WriteString(fmt.Sprintf("id=%v, ", pl.ID))
	builder.WriteString("team_name=")
	builder.WriteString(pl.TeamName)
	builder.WriteString(", ")
	builder.WriteString("place=")
	builder.WriteString(fmt.Sprintf("%v", pl.Place))
	builder.WriteString(", ")
	if v := pl.CtftimeTeamID; v != nil {
		builder.WriteString("ctftime_team_id=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteString(", ")
	if v := pl.ContestPoints; v != nil {
		builder.WriteString("contest_points=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteString(", ")
	if v := pl.OpenctfPoints; v != nil {
		builder.WriteString("openctf_points=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteString(", ")
	builder.WriteString("associated_contest_id=")
	builder.WriteString(fmt.Sprintf("%v", pl.AssociatedContestID))
	builder.WriteString(", ")
	builder.WriteString("assigned_weight_points=")
	builder.WriteString(fmt.Sprintf("%v", pl.AssignedWeightPoints))
	builder.WriteByte(')')
	return builder.String()
}

// Places is a parsable slice of Place.
type Places []*Place
