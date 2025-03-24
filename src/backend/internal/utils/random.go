package utils

import (
	"math/rand"
	"time"
)

// `RandInt`
//
//	returns a random integer between min and max, inclusive.
func RandInt(min, max int) int {
	if min > max {
		min, max = max, min
	}
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return r.Intn(max-min+1) + min
}
