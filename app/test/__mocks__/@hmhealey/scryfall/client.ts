import ScryfallClient from '@hmhealey/scryfall/client';
import {Card} from '@hmhealey/scryfall/types/card';
import {CardSymbol} from '@hmhealey/scryfall/types/card_symbol';
import {List} from '@hmhealey/scryfall/types/scryfall';

import cardSymbols from './card_symbols.json';
import lightningBolt from './lightning_bolt.json';

interface ClientInterface extends ScryfallClient {}
type MockedInterface = {
    [Property in keyof ClientInterface]: ClientInterface[Property];
};

export default class MockedClient implements MockedInterface {
    // Sets

    getAllSets = jest.fn();
    getSetByCode = jest.fn();
    getSetByTcgplayerId = jest.fn();
    getSetById = jest.fn();

    // Cards

    searchCards = jest.fn();

    getCardByName = mockAsyncResponse((name: string) => ({
        data: {
            ...lightningBolt,
            name,
            oracle_text: lightningBolt.oracle_text.replace('Lightning Bolt', name),
        } as Card,
        error: undefined,
    }));

    autocompleteCards = jest.fn();
    getRandomCard = jest.fn();
    getCardCollection = jest.fn();
    getCardBySetAndCollectorNumber = jest.fn();
    getCardByMultiverseId = jest.fn();
    getCardByMtgoId = jest.fn();
    getCardByArenaId = jest.fn();
    getCardByTcgplayerId = jest.fn();
    getCardByCardmarketId = jest.fn();
    getCardById = jest.fn();

    // Rulings

    getRulingsByMultiverseId = jest.fn();
    getRulingsByMtgoId = jest.fn();
    getRulingsByArenaId = jest.fn();
    getRulingsBySetAndCollectorNumber = jest.fn();
    getRulingsById = jest.fn();

    // Card Symbols

    getAllCardSymbols = mockAsyncResponse(() => ({data: cardSymbols as List<CardSymbol>, error: undefined}));

    parseManaCost = jest.fn();

    // Catalogs

    getAllCardNames = jest.fn();
    getAllArtistNames = jest.fn();
    getWordBank = jest.fn();
    getAllCreatureTypes = jest.fn();
    getAllPlaneswalkerTypes = jest.fn();
    getAllLandTypes = jest.fn();
    getAllArtifactTypes = jest.fn();
    getAllEnchantmentTypes = jest.fn();
    getAllSpellTypes = jest.fn();
    getAllPowers = jest.fn();
    getAllToughnesses = jest.fn();
    getAllLoyalties = jest.fn();
    getAllWatermarks = jest.fn();
    getAllKeywordAbilities = jest.fn();
    getAllKeywordActions = jest.fn();
    getAllAbilityWords = jest.fn();

    // Bulk Data

    getAllBulkData = jest.fn();
    getBulkDataById = jest.fn();
    getBulkDataByType = jest.fn();

    // Card Migrations

    getCardMigrations = jest.fn();
    getCardMigrationById = jest.fn();
}

export function mockAsyncResponse<T, Args extends any[]>(func: (...args: Args) => T) {
    return jest.fn<Promise<T>, Args>((...args) => {
        // Testing Library complains when setState is called outside of an act. If a component calls a client method in
        // a useEffect and uses the response to set some state, that would cause Testing Library to print a warning if the
        // value is returned wrapped in a Promise.resolve or if we use a Promise that resolves immediately.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(func(...args));
            }, 0);
        });
    });
}
