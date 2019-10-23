package scryfall

type CardSymbol struct {
	Symbol             string   `json:"symbol"`
	LooseVariant       string   `json:"loose_variant,omitempty"`
	English            string   `json:"english"`
	Transposable       bool     `json:"transposable"`
	RepresentsMana     bool     `json:"represents_mana"`
	CMC                float64  `json:"cmc,omitempty"`
	AppearsInManaCosts bool     `json:"appears_in_mana_costs"`
	Funny              bool     `json:"funny"`
	Colors             Colors   `json:"colors"`
	GathererAlternates []string `json:"gatherer_alternates,omitempty"`
}
