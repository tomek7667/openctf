// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"openctfbackend/ent/contest"
	"openctfbackend/ent/team"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
)

// Contest is the model entity for the Contest schema.
type Contest struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// Name holds the value of the "name" field.
	Name string `json:"name,omitempty"`
	// Description holds the value of the "description" field.
	Description *string `json:"description,omitempty"`
	// Rules holds the value of the "rules" field.
	Rules *string `json:"rules,omitempty"`
	// Prizes holds the value of the "prizes" field.
	Prizes *string `json:"prizes,omitempty"`
	// Start holds the value of the "start" field.
	Start time.Time `json:"start,omitempty"`
	// End holds the value of the "end" field.
	End time.Time `json:"end,omitempty"`
	// URL holds the value of the "url" field.
	URL *string `json:"url,omitempty"`
	// CtftimeID holds the value of the "ctftime_id" field.
	CtftimeID *int `json:"ctftime_id,omitempty"`
	// AssignedWeightPoints holds the value of the "assigned_weight_points" field.
	AssignedWeightPoints int `json:"assigned_weight_points,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ContestQuery when eager-loading is set.
	Edges              ContestEdges `json:"edges"`
	contest_organizers *int
	selectValues       sql.SelectValues
}

// ContestEdges holds the relations/edges for other nodes in the graph.
type ContestEdges struct {
	// Organizers holds the value of the organizers edge.
	Organizers *Team `json:"organizers,omitempty"`
	// Places holds the value of the places edge.
	Places []*Place `json:"places,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [2]bool
}

// OrganizersOrErr returns the Organizers value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ContestEdges) OrganizersOrErr() (*Team, error) {
	if e.Organizers != nil {
		return e.Organizers, nil
	} else if e.loadedTypes[0] {
		return nil, &NotFoundError{label: team.Label}
	}
	return nil, &NotLoadedError{edge: "organizers"}
}

// PlacesOrErr returns the Places value or an error if the edge
// was not loaded in eager-loading.
func (e ContestEdges) PlacesOrErr() ([]*Place, error) {
	if e.loadedTypes[1] {
		return e.Places, nil
	}
	return nil, &NotLoadedError{edge: "places"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Contest) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case contest.FieldID, contest.FieldCtftimeID, contest.FieldAssignedWeightPoints:
			values[i] = new(sql.NullInt64)
		case contest.FieldName, contest.FieldDescription, contest.FieldRules, contest.FieldPrizes, contest.FieldURL:
			values[i] = new(sql.NullString)
		case contest.FieldStart, contest.FieldEnd:
			values[i] = new(sql.NullTime)
		case contest.ForeignKeys[0]: // contest_organizers
			values[i] = new(sql.NullInt64)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Contest fields.
func (c *Contest) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case contest.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			c.ID = int(value.Int64)
		case contest.FieldName:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field name", values[i])
			} else if value.Valid {
				c.Name = value.String
			}
		case contest.FieldDescription:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field description", values[i])
			} else if value.Valid {
				c.Description = new(string)
				*c.Description = value.String
			}
		case contest.FieldRules:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field rules", values[i])
			} else if value.Valid {
				c.Rules = new(string)
				*c.Rules = value.String
			}
		case contest.FieldPrizes:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field prizes", values[i])
			} else if value.Valid {
				c.Prizes = new(string)
				*c.Prizes = value.String
			}
		case contest.FieldStart:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field start", values[i])
			} else if value.Valid {
				c.Start = value.Time
			}
		case contest.FieldEnd:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field end", values[i])
			} else if value.Valid {
				c.End = value.Time
			}
		case contest.FieldURL:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field url", values[i])
			} else if value.Valid {
				c.URL = new(string)
				*c.URL = value.String
			}
		case contest.FieldCtftimeID:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field ctftime_id", values[i])
			} else if value.Valid {
				c.CtftimeID = new(int)
				*c.CtftimeID = int(value.Int64)
			}
		case contest.FieldAssignedWeightPoints:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for field assigned_weight_points", values[i])
			} else if value.Valid {
				c.AssignedWeightPoints = int(value.Int64)
			}
		case contest.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field contest_organizers", value)
			} else if value.Valid {
				c.contest_organizers = new(int)
				*c.contest_organizers = int(value.Int64)
			}
		default:
			c.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Contest.
// This includes values selected through modifiers, order, etc.
func (c *Contest) Value(name string) (ent.Value, error) {
	return c.selectValues.Get(name)
}

// QueryOrganizers queries the "organizers" edge of the Contest entity.
func (c *Contest) QueryOrganizers() *TeamQuery {
	return NewContestClient(c.config).QueryOrganizers(c)
}

// QueryPlaces queries the "places" edge of the Contest entity.
func (c *Contest) QueryPlaces() *PlaceQuery {
	return NewContestClient(c.config).QueryPlaces(c)
}

// Update returns a builder for updating this Contest.
// Note that you need to call Contest.Unwrap() before calling this method if this Contest
// was returned from a transaction, and the transaction was committed or rolled back.
func (c *Contest) Update() *ContestUpdateOne {
	return NewContestClient(c.config).UpdateOne(c)
}

// Unwrap unwraps the Contest entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (c *Contest) Unwrap() *Contest {
	_tx, ok := c.config.driver.(*txDriver)
	if !ok {
		panic("ent: Contest is not a transactional entity")
	}
	c.config.driver = _tx.drv
	return c
}

// String implements the fmt.Stringer.
func (c *Contest) String() string {
	var builder strings.Builder
	builder.WriteString("Contest(")
	builder.WriteString(fmt.Sprintf("id=%v, ", c.ID))
	builder.WriteString("name=")
	builder.WriteString(c.Name)
	builder.WriteString(", ")
	if v := c.Description; v != nil {
		builder.WriteString("description=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := c.Rules; v != nil {
		builder.WriteString("rules=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := c.Prizes; v != nil {
		builder.WriteString("prizes=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	builder.WriteString("start=")
	builder.WriteString(c.Start.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("end=")
	builder.WriteString(c.End.Format(time.ANSIC))
	builder.WriteString(", ")
	if v := c.URL; v != nil {
		builder.WriteString("url=")
		builder.WriteString(*v)
	}
	builder.WriteString(", ")
	if v := c.CtftimeID; v != nil {
		builder.WriteString("ctftime_id=")
		builder.WriteString(fmt.Sprintf("%v", *v))
	}
	builder.WriteString(", ")
	builder.WriteString("assigned_weight_points=")
	builder.WriteString(fmt.Sprintf("%v", c.AssignedWeightPoints))
	builder.WriteByte(')')
	return builder.String()
}

// Contests is a parsable slice of Contest.
type Contests []*Contest
