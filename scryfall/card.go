package scryfall

import "time"

const CardObject = "card"

type Card struct {
	ArenaID         int    `json:"arena_id,omitempty"`
	ID              string `json:"id"`
	Language        string `json:"lang"`
	MTGOID          int    `json:"mtgo_id,omitempty"`
	MTGOFoilID      int    `json:"mtgo_foil_id,omitempty"`
	MultiverseIDs   []int  `json:"multiverse_ids,omitempty"`
	TCGplayerID     int    `json:"tcgplayer_id,omiteempty"`
	Object          string `json:"object"`
	OracleID        string `json:"oracle_id"`
	PrintsSearchURI string `json:"prints_search_uri"`
	RulingsURI      string `json:"rulings_uri"`
	ScryfallURI     string `json:"scryfall_uri"`
	URI             string `json:"uri"`

	AllParts       []RelatedCard `json:"all_parts,omitempty"`
	CardFaces      []CardFace    `json:"card_faces,omitempty"`
	CMC            float64       `json:"cmc"`
	Colors         Colors        `json:"colors,omitempty"`
	ColorIdentity  Colors        `json:"color_identity"`
	ColorIndicator Colors        `json:"color_indicator,omitempty"`
	EDHRECRank     int           `json:"edhrec_rank,omitempty"`
	Foil           bool          `json:"foil"`
	HandModifier   string        `json:"hand_modifier,omitempty"`
	Layout         Layout        `json:"layout"`
	Legalities     Legalities    `json:"legalities"`
	LifeModifier   string        `json:"life_modifier,omitempty"`
	Loyalty        string        `json:"loyalty,omitempty"`
	ManaCost       string        `json:"mana_cost,omitempty"`
	Name           string        `json:"name"`
	Nonfoil        bool          `json:"nonfoil"`
	OracleText     string        `json:"oracle_text,omitempty"`
	Oversized      bool          `json:"oversized"`
	Power          string        `json:"power,omitempty"`
	Reserved       bool          `json:"reserved"`
	Toughness      string        `json:"toughness,omitempty"`
	TypeLine       string        `json:"type_line"`

	Artist              string            `json:"artist,omitempty"`
	Booster             bool              `json:"booster"`
	BorderColor         string            `json:"border_color"`
	CardBackID          string            `json:"card_back_id"`
	CollectorNumber     string            `json:"collector_number"`
	Digital             bool              `json:"digital"`
	FlavorText          string            `json:"flavor_text,omitempty"`
	FrameEffects        []FrameEffect     `json:"frame_effects,omitempty"`
	Frame               Frame             `json:"frame"`
	FullArt             bool              `json:"full_art"`
	Games               []string          `json:"games"`
	HighResolutionImage bool              `json:"highres_image"`
	IllustrationID      string            `json:"illustration_id,omitempty"`
	ImageURIs           CardImageURIs     `json:"image_uris,omitempty"`
	Prices              map[string]string `json:"prices"`
	PrintedName         string            `json:"printed_name,omitempty"`
	PrintedText         string            `json:"printed_text,omitempty"`
	PrintedType         string            `json:"printed_type_line,omitempty"`
	Promo               bool              `json:"promo"`
	PromoTypes          []string          `json:"promo_types,omitempty"`
	PurchaseURIs        map[string]string `json:"purchase_uris"`
	Rarity              Rarity            `json:"rarity"`
	RelatedURIs         map[string]string `json:"related_uris"`
	ReleasedAt          string            `json:"released_at"`
	Reprint             bool              `json:"reprint"`
	ScryfallSetURI      string            `json:"scryfall_set_uri"`
	SetName             string            `json:"set_name"`
	SetSearchURI        string            `json:"set_search_uri"`
	SetType             SetType           `json:"set_type"`
	SetURI              string            `json:"set_uri"`
	SetCode             string            `json:"set"`
	StorySpotlight      bool              `json:"story_spotlight"`
	Textless            bool              `json:"textless"`
	Variation           bool              `json:"variation"`
	VariationOfID       string            `json:"variation_of,omitempty"`
	Watermark           string            `json:"watermark,omitempty"`
	Preview             CardPreview       `json:"preview"`
}

func (c *Card) ReleasedAtTime() time.Time {
	return TimestampToTime(c.ReleasedAt)
}

type CardFace struct {
	Artist         string        `json:"artist,omitempty"`
	ColorIdentity  Colors        `json:"color_indicator,omitempty"`
	Colors         Colors        `json:"colors,omitempty"`
	FlavorText     string        `json:"flavor_text,omitempty"`
	IllustrationID string        `json:"illustration_id,omitempty"`
	ImageURIs      CardImageURIs `json:"image_uris,omitempty"`
	Loyalty        string        `json:"loyalty,omitempty"`
	ManaCost       string        `json:"mana_cost,omitempty"`
	Name           string        `json:"name"`
	Object         string        `json:"object"`
	OracleText     string        `json:"oracle_text,omitempty"`
	Power          string        `json:"power,omitempty"`
	PrintedName    string        `json:"printed_name,omitempty"`
	PrintedText    string        `json:"printed_text,omitempty"`
	PrintedType    string        `json:"printed_type_line,omitempty"`
	Toughness      string        `json:"toughness,omitempty"`
	TypeLine       string        `json:"type_line"`
	Watermark      string        `json:"watermark,omitempty"`
}

type RelatedCard struct {
	ID        string `json:"id"`
	Object    string `json:"object"`
	Component string `json:"component"`
	Name      string `json:"name"`
	TypeLine  string `json:"type_line"`
	URI       string `json:"uri"`
}

type CardImageURIs struct {
	PNG        string `json:"png"`
	BorderCrop string `json:"border_crop"`
	Large      string `json:"large"`
	Normal     string `json:"normal"`
	Small      string `json:"small"`
}

type CardPreview struct {
	PreviewedAt string `json:"previewed_at,omitempty"`
	SourceURI   string `json:"source_uri,omitempty"`
	Source      string `json:"source,omitempty"`
}
