package scryfall

import (
	"encoding/json"
	"io"
	"net/http"
)

const DefaultScryfallAPI = "https://api.scryfall.com"

type Client struct {
	HTTPClient  *http.Client
	ScryfallAPI string
	Token       string
}

func NewClient() *Client {
	return &Client{
		HTTPClient:  http.DefaultClient,
		ScryfallAPI: DefaultScryfallAPI,
	}
}

func (c *Client) request(method string, route string, body io.Reader, v interface{}) error {
	req, err := http.NewRequest(method, c.ScryfallAPI+route, body)
	if err != nil {
		return err
	}

	if body != nil {
		req.Header.Add("Content-Type", "application/json")
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}

	if resp.StatusCode != http.StatusOK {
		var sfErr *Error
		err := json.NewDecoder(resp.Body).Decode(&sfErr)
		if err != nil {
			return err
		}

		return sfErr
	}

	err = json.NewDecoder(resp.Body).Decode(v)
	if err != nil {
		return err
	}

	return nil
}
