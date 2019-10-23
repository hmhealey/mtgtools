package scryfall

const ListObject = "list"

type CardList struct {
	Data        []Card           `json:"data"`
	HasMore     bool             `json:"has_more"`
	NextPageURI string           `json:"next_page,omitempty"`
	NotFound    []CardIdentifier `json:"not_found,omitempty"`
	Object      string           `json:"object"`
	TotalCards  int              `json:"total_cards"`
	Warnings    []string         `json:"warnings,omitempty"`
}

type SetList struct {
	Data        []Set    `json:"data"`
	HasMore     bool     `json:"has_more"`
	NextPageURI string   `json:"next_page,omitempty"`
	Object      string   `json:"object"`
	Warnings    []string `json:"warnings,omitempty"`
}
