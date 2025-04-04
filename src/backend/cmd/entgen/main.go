package main

import (
	"log/slog"

	"openctfbackend/internal/logger"

	"entgo.io/ent/entc"
	"entgo.io/ent/entc/gen"
)

func init() {
	logger.SetLogLevel()
}

func main() {
	// sql/execquery
	err := entc.Generate("./ent/schema", &gen.Config{
		Features: []gen.Feature{
			gen.FeatureUpsert,
			gen.FeatureExecQuery,
		},
	})
	if err != nil {
		slog.Error(
			"ent generate failed",
			"error", err,
		)
	} else {
		slog.Info("finished successfully")
	}
}
