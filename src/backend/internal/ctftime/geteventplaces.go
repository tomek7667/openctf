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

func decryptCFEmail(obfuscatedEmail string) string {
	if len(obfuscatedEmail) < 2 {
		return ""
	}
	xorKey, err := strconv.ParseInt(obfuscatedEmail[:2], 16, 64)
	if err != nil {
		return ""
	}
	var output strings.Builder
	for i := 2; i < len(obfuscatedEmail); i += 2 {
		if i+1 >= len(obfuscatedEmail) {
			break
		}
		charCode, err := strconv.ParseInt(obfuscatedEmail[i:i+2], 16, 64)
		if err != nil {
			return ""
		}
		output.WriteByte(byte(charCode ^ xorKey))
	}
	return output.String()
}

func (cl *Client) GetEventPlaces(ID int) ([]*Place, error) {
	var errs error
	var places []*Place
	c := colly.NewCollector()

	c.OnHTML(".__cf_email__", func(e *colly.HTMLElement) {
		// some team names are in form of e-mail and cloudflare is replacing them with `[email protected]` which is
		// all cool, however it kind of kills the uniqueness of the names when 2 different email teams are found as
		// the name is detected to be [email protected] for both of them unfortunately, so we need to bypass CF's protection.
		if obfuscatedEmail := e.Attr("data-cfemail"); obfuscatedEmail != "" {
			if decodedEmail := decryptCFEmail(obfuscatedEmail); decodedEmail != "" {
				e.DOM.SetText(decodedEmail)
				if href := e.Attr("href"); href != "" {
					e.DOM.SetAttr("href", "mailto:"+decodedEmail)
				}
			}
		}
	})

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
