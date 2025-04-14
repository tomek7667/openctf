package croner

func (h *Handler) IntervalFunc() error {
	// 1. if today is 1st, check if any of the ctfs that ended in currentmonth1st+lastmonth-lastmonth1st have assigned weight points;
	// 	1b. if they do, return nil; else:
	// 2. gather all ctfs that have ended in currentmonth1st+lastmonth-lastmonth1st; and comply with `docs\RATING_AND_POINTS.md` conditions
	// 3. get avg out all weight ratings for all
	// 4. normalize the difficulties with Math.floor to 0 decimal points wrt. the whole pool 100;
	// TODO: implement
	return nil
}
