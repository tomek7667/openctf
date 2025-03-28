// Code generated by ent, DO NOT EDIT.

package ent

import (
	"openctfbackend/ent/schema"
	"openctfbackend/ent/team"
	"openctfbackend/ent/user"
	"time"
)

// The init function reads all schema descriptors with runtime code
// (default values, validators, hooks and policies) and stitches it
// to their package variables.
func init() {
	teamFields := schema.Team{}.Fields()
	_ = teamFields
	// teamDescName is the schema descriptor for name field.
	teamDescName := teamFields[0].Descriptor()
	// team.NameValidator is a validator for the "name" field. It is called by the builders before save.
	team.NameValidator = teamDescName.Validators[0].(func(string) error)
	// teamDescLogo is the schema descriptor for logo field.
	teamDescLogo := teamFields[4].Descriptor()
	// team.LogoValidator is a validator for the "logo" field. It is called by the builders before save.
	team.LogoValidator = teamDescLogo.Validators[0].(func([]byte) error)
	userFields := schema.User{}.Fields()
	_ = userFields
	// userDescUsername is the schema descriptor for username field.
	userDescUsername := userFields[0].Descriptor()
	// user.UsernameValidator is a validator for the "username" field. It is called by the builders before save.
	user.UsernameValidator = userDescUsername.Validators[0].(func(string) error)
	// userDescEmail is the schema descriptor for email field.
	userDescEmail := userFields[1].Descriptor()
	// user.EmailValidator is a validator for the "email" field. It is called by the builders before save.
	user.EmailValidator = userDescEmail.Validators[0].(func(string) error)
	// userDescCreatedAt is the schema descriptor for created_at field.
	userDescCreatedAt := userFields[7].Descriptor()
	// user.DefaultCreatedAt holds the default value on creation for the created_at field.
	user.DefaultCreatedAt = userDescCreatedAt.Default.(time.Time)
}
