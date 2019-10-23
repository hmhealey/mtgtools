package scryfall

import "time"

type Set struct {
	ID            string  `json:"id"`
	Code          string  `json:"code"`
	MTGOCode      string  `json:"mtgo_code,omitempty"`
	TCGPlayerID   int     `json:"tcgplayer_id,omitempty"`
	Name          string  `json:"name"`
	SetType       SetType `json:"set_type"`
	ReleasedAt    string  `json:"released_at,omitempty"`
	BlockCode     string  `json:"block_code,omitempty"`
	Block         string  `json:"block,omitempty"`
	ParentSetCode string  `json:"parent_set_code"`
	CardCount     int     `json:"card_count"`
	Digital       bool    `json:"digital"`
	FoilOnly      bool    `json:"foil_only"`
	ScryfallURI   string  `json:"scryfall_uri"`
	URI           string  `json:"uri"`
	IconSVGURI    string  `json:"icon_svg_uri"`
	SearchURI     string  `json:"search_uri"`
}

func (s *Set) ReleasedAtTime() time.Time {
	return TimestampToTime(s.ReleasedAt)
}

type SetType string

const (
	SetTypeCore            SetType = "core"
	SetTypeExpansion               = "expansion"
	SetTypeMasters                 = "masters"
	SetTypeMasterpiece             = "masterpiece"
	SetTypeFromTheVault            = "from_the_vault"
	SetTypeSpellbook               = "spellbook"
	SetTypePremiumDeck             = "premium_deck"
	SetTypeDuelDeck                = "duel_deck"
	SetTypeDraftInnovation         = "draft_innovation"
	SetTypeTreasureChest           = "treasure_chest"
	SetTypeCommander               = "commander"
	SetTypePlanechase              = "planechase"
	SetTypeArchenemy               = "archenemy"
	SetTypeVanguard                = "vanguard"
	SetTypeFunny                   = "funny"
	SetTypeStarter                 = "starter"
	SetTypeBox                     = "box"
	SetTypePromo                   = "promo"
	SetTypeToken                   = "token"
	SetTypeMemorabilia             = "memorabilia"
)
