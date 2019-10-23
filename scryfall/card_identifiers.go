package scryfall

type CardIdentifiers struct {
	Identifiers []CardIdentifier `json:"identifiers"`
}

func MakeCardIdentifiers(identifiers ...CardIdentifier) CardIdentifiers {
	return CardIdentifiers{identifiers}
}

type CardIdentifier map[string]interface{}

func CardByID(id string) CardIdentifier {
	return CardIdentifier{"id": id}
}

func CardByMTGOID(mtgoID int64) CardIdentifier {
	return CardIdentifier{"mtgo_id": mtgoID}
}

func CardByMultiverseID(multiverseID int) CardIdentifier {
	return CardIdentifier{"multiverse_id": multiverseID}
}

func CardByOracleID(oracleID string) CardIdentifier {
	return CardIdentifier{"oracle_id": oracleID}
}

func CardByIllustrationID(illustrationID string) CardIdentifier {
	return CardIdentifier{"illustration_id": illustrationID}
}

func CardByName(name string) CardIdentifier {
	return CardIdentifier{"name": name}
}

func CardByNameAndSet(name string, set string) CardIdentifier {
	return CardIdentifier{"name": name, "set": set}
}

func CardByCollectorNumber(collectorNumber string, set string) CardIdentifier {
	return CardIdentifier{"collector_number": collectorNumber, "set": set}
}
