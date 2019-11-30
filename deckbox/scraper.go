package deckbox

import (
	"errors"
	"regexp"

	"github.com/gocolly/colly"
)

type Scraper struct {
	collector *colly.Collector
}

func NewScraper() *Scraper {
	return &Scraper{
		collector: colly.NewCollector(),
	}
}

func (s *Scraper) getAuthToken() string {
	for _, cookie := range s.collector.Cookies("https://deckbox.org") {
		if cookie.Name == "auth_token" {
			return cookie.Value
		}
	}

	return ""
}

func (s *Scraper) Login(email string, password string) error {
	if err := s.collector.Post("https://deckbox.org/accounts/login", map[string]string{
		"login":       email,
		"password":    password,
		"remember_me": "on",
	}); err != nil {
		return err
	}

	return nil
}

func (s *Scraper) GetInventorySetNumber() (string, error) {
	if s.getAuthToken() == "" {
		return "", errors.New("must be logged in")
	}

	setNumber := ""

	s.collector.OnHTML("a:contains(Inventory)", func(e *colly.HTMLElement) {
		match := regexp.MustCompile(`/sets/(\d+)`).FindStringSubmatch(e.Attr("href"))

		if len(match) == 2 {
			setNumber = match[1]
		}
	})
	defer s.collector.OnHTMLDetach("a:contains(Inventory)")

	if err := s.collector.Visit("https://deckbox.org"); err != nil {
		return "", err
	}

	if setNumber == "" {
		return "", errors.New("set number not found")
	}

	return setNumber, nil
}
