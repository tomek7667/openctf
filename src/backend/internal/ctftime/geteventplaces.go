package ctftime

import (
	"errors"
	"fmt"
	"strconv"
	"strings"

	"github.com/gocolly/colly"
)

type RawPlace struct {
	RawPlace           string `selector:"td.place"`
	RawCtftimeTeamID   string `selector:"td a[href]" attr:"href"`
	RawCtftimeTeamName string `selector:"td a"`
	RawCtfPoints       string `selector:"td.points"`
}

type Place struct {
	Place           int     `json:"place"`
	CtftimeTeamID   int     `json:"ctftimeTeamId"`
	CtftimeTeamName string  `json:"ctftimeTeamName"`
	CtfPoints       float64 `json:"ctfPoints"`
}

func (cl *Client) GetEventPlaces(ID int) ([]*Place, error) {
	var errs error
	var places []*Place
	c := colly.NewCollector()
	c.OnHTML(".table-striped tbody tr", func(e *colly.HTMLElement) {
		rp := &RawPlace{}
		err := e.Unmarshal(rp)
		if err != nil {
			errs = errors.Join(
				fmt.Errorf("unmarshalling raw place failed"),
				err,
				errs,
			)
			return
		}
		if rp.RawPlace == "" ||
			rp.RawCtftimeTeamID == "" ||
			rp.RawCtftimeTeamName == "" ||
			rp.RawCtfPoints == "" {
			return
		}
		// parsing the args
		place, err := strconv.Atoi(rp.RawPlace)
		if err != nil {
			errs = errors.Join(
				fmt.Errorf("strconv.Atoi failed: %s", rp.RawPlace),
				err,
				errs,
			)
			return
		}
		splitted := strings.Split(rp.RawCtftimeTeamID, "/")
		if len(splitted) != 3 {
			errs = errors.Join(
				fmt.Errorf("splitted rawctftime team id invalid: %s", rp.RawCtftimeTeamID),
				errs,
			)
			return
		}
		ctftimeTeamIDs := splitted[2]
		ctftimeTeamID, err := strconv.Atoi(ctftimeTeamIDs)
		if err != nil {
			errs = errors.Join(
				fmt.Errorf("strconv.Atoi failed: %s", ctftimeTeamIDs),
				err,
				errs,
			)
			return
		}
		ctfPoints, err := strconv.ParseFloat(rp.RawCtfPoints, 64)
		if err != nil {
			errs = errors.Join(
				fmt.Errorf("strconv.ParseFloat failed: %s", rp.RawCtfPoints),
				err,
				errs,
			)
			return
		}

		// extending the arr
		places = append(places, &Place{
			Place:           place,
			CtftimeTeamID:   ctftimeTeamID,
			CtftimeTeamName: rp.RawCtftimeTeamName,
			CtfPoints:       ctfPoints,
		})
	})

	url := fmt.Sprintf("https://ctftime.org/event/%d", ID)
	err := c.Visit(url)
	if err != nil {
		errs = errors.Join(
			fmt.Errorf("visiting ctftime event failed"),
			err,
			errs,
		)
		return nil, errs
	}
	return places, nil
}
