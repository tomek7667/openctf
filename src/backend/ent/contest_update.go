// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"openctfbackend/ent/contest"
	"openctfbackend/ent/place"
	"openctfbackend/ent/predicate"
	"openctfbackend/ent/team"
	"time"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
)

// ContestUpdate is the builder for updating Contest entities.
type ContestUpdate struct {
	config
	hooks    []Hook
	mutation *ContestMutation
}

// Where appends a list predicates to the ContestUpdate builder.
func (cu *ContestUpdate) Where(ps ...predicate.Contest) *ContestUpdate {
	cu.mutation.Where(ps...)
	return cu
}

// SetName sets the "name" field.
func (cu *ContestUpdate) SetName(s string) *ContestUpdate {
	cu.mutation.SetName(s)
	return cu
}

// SetNillableName sets the "name" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableName(s *string) *ContestUpdate {
	if s != nil {
		cu.SetName(*s)
	}
	return cu
}

// SetDescription sets the "description" field.
func (cu *ContestUpdate) SetDescription(s string) *ContestUpdate {
	cu.mutation.SetDescription(s)
	return cu
}

// SetNillableDescription sets the "description" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableDescription(s *string) *ContestUpdate {
	if s != nil {
		cu.SetDescription(*s)
	}
	return cu
}

// ClearDescription clears the value of the "description" field.
func (cu *ContestUpdate) ClearDescription() *ContestUpdate {
	cu.mutation.ClearDescription()
	return cu
}

// SetRules sets the "rules" field.
func (cu *ContestUpdate) SetRules(s string) *ContestUpdate {
	cu.mutation.SetRules(s)
	return cu
}

// SetNillableRules sets the "rules" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableRules(s *string) *ContestUpdate {
	if s != nil {
		cu.SetRules(*s)
	}
	return cu
}

// ClearRules clears the value of the "rules" field.
func (cu *ContestUpdate) ClearRules() *ContestUpdate {
	cu.mutation.ClearRules()
	return cu
}

// SetPrizes sets the "prizes" field.
func (cu *ContestUpdate) SetPrizes(s string) *ContestUpdate {
	cu.mutation.SetPrizes(s)
	return cu
}

// SetNillablePrizes sets the "prizes" field if the given value is not nil.
func (cu *ContestUpdate) SetNillablePrizes(s *string) *ContestUpdate {
	if s != nil {
		cu.SetPrizes(*s)
	}
	return cu
}

// ClearPrizes clears the value of the "prizes" field.
func (cu *ContestUpdate) ClearPrizes() *ContestUpdate {
	cu.mutation.ClearPrizes()
	return cu
}

// SetStart sets the "start" field.
func (cu *ContestUpdate) SetStart(t time.Time) *ContestUpdate {
	cu.mutation.SetStart(t)
	return cu
}

// SetNillableStart sets the "start" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableStart(t *time.Time) *ContestUpdate {
	if t != nil {
		cu.SetStart(*t)
	}
	return cu
}

// SetEnd sets the "end" field.
func (cu *ContestUpdate) SetEnd(t time.Time) *ContestUpdate {
	cu.mutation.SetEnd(t)
	return cu
}

// SetNillableEnd sets the "end" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableEnd(t *time.Time) *ContestUpdate {
	if t != nil {
		cu.SetEnd(*t)
	}
	return cu
}

// SetURL sets the "url" field.
func (cu *ContestUpdate) SetURL(s string) *ContestUpdate {
	cu.mutation.SetURL(s)
	return cu
}

// SetNillableURL sets the "url" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableURL(s *string) *ContestUpdate {
	if s != nil {
		cu.SetURL(*s)
	}
	return cu
}

// ClearURL clears the value of the "url" field.
func (cu *ContestUpdate) ClearURL() *ContestUpdate {
	cu.mutation.ClearURL()
	return cu
}

// SetCtftimeID sets the "ctftime_id" field.
func (cu *ContestUpdate) SetCtftimeID(i int) *ContestUpdate {
	cu.mutation.ResetCtftimeID()
	cu.mutation.SetCtftimeID(i)
	return cu
}

// SetNillableCtftimeID sets the "ctftime_id" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableCtftimeID(i *int) *ContestUpdate {
	if i != nil {
		cu.SetCtftimeID(*i)
	}
	return cu
}

// AddCtftimeID adds i to the "ctftime_id" field.
func (cu *ContestUpdate) AddCtftimeID(i int) *ContestUpdate {
	cu.mutation.AddCtftimeID(i)
	return cu
}

// ClearCtftimeID clears the value of the "ctftime_id" field.
func (cu *ContestUpdate) ClearCtftimeID() *ContestUpdate {
	cu.mutation.ClearCtftimeID()
	return cu
}

// SetAssignedWeightPoints sets the "assigned_weight_points" field.
func (cu *ContestUpdate) SetAssignedWeightPoints(i int) *ContestUpdate {
	cu.mutation.ResetAssignedWeightPoints()
	cu.mutation.SetAssignedWeightPoints(i)
	return cu
}

// SetNillableAssignedWeightPoints sets the "assigned_weight_points" field if the given value is not nil.
func (cu *ContestUpdate) SetNillableAssignedWeightPoints(i *int) *ContestUpdate {
	if i != nil {
		cu.SetAssignedWeightPoints(*i)
	}
	return cu
}

// AddAssignedWeightPoints adds i to the "assigned_weight_points" field.
func (cu *ContestUpdate) AddAssignedWeightPoints(i int) *ContestUpdate {
	cu.mutation.AddAssignedWeightPoints(i)
	return cu
}

// SetOrganizersID sets the "organizers" edge to the Team entity by ID.
func (cu *ContestUpdate) SetOrganizersID(id int) *ContestUpdate {
	cu.mutation.SetOrganizersID(id)
	return cu
}

// SetNillableOrganizersID sets the "organizers" edge to the Team entity by ID if the given value is not nil.
func (cu *ContestUpdate) SetNillableOrganizersID(id *int) *ContestUpdate {
	if id != nil {
		cu = cu.SetOrganizersID(*id)
	}
	return cu
}

// SetOrganizers sets the "organizers" edge to the Team entity.
func (cu *ContestUpdate) SetOrganizers(t *Team) *ContestUpdate {
	return cu.SetOrganizersID(t.ID)
}

// AddPlaceIDs adds the "places" edge to the Place entity by IDs.
func (cu *ContestUpdate) AddPlaceIDs(ids ...int) *ContestUpdate {
	cu.mutation.AddPlaceIDs(ids...)
	return cu
}

// AddPlaces adds the "places" edges to the Place entity.
func (cu *ContestUpdate) AddPlaces(p ...*Place) *ContestUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return cu.AddPlaceIDs(ids...)
}

// Mutation returns the ContestMutation object of the builder.
func (cu *ContestUpdate) Mutation() *ContestMutation {
	return cu.mutation
}

// ClearOrganizers clears the "organizers" edge to the Team entity.
func (cu *ContestUpdate) ClearOrganizers() *ContestUpdate {
	cu.mutation.ClearOrganizers()
	return cu
}

// ClearPlaces clears all "places" edges to the Place entity.
func (cu *ContestUpdate) ClearPlaces() *ContestUpdate {
	cu.mutation.ClearPlaces()
	return cu
}

// RemovePlaceIDs removes the "places" edge to Place entities by IDs.
func (cu *ContestUpdate) RemovePlaceIDs(ids ...int) *ContestUpdate {
	cu.mutation.RemovePlaceIDs(ids...)
	return cu
}

// RemovePlaces removes "places" edges to Place entities.
func (cu *ContestUpdate) RemovePlaces(p ...*Place) *ContestUpdate {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return cu.RemovePlaceIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (cu *ContestUpdate) Save(ctx context.Context) (int, error) {
	return withHooks(ctx, cu.sqlSave, cu.mutation, cu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cu *ContestUpdate) SaveX(ctx context.Context) int {
	affected, err := cu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (cu *ContestUpdate) Exec(ctx context.Context) error {
	_, err := cu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cu *ContestUpdate) ExecX(ctx context.Context) {
	if err := cu.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (cu *ContestUpdate) check() error {
	if v, ok := cu.mutation.Name(); ok {
		if err := contest.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf(`ent: validator failed for field "Contest.name": %w`, err)}
		}
	}
	if v, ok := cu.mutation.URL(); ok {
		if err := contest.URLValidator(v); err != nil {
			return &ValidationError{Name: "url", err: fmt.Errorf(`ent: validator failed for field "Contest.url": %w`, err)}
		}
	}
	return nil
}

func (cu *ContestUpdate) sqlSave(ctx context.Context) (n int, err error) {
	if err := cu.check(); err != nil {
		return n, err
	}
	_spec := sqlgraph.NewUpdateSpec(contest.Table, contest.Columns, sqlgraph.NewFieldSpec(contest.FieldID, field.TypeInt))
	if ps := cu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cu.mutation.Name(); ok {
		_spec.SetField(contest.FieldName, field.TypeString, value)
	}
	if value, ok := cu.mutation.Description(); ok {
		_spec.SetField(contest.FieldDescription, field.TypeString, value)
	}
	if cu.mutation.DescriptionCleared() {
		_spec.ClearField(contest.FieldDescription, field.TypeString)
	}
	if value, ok := cu.mutation.Rules(); ok {
		_spec.SetField(contest.FieldRules, field.TypeString, value)
	}
	if cu.mutation.RulesCleared() {
		_spec.ClearField(contest.FieldRules, field.TypeString)
	}
	if value, ok := cu.mutation.Prizes(); ok {
		_spec.SetField(contest.FieldPrizes, field.TypeString, value)
	}
	if cu.mutation.PrizesCleared() {
		_spec.ClearField(contest.FieldPrizes, field.TypeString)
	}
	if value, ok := cu.mutation.Start(); ok {
		_spec.SetField(contest.FieldStart, field.TypeTime, value)
	}
	if value, ok := cu.mutation.End(); ok {
		_spec.SetField(contest.FieldEnd, field.TypeTime, value)
	}
	if value, ok := cu.mutation.URL(); ok {
		_spec.SetField(contest.FieldURL, field.TypeString, value)
	}
	if cu.mutation.URLCleared() {
		_spec.ClearField(contest.FieldURL, field.TypeString)
	}
	if value, ok := cu.mutation.CtftimeID(); ok {
		_spec.SetField(contest.FieldCtftimeID, field.TypeInt, value)
	}
	if value, ok := cu.mutation.AddedCtftimeID(); ok {
		_spec.AddField(contest.FieldCtftimeID, field.TypeInt, value)
	}
	if cu.mutation.CtftimeIDCleared() {
		_spec.ClearField(contest.FieldCtftimeID, field.TypeInt)
	}
	if value, ok := cu.mutation.AssignedWeightPoints(); ok {
		_spec.SetField(contest.FieldAssignedWeightPoints, field.TypeInt, value)
	}
	if value, ok := cu.mutation.AddedAssignedWeightPoints(); ok {
		_spec.AddField(contest.FieldAssignedWeightPoints, field.TypeInt, value)
	}
	if cu.mutation.OrganizersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   contest.OrganizersTable,
			Columns: []string{contest.OrganizersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(team.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.OrganizersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   contest.OrganizersTable,
			Columns: []string{contest.OrganizersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(team.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.PlacesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedPlacesIDs(); len(nodes) > 0 && !cu.mutation.PlacesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.PlacesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, cu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{contest.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	cu.mutation.done = true
	return n, nil
}

// ContestUpdateOne is the builder for updating a single Contest entity.
type ContestUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *ContestMutation
}

// SetName sets the "name" field.
func (cuo *ContestUpdateOne) SetName(s string) *ContestUpdateOne {
	cuo.mutation.SetName(s)
	return cuo
}

// SetNillableName sets the "name" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableName(s *string) *ContestUpdateOne {
	if s != nil {
		cuo.SetName(*s)
	}
	return cuo
}

// SetDescription sets the "description" field.
func (cuo *ContestUpdateOne) SetDescription(s string) *ContestUpdateOne {
	cuo.mutation.SetDescription(s)
	return cuo
}

// SetNillableDescription sets the "description" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableDescription(s *string) *ContestUpdateOne {
	if s != nil {
		cuo.SetDescription(*s)
	}
	return cuo
}

// ClearDescription clears the value of the "description" field.
func (cuo *ContestUpdateOne) ClearDescription() *ContestUpdateOne {
	cuo.mutation.ClearDescription()
	return cuo
}

// SetRules sets the "rules" field.
func (cuo *ContestUpdateOne) SetRules(s string) *ContestUpdateOne {
	cuo.mutation.SetRules(s)
	return cuo
}

// SetNillableRules sets the "rules" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableRules(s *string) *ContestUpdateOne {
	if s != nil {
		cuo.SetRules(*s)
	}
	return cuo
}

// ClearRules clears the value of the "rules" field.
func (cuo *ContestUpdateOne) ClearRules() *ContestUpdateOne {
	cuo.mutation.ClearRules()
	return cuo
}

// SetPrizes sets the "prizes" field.
func (cuo *ContestUpdateOne) SetPrizes(s string) *ContestUpdateOne {
	cuo.mutation.SetPrizes(s)
	return cuo
}

// SetNillablePrizes sets the "prizes" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillablePrizes(s *string) *ContestUpdateOne {
	if s != nil {
		cuo.SetPrizes(*s)
	}
	return cuo
}

// ClearPrizes clears the value of the "prizes" field.
func (cuo *ContestUpdateOne) ClearPrizes() *ContestUpdateOne {
	cuo.mutation.ClearPrizes()
	return cuo
}

// SetStart sets the "start" field.
func (cuo *ContestUpdateOne) SetStart(t time.Time) *ContestUpdateOne {
	cuo.mutation.SetStart(t)
	return cuo
}

// SetNillableStart sets the "start" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableStart(t *time.Time) *ContestUpdateOne {
	if t != nil {
		cuo.SetStart(*t)
	}
	return cuo
}

// SetEnd sets the "end" field.
func (cuo *ContestUpdateOne) SetEnd(t time.Time) *ContestUpdateOne {
	cuo.mutation.SetEnd(t)
	return cuo
}

// SetNillableEnd sets the "end" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableEnd(t *time.Time) *ContestUpdateOne {
	if t != nil {
		cuo.SetEnd(*t)
	}
	return cuo
}

// SetURL sets the "url" field.
func (cuo *ContestUpdateOne) SetURL(s string) *ContestUpdateOne {
	cuo.mutation.SetURL(s)
	return cuo
}

// SetNillableURL sets the "url" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableURL(s *string) *ContestUpdateOne {
	if s != nil {
		cuo.SetURL(*s)
	}
	return cuo
}

// ClearURL clears the value of the "url" field.
func (cuo *ContestUpdateOne) ClearURL() *ContestUpdateOne {
	cuo.mutation.ClearURL()
	return cuo
}

// SetCtftimeID sets the "ctftime_id" field.
func (cuo *ContestUpdateOne) SetCtftimeID(i int) *ContestUpdateOne {
	cuo.mutation.ResetCtftimeID()
	cuo.mutation.SetCtftimeID(i)
	return cuo
}

// SetNillableCtftimeID sets the "ctftime_id" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableCtftimeID(i *int) *ContestUpdateOne {
	if i != nil {
		cuo.SetCtftimeID(*i)
	}
	return cuo
}

// AddCtftimeID adds i to the "ctftime_id" field.
func (cuo *ContestUpdateOne) AddCtftimeID(i int) *ContestUpdateOne {
	cuo.mutation.AddCtftimeID(i)
	return cuo
}

// ClearCtftimeID clears the value of the "ctftime_id" field.
func (cuo *ContestUpdateOne) ClearCtftimeID() *ContestUpdateOne {
	cuo.mutation.ClearCtftimeID()
	return cuo
}

// SetAssignedWeightPoints sets the "assigned_weight_points" field.
func (cuo *ContestUpdateOne) SetAssignedWeightPoints(i int) *ContestUpdateOne {
	cuo.mutation.ResetAssignedWeightPoints()
	cuo.mutation.SetAssignedWeightPoints(i)
	return cuo
}

// SetNillableAssignedWeightPoints sets the "assigned_weight_points" field if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableAssignedWeightPoints(i *int) *ContestUpdateOne {
	if i != nil {
		cuo.SetAssignedWeightPoints(*i)
	}
	return cuo
}

// AddAssignedWeightPoints adds i to the "assigned_weight_points" field.
func (cuo *ContestUpdateOne) AddAssignedWeightPoints(i int) *ContestUpdateOne {
	cuo.mutation.AddAssignedWeightPoints(i)
	return cuo
}

// SetOrganizersID sets the "organizers" edge to the Team entity by ID.
func (cuo *ContestUpdateOne) SetOrganizersID(id int) *ContestUpdateOne {
	cuo.mutation.SetOrganizersID(id)
	return cuo
}

// SetNillableOrganizersID sets the "organizers" edge to the Team entity by ID if the given value is not nil.
func (cuo *ContestUpdateOne) SetNillableOrganizersID(id *int) *ContestUpdateOne {
	if id != nil {
		cuo = cuo.SetOrganizersID(*id)
	}
	return cuo
}

// SetOrganizers sets the "organizers" edge to the Team entity.
func (cuo *ContestUpdateOne) SetOrganizers(t *Team) *ContestUpdateOne {
	return cuo.SetOrganizersID(t.ID)
}

// AddPlaceIDs adds the "places" edge to the Place entity by IDs.
func (cuo *ContestUpdateOne) AddPlaceIDs(ids ...int) *ContestUpdateOne {
	cuo.mutation.AddPlaceIDs(ids...)
	return cuo
}

// AddPlaces adds the "places" edges to the Place entity.
func (cuo *ContestUpdateOne) AddPlaces(p ...*Place) *ContestUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return cuo.AddPlaceIDs(ids...)
}

// Mutation returns the ContestMutation object of the builder.
func (cuo *ContestUpdateOne) Mutation() *ContestMutation {
	return cuo.mutation
}

// ClearOrganizers clears the "organizers" edge to the Team entity.
func (cuo *ContestUpdateOne) ClearOrganizers() *ContestUpdateOne {
	cuo.mutation.ClearOrganizers()
	return cuo
}

// ClearPlaces clears all "places" edges to the Place entity.
func (cuo *ContestUpdateOne) ClearPlaces() *ContestUpdateOne {
	cuo.mutation.ClearPlaces()
	return cuo
}

// RemovePlaceIDs removes the "places" edge to Place entities by IDs.
func (cuo *ContestUpdateOne) RemovePlaceIDs(ids ...int) *ContestUpdateOne {
	cuo.mutation.RemovePlaceIDs(ids...)
	return cuo
}

// RemovePlaces removes "places" edges to Place entities.
func (cuo *ContestUpdateOne) RemovePlaces(p ...*Place) *ContestUpdateOne {
	ids := make([]int, len(p))
	for i := range p {
		ids[i] = p[i].ID
	}
	return cuo.RemovePlaceIDs(ids...)
}

// Where appends a list predicates to the ContestUpdate builder.
func (cuo *ContestUpdateOne) Where(ps ...predicate.Contest) *ContestUpdateOne {
	cuo.mutation.Where(ps...)
	return cuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (cuo *ContestUpdateOne) Select(field string, fields ...string) *ContestUpdateOne {
	cuo.fields = append([]string{field}, fields...)
	return cuo
}

// Save executes the query and returns the updated Contest entity.
func (cuo *ContestUpdateOne) Save(ctx context.Context) (*Contest, error) {
	return withHooks(ctx, cuo.sqlSave, cuo.mutation, cuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cuo *ContestUpdateOne) SaveX(ctx context.Context) *Contest {
	node, err := cuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (cuo *ContestUpdateOne) Exec(ctx context.Context) error {
	_, err := cuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cuo *ContestUpdateOne) ExecX(ctx context.Context) {
	if err := cuo.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (cuo *ContestUpdateOne) check() error {
	if v, ok := cuo.mutation.Name(); ok {
		if err := contest.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf(`ent: validator failed for field "Contest.name": %w`, err)}
		}
	}
	if v, ok := cuo.mutation.URL(); ok {
		if err := contest.URLValidator(v); err != nil {
			return &ValidationError{Name: "url", err: fmt.Errorf(`ent: validator failed for field "Contest.url": %w`, err)}
		}
	}
	return nil
}

func (cuo *ContestUpdateOne) sqlSave(ctx context.Context) (_node *Contest, err error) {
	if err := cuo.check(); err != nil {
		return _node, err
	}
	_spec := sqlgraph.NewUpdateSpec(contest.Table, contest.Columns, sqlgraph.NewFieldSpec(contest.FieldID, field.TypeInt))
	id, ok := cuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "Contest.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := cuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, contest.FieldID)
		for _, f := range fields {
			if !contest.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != contest.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := cuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cuo.mutation.Name(); ok {
		_spec.SetField(contest.FieldName, field.TypeString, value)
	}
	if value, ok := cuo.mutation.Description(); ok {
		_spec.SetField(contest.FieldDescription, field.TypeString, value)
	}
	if cuo.mutation.DescriptionCleared() {
		_spec.ClearField(contest.FieldDescription, field.TypeString)
	}
	if value, ok := cuo.mutation.Rules(); ok {
		_spec.SetField(contest.FieldRules, field.TypeString, value)
	}
	if cuo.mutation.RulesCleared() {
		_spec.ClearField(contest.FieldRules, field.TypeString)
	}
	if value, ok := cuo.mutation.Prizes(); ok {
		_spec.SetField(contest.FieldPrizes, field.TypeString, value)
	}
	if cuo.mutation.PrizesCleared() {
		_spec.ClearField(contest.FieldPrizes, field.TypeString)
	}
	if value, ok := cuo.mutation.Start(); ok {
		_spec.SetField(contest.FieldStart, field.TypeTime, value)
	}
	if value, ok := cuo.mutation.End(); ok {
		_spec.SetField(contest.FieldEnd, field.TypeTime, value)
	}
	if value, ok := cuo.mutation.URL(); ok {
		_spec.SetField(contest.FieldURL, field.TypeString, value)
	}
	if cuo.mutation.URLCleared() {
		_spec.ClearField(contest.FieldURL, field.TypeString)
	}
	if value, ok := cuo.mutation.CtftimeID(); ok {
		_spec.SetField(contest.FieldCtftimeID, field.TypeInt, value)
	}
	if value, ok := cuo.mutation.AddedCtftimeID(); ok {
		_spec.AddField(contest.FieldCtftimeID, field.TypeInt, value)
	}
	if cuo.mutation.CtftimeIDCleared() {
		_spec.ClearField(contest.FieldCtftimeID, field.TypeInt)
	}
	if value, ok := cuo.mutation.AssignedWeightPoints(); ok {
		_spec.SetField(contest.FieldAssignedWeightPoints, field.TypeInt, value)
	}
	if value, ok := cuo.mutation.AddedAssignedWeightPoints(); ok {
		_spec.AddField(contest.FieldAssignedWeightPoints, field.TypeInt, value)
	}
	if cuo.mutation.OrganizersCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   contest.OrganizersTable,
			Columns: []string{contest.OrganizersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(team.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.OrganizersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: false,
			Table:   contest.OrganizersTable,
			Columns: []string{contest.OrganizersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(team.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.PlacesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedPlacesIDs(); len(nodes) > 0 && !cuo.mutation.PlacesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.PlacesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   contest.PlacesTable,
			Columns: []string{contest.PlacesColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(place.FieldID, field.TypeInt),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &Contest{config: cuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, cuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{contest.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	cuo.mutation.done = true
	return _node, nil
}
