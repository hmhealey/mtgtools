package scryfall

type Error struct {
	Status   int      `json:"status"`
	Code     string   `json:"code"`
	Details  string   `json:"details"`
	Type     string   `json:"type"`
	Warnings []string `json:"warnings"`
}

func (e Error) Error() string {
	return e.Details
}
