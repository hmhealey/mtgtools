package scryfall

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestClientGetCards(t *testing.T) {
	c := NewClient()

	list, err := c.GetCards(4)

	require.Nil(t, err)
	require.NotNil(t, list)
	assert.Equal(t, ListObject, list.Object)
	assert.Len(t, list.Data, 175)
	assert.GreaterOrEqual(t, list.TotalCards, 261412)
}

func TestClientSearchCards(t *testing.T) {
	c := NewClient()

	t.Run("regular search", func(t *testing.T) {
		list, err := c.SearchCards("lightning bolt", 0, CardSearchOptions{})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.Len(t, list.Data, 1)
		assert.Equal(t, "Lightning Bolt", list.Data[0].Name)
	})

	t.Run("no results", func(t *testing.T) {
		list, err := c.SearchCards("somethingthatdoesn'texist", 0, CardSearchOptions{})

		require.NotNil(t, err)
		require.Nil(t, list)
	})

	t.Run("uniqueness", func(t *testing.T) {
		list, err := c.SearchCards("lightning bolt", 0, CardSearchOptions{Unique: "prints"})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.Greater(t, len(list.Data), 1)
		for _, card := range list.Data {
			assert.Equal(t, "Lightning Bolt", card.Name)
		}
	})

	t.Run("order and direction", func(t *testing.T) {
		list, err := c.SearchCards("oko", 0, CardSearchOptions{Order: "name"})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.GreaterOrEqual(t, len(list.Data), 19)
		assert.Greater(t, list.Data[len(list.Data)-1].Name, list.Data[0].Name)

		list, err = c.SearchCards("oko", 0, CardSearchOptions{Order: "name", Direction: "desc"})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.GreaterOrEqual(t, len(list.Data), 19)
		assert.Greater(t, list.Data[0].Name, list.Data[len(list.Data)-1].Name)

		list, err = c.SearchCards("oko", 0, CardSearchOptions{Order: "set"})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.GreaterOrEqual(t, len(list.Data), 19)
		assert.Greater(t, list.Data[0].SetName, list.Data[len(list.Data)-1].SetName)
	})

	t.Run("multilingual", func(t *testing.T) {
		list, err := c.SearchCards("wilder nacatl", 0, CardSearchOptions{IncludeMultilingual: false})

		require.NotNil(t, err)
		require.Nil(t, list)

		list, err = c.SearchCards("wilder nacatl", 0, CardSearchOptions{IncludeMultilingual: true})

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.Equal(t, len(list.Data), 1)
		assert.Equal(t, "Wild Nacatl", list.Data[0].Name)
	})
}

func TestClientGetCardByName(t *testing.T) {
	c := NewClient()

	t.Run("with exact name", func(t *testing.T) {
		card, err := c.GetCardByName("bitterblossom", false)

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, "Bitterblossom", card.Name)
	})

	t.Run("with fuzzy name", func(t *testing.T) {
		card, err := c.GetCardByName("aust comm", true)

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, "Austere Command", card.Name)
	})
}

func TestClientGetCardByNameAndSet(t *testing.T) {
	c := NewClient()

	t.Run("with exact name", func(t *testing.T) {
		card, err := c.GetCardByNameAndSet("bitterblossom", false, "uma")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, "Bitterblossom", card.Name)
		assert.Equal(t, "Ultimate Masters", card.SetName)

		card, err = c.GetCardByNameAndSet("bitterblossom", false, "mor")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, "Bitterblossom", card.Name)
		assert.Equal(t, "Morningtide", card.SetName)
	})

	t.Run("with fuzzy name", func(t *testing.T) {
		card, err := c.GetCardByNameAndSet("aust comm", true, "ima")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, "Austere Command", card.Name)
		assert.Equal(t, "Iconic Masters", card.SetName)

		card, err = c.GetCardByNameAndSet("aust comm", true, "lrw")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, "Austere Command", card.Name)
		assert.Equal(t, "Lorwyn", card.SetName)
	})
}

func TestClientAutocompleteCards(t *testing.T) {
	c := NewClient()

	catalog, err := c.AutocompleteCards("fo")

	require.Nil(t, err)
	require.NotNil(t, catalog)
	assert.Equal(t, CatalogObject, catalog.Object)
	assert.GreaterOrEqual(t, len(catalog.Data), 2)
}

func TestClientGetRandomCard(t *testing.T) {
	c := NewClient()

	t.Run("without a query", func(t *testing.T) {
		card, err := c.GetRandomCard("")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
	})

	t.Run("with a query", func(t *testing.T) {
		card, err := c.GetRandomCard("type:faerie")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Contains(t, card.TypeLine, "Faerie")
	})
}

func TestClientGetCardCollection(t *testing.T) {
	c := NewClient()

	t.Run("with only valid identifiers", func(t *testing.T) {
		list, err := c.GetCardCollection(MakeCardIdentifiers(
			CardByID("683a5707-cddb-494d-9b41-51b4584ded69"),
			CardByMTGOID(70055),
			CardByMultiverseID(129586),
			CardByOracleID("7b3b5be0-8bec-43c9-bd61-39fd92e0d705"),
			CardByIllustrationID("0fc0be46-7e05-49e8-9805-a522d5882e4d"),
			CardByName("Aetherflux Reservoir"),
			CardByNameAndSet("Lightning Bolt", "lea"),
			CardByCollectorNumber("54c", "ust"),
		))

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.Empty(t, list.NotFound)
		assert.Len(t, list.Data, 8)
		assert.Equal(t, "Lodestone Golem", list.Data[0].Name)
		assert.Equal(t, "Ancient Tomb", list.Data[1].Name)
		assert.Equal(t, "Grizzly Bears", list.Data[2].Name)
		assert.Equal(t, "Half-Orc, Half-", list.Data[3].Name)
		assert.Equal(t, "Cinder Wall", list.Data[4].Name)
		assert.Equal(t, "Aetherflux Reservoir", list.Data[5].Name)
		assert.Equal(t, "Lightning Bolt", list.Data[6].Name)
		assert.Equal(t, "Extremely Slow Zombie", list.Data[7].Name)
	})

	t.Run("with an invalid identifier", func(t *testing.T) {
		list, err := c.GetCardCollection(MakeCardIdentifiers(
			CardByName("something that doesn't exist"),
		))

		require.Nil(t, err)
		require.NotNil(t, list)
		assert.Equal(t, ListObject, list.Object)
		assert.Equal(t, []CardIdentifier{
			CardByName("something that doesn't exist"),
		}, list.NotFound)
		assert.Empty(t, list.Data)
	})
}

func TestClientGetCardByCollectorNumber(t *testing.T) {
	c := NewClient()

	t.Run("with a numberic collector number", func(t *testing.T) {
		card, err := c.GetCardByCollectorNumber("shm", "172")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, card.Name, "Oona, Queen of the Fae")
	})

	t.Run("with a non-numeric collector number", func(t *testing.T) {
		card, err := c.GetCardByCollectorNumber("emn", "15b")

		require.Nil(t, err)
		require.NotNil(t, card)
		assert.Equal(t, CardObject, card.Object)
		assert.Equal(t, card.Name, "Brisela, Voice of Nightmares")
	})
}
