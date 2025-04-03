package utils

import (
	"log/slog"
	"strconv"
)

// `MustAtoi` does parseInt conversion and panics if failed
func MustAtoi(s string) int {
	i, err := strconv.Atoi(s)
	if err != nil {
		slog.Error("failed atoi", "s to atoi", s)
		panic(err)
	}
	return i
}

func MustParseFloat(s string) float64 {
	f, err := strconv.ParseFloat(s, 64)
	if err != nil {
		slog.Error("failed parse float", "s to parse float", s)
		panic(err)
	}
	return f
}
