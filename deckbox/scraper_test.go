package deckbox

import (
	"fmt"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

var testEmail string
var testPassword string

func TestMain(m *testing.M) {
	testEmail = os.Getenv("MTGT_DECKBOX_EMAIL")
	testPassword = os.Getenv("MTGT_DECKBOX_PASSWORD")

	if testEmail == "" || testPassword == "" {
		fmt.Println("MTGT_DECKBOX_EMAIL and MTGT_DECKBOX_PASSWORD must be set to run tests")
		os.Exit(1)
	}

	os.Exit(m.Run())
}

func TestLogin(t *testing.T) {
	s := NewScraper()
	err := s.Login(testEmail, testPassword)

	require.Nil(t, err)
	assert.NotEqual(t, "", s.getAuthToken())
}

func TestGetInventorySetNumber(t *testing.T) {
	s := NewScraper()
	err := s.Login(testEmail, testPassword)

	require.Nil(t, err)

	setNumber, err := s.GetInventorySetNumber()
	require.Nil(t, err)
	assert.NotEqual(t, "", setNumber)
}
