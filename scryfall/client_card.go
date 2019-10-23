package scryfall

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"
)

func (c *Client) GetCards(page int) (*CardList, error) {
	var cards *CardList
	err := c.request(http.MethodGet, fmt.Sprintf("/cards?page=%v", page), nil, &cards)

	return cards, err
}

type CardSearchOptions struct {
	Unique              string
	Order               string
	Direction           string
	IncludeMultilingual bool
	IncludeVariations   bool
}

func (c *Client) SearchCards(query string, page int, options CardSearchOptions) (*CardList, error) {
	params := url.Values{}
	params.Set("q", query)
	params.Set("page", strconv.FormatInt(int64(page), 10))

	if options.Unique != "" {
		params.Set("unique", options.Unique)
	}
	if options.Order != "" {
		params.Set("order", options.Order)
	}
	if options.Direction != "" {
		params.Set("dir", options.Direction)
	}
	if options.IncludeMultilingual {
		params.Set("include_multilingual", strconv.FormatBool(options.IncludeMultilingual))
	}
	if options.IncludeVariations {
		params.Set("include_variations", strconv.FormatBool(options.IncludeVariations))
	}

	var cards *CardList
	err := c.request(http.MethodGet, fmt.Sprintf("/cards/search?%s", params.Encode()), nil, &cards)

	return cards, err
}

func (c *Client) GetCardByName(name string, fuzzy bool) (*Card, error) {
	params := url.Values{}
	if fuzzy {
		params.Set("fuzzy", name)
	} else {
		params.Set("exact", name)
	}

	var card *Card
	err := c.request(http.MethodGet, fmt.Sprintf("/cards/named?%s", params.Encode()), nil, &card)

	return card, err
}

func (c *Client) GetCardByNameAndSet(name string, fuzzy bool, set string) (*Card, error) {
	params := url.Values{}
	if fuzzy {
		params.Set("fuzzy", name)
	} else {
		params.Set("exact", name)
	}
	params.Set("set", set)

	var card *Card
	err := c.request(http.MethodGet, fmt.Sprintf("/cards/named?%s", params.Encode()), nil, &card)

	return card, err
}

func (c *Client) AutocompleteCards(query string) (*Catalog, error) {
	var catalog *Catalog
	err := c.request(http.MethodGet, fmt.Sprintf("/cards/autocomplete?q=%s", query), nil, &catalog)

	return catalog, err
}

func (c *Client) GetRandomCard(query string) (*Card, error) {
	path := "/cards/random"
	if query != "" {
		path = fmt.Sprintf("/cards/random?q=%s", query)
	}

	var card *Card
	err := c.request(http.MethodGet, path, nil, &card)

	return card, err
}

func (c *Client) GetCardCollection(identifiers CardIdentifiers) (*CardList, error) {
	b, err := json.Marshal(identifiers)
	if err != nil {
		return nil, err
	}

	var cards *CardList
	err = c.request(http.MethodPost, "/cards/collection", bytes.NewReader(b), &cards)

	return cards, err
}

func (c *Client) GetCardByCollectorNumber(setCode string, collectorNumber string) (*Card, error) {
	var card *Card
	err := c.request(http.MethodGet, fmt.Sprintf("/cards/%s/%s", setCode, collectorNumber), nil, &card)

	return card, err
}
