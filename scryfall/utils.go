package scryfall

import "time"

func TimestampToTime(timestamp string) time.Time {
	if timestamp == "" {
		return time.Time{}
	}

	t, _ := time.Parse("2006-01-02 MST", timestamp+" PST")
	return t
}
