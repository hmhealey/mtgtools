package scryfall

type Legality string

const (
	NotLegal   Legality = "not_legal"
	Legal               = "legal"
	Banned              = "banned"
	Restricted          = "restricted"
)

func (l Legality) IsPlayable() bool {
	return l == Legal || l == Restricted
}

type Legalities struct {
	Standard      Legality `json:"standard"`
	Future        Legality `json:"future"`
	Historic      Legality `json:"historic"`
	Modern        Legality `json:"modern"`
	Legacy        Legality `json:"legacy"`
	Pauper        Legality `json:"pauper"`
	Vintage       Legality `json:"vintage"`
	Penny         Legality `json:"penny"`
	Commander     Legality `json:"commander"`
	Brawl         Legality `json:"brawl"`
	DuelCommander Legality `json:"duel"`
	OldSchool     Legality `json:"oldschool"`
}
