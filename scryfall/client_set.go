package scryfall

import (
	"fmt"
	"net/http"
)

func (c *Client) GetAllSets() (*SetList, error) {
	var sets *SetList
	err := c.request(http.MethodGet, "/sets", nil, &sets)

	return sets, err
}

func (c *Client) GetSetByCode(setCode string) (*Set, error) {
	var set *Set
	err := c.request(http.MethodGet, fmt.Sprintf("/sets/%s", setCode), nil, &set)

	return set, err
}

func (c *Client) GetSetByID(id string) (*Set, error) {
	var set *Set
	err := c.request(http.MethodGet, fmt.Sprintf("/sets/%s", id), nil, &set)

	return set, err
}

func (c *Client) GetSetByTCGplayerID(id int) (*Set, error) {
	var set *Set
	err := c.request(http.MethodGet, fmt.Sprintf("/sets/tcgplayer/%d", id), nil, &set)

	return set, err
}
