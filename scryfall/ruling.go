package scryfall

import "time"

type Ruling struct {
	Object      string `json:"object"`
	OracleID    string `json:"oracle_id"`
	Source      string `json:"source"`
	PublishedAt string `json:"published_at"`
	Comment     string `json:"comment"`
}

func (r *Ruling) PublishedAtTime() time.Time {
	return TimestampToTime(r.PublishedAt)
}
