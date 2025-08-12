package schema

import "entgo.io/ent"

func TrimOmitEmptyTag(fields []ent.Field) []ent.Field {
	for _, f := range fields {
		if f.Descriptor().Tag == "" {
			f.Descriptor().Tag = `json:"` + f.Descriptor().Name + `"`
		}
	}
	return fields
}
