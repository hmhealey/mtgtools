import type {MatcherFunction} from 'expect';

import ScryfallClient from './client';

import {isBulkData} from './types/bulk_data';
import {isCard} from './types/card';
import {isCardMigration} from './types/card_migration';
import {isCardSymbol} from './types/card_symbol';
import {Color} from './types/color';
import {isManaCost} from './types/mana_cost';
import {isRuling} from './types/ruling';
import {isCatalog, isErrorResponse, isList, isScryfallError, isSuccessResponse} from './types/scryfall';
import {isScryfallSet} from './types/set';

describe('ScryfallClient', () => {
    beforeEach(() => {
        // Add a short delay between tests to avoid getting rate limited
        return new Promise((resolve) => {
            setTimeout(resolve, 50);
        });
    });

    test('errors should be returned as a ScryfallError', async () => {
        const client = new ScryfallClient();

        const response = await client.searchCards('is:slick cmc>cmc');

        expect(response).toContainError();
        expect(response.error).toEqual({
            object: 'error',
            code: 'bad_request',
            status: 400,
            warnings: [
                'Invalid expression “is:slick” was ignored. Checking if cards are “slick” is not supported',
                'Invalid expression “cmc>cmc” was ignored. The sides of your comparison must be different.',
            ],
            details: 'All of your terms were ignored.',
        });
    });

    describe('Sets', () => {
        test('getAllSets', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllSets();

            expect(response).toContainListOf(isScryfallSet);
        });

        test('getSetByCode', async () => {
            const client = new ScryfallClient();

            const response = await client.getSetByCode('mmq');

            expect(response).toContainSet();
            expect(response.data?.name).toBe('Mercadian Masques');
        });

        test('getSetByTcgplayerId', async () => {
            const client = new ScryfallClient();

            const response = await client.getSetByTcgplayerId(1909);

            expect(response).toContainSet();
            expect(response.data?.name).toBe('Amonkhet Invocations');
        });

        test('getSetById', async () => {
            const client = new ScryfallClient();

            const response = await client.getSetById('2ec77b94-6d47-4891-a480-5d0b4e5c9372');

            expect(response).toContainSet();
            expect(response.data?.name).toBe('Ultimate Masters');
        });
    });

    describe('Cards', () => {
        test('searchCards', async () => {
            const client = new ScryfallClient();

            const response = await client.searchCards('c:red pow<3 year=1997', {order: 'cmc'});

            expect(response).toContainListOfCards();
        });

        describe('getCardByName', () => {
            test('fuzzy', async () => {
                const client = new ScryfallClient();

                const response = await client.getCardByName('aust com', {fuzzy: true});

                expect(response).toContainCard();
                expect(response.data.name).toBe('Austere Command');
            });

            test('exact', async () => {
                const client = new ScryfallClient();

                const response = await client.getCardByName('aust com', {fuzzy: false});

                expect(response).toContainError();
            });

            test('exact with invalid query', async () => {
                const client = new ScryfallClient();

                const response = await client.getCardByName('austere command', {fuzzy: false});

                expect(response).toContainCard();
                expect(response.data.name).toBe('Austere Command');
            });
        });

        test('autocompleteCards', async () => {
            const client = new ScryfallClient();

            const response = await client.autocompleteCards('thal');

            expect(response).toContainCatalog();
        });

        describe('getRandomCard', () => {
            test('with no query', async () => {
                const client = new ScryfallClient();

                const response = await client.getRandomCard();

                expect(response).toContainCard();
            });

            test('with a query', async () => {
                const client = new ScryfallClient();

                const response = await client.getRandomCard('mv=4 t:creature colors=bg');

                expect(response).toContainCard();
                expect(response.data.cmc).toBe(4);
                expect(response.data.type_line).toContain('Creature');
            });
        });

        test('getCardCollection', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardCollection([
                {set: 'ori', collector_number: '123'},
                {name: 'Wood Elves'},
                {id: '3899605d-2203-4ab6-9ff5-69490382eea4'},
                {name: 'Mind Goblin'},
            ]);

            expect(response).toContainListOfCards();
            expect(response.data.not_found).toEqual([{name: 'Mind Goblin'}]);
        });

        test('getCardBySetAndCollectorNumber', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardBySetAndCollectorNumber('xln', '96');

            expect(response).toContainCard();
            expect(response.data.name).toBe('Costly Plunder');
        });

        test('getCardByMultiverseId', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardByMultiverseId(409574);

            expect(response).toContainCard();
            expect(response.data.name).toBe('Strip Mine');
        });

        test('getCardByMtgoId', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardByMtgoId(54957);

            expect(response).toContainCard();
            expect(response.data.name).toBe('Ghost Quarter');
        });

        test('getCardByArenaId', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardByArenaId(67330);

            expect(response).toContainCard();
            expect(response.data.name).toBe('Yargle, Glutton of Urborg');
        });

        test('getCardByTcgplayerId', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardByTcgplayerId(162145);

            expect(response).toContainCard();
            expect(response.data.name).toBe('Rona, Disciple of Gix');
        });

        test('getCardByCardmarketId', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardByCardmarketId(379041);

            expect(response).toContainCard();
            expect(response.data.name).toBe('Embodiment of Agonies');
        });

        test('getCardById', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardById('f295b713-1d6a-43fd-910d-fb35414bf58a');

            expect(response).toContainCard();
            expect(response.data.name).toBe('Dusk // Dawn');
        });
    });

    describe('Rulings', () => {
        test('getRulingsByMultiverseId', async () => {
            const client = new ScryfallClient();

            const response = await client.getRulingsByMultiverseId(3255);

            expect(response).toContainListOf(isRuling);
            expect(response.data.data[0].comment.startsWith('The ability is a mana ability')).toBe(true);
        });

        test('getRulingsByMtgoId', async () => {
            const client = new ScryfallClient();

            const response = await client.getRulingsByMtgoId(57934);

            expect(response).toContainListOf(isRuling);
            expect(response.data.data[0].comment.startsWith('You choose the mode as the triggered')).toBe(true);
        });

        test('getRulingsByArenaId', async () => {
            const client = new ScryfallClient();

            const response = await client.getRulingsByArenaId(67462);

            expect(response).toContainListOf(isRuling);
            expect(response.data.data[0].comment.startsWith('Each of Song of Freyalise’s')).toBe(true);
        });

        test('getRulingsBySetAndCollectorNumber', async () => {
            const client = new ScryfallClient();

            const response = await client.getRulingsBySetAndCollectorNumber('ima', '65');

            expect(response).toContainListOf(isRuling);
            expect(response.data.data[0].comment.startsWith('If the target spell is an illegal target')).toBe(true);
        });

        test('getRulingsById', async () => {
            const client = new ScryfallClient();

            const response = await client.getRulingsById('f2b9983e-20d4-4d12-9e2c-ec6d9a345787');

            expect(response).toContainListOf(isRuling);
            expect(response.data.data[0].comment.startsWith('It must flip like a coin')).toBe(true);
        });
    });

    describe('Card Symbols', () => {
        test('getAllCardSymbols', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllCardSymbols();

            expect(response).toContainListOf(isCardSymbol);
        });

        test('parseManaCost', async () => {
            const client = new ScryfallClient();

            const response = await client.parseManaCost('RUx');

            expect(response.data).toBeDefined();
            expect(isManaCost(response.data)).toBe(true);
            expect(response.data.cost).toBe('{X}{U}{R}');
        });
    });

    describe('Catalogs', () => {
        test('getAllCardNames', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllCardNames();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('"Ach! Hans, Run!"');
        });

        test('getAllArtistNames', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllArtistNames();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Alayna Danner');
        });

        test('getWordBank', async () => {
            const client = new ScryfallClient();

            const response = await client.getWordBank();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('ass');
        });

        test('getAllCreatureTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllCreatureTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Faerie');
        });

        test('getAllPlaneswalkerTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllPlaneswalkerTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Tamiyo');
        });

        test('getAllLandTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllLandTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain("Urza's");
        });

        test('getAllArtifactTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllArtifactTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Vehicle');
        });

        test('getAllEnchantmentTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllEnchantmentTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Cartouche');
        });

        test('getAllSpellTypes', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllSpellTypes();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Trap');
        });

        test('getAllPowers', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllPowers();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('∞');
        });

        test('getAllToughnesses', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllToughnesses();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('7-*');
        });

        test('getAllLoyalties', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllLoyalties();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('1d4+1');
        });

        test('getAllWatermarks', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllWatermarks();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('agentsofsneak');
        });

        test('getAllKeywordAbilities', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllKeywordAbilities();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Gravestorm');
        });

        test('getAllKeywordActions', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllKeywordActions();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Meld');
        });

        test('getAllAbilityWords', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllAbilityWords();

            expect(response).toContainCatalog();
            expect(response.data.data).toContain('Landfall');
        });
    });

    describe('Bulk Data', () => {
        test('getAllBulkData', async () => {
            const client = new ScryfallClient();

            const response = await client.getAllBulkData();

            expect(response).toContainListOf(isBulkData);
        });

        test('getBulkDataById', async () => {
            const client = new ScryfallClient();

            const response = await client.getBulkDataById('922288cb-4bef-45e1-bb30-0c2bd3d3534f');

            expect(response.data).toBeDefined();
            expect(isBulkData(response.data)).toBe(true);
            expect(response.data.type).toBe('all_cards');
        });

        test('getBulkDataByType', async () => {
            const client = new ScryfallClient();

            const response = await client.getBulkDataByType('oracle-cards');

            expect(response.data).toBeDefined();
            expect(isBulkData(response.data)).toBe(true);
            expect(response.data.type).toBe('oracle_cards');
        });
    });

    describe('Card Migrations', () => {
        test('getCardMigrations', async () => {
            const client = new ScryfallClient();

            const response = await client.getCardMigrations(1);

            console.log(response.data.data[0]);
            console.log(isCardMigration(response.data.data[0]));

            expect(response).toContainListOf(isCardMigration);
            // expect(response.data.next_page).toBe('https://api.scryfall.com/migrations?page=2');
        });

        describe('getCardMigrationById', () => {
            test('merge', async () => {
                const client = new ScryfallClient();

                const response = await client.getCardMigrationById('6697b38a-ee19-455c-b24b-d0a659782d8b');

                expect(response.data).toBeDefined();
                expect(isCardMigration(response.data)).toBe(true);
                expect(response.data.note).toBe('Un-rebalanced on Arena');
                expect(response.data.migration_strategy).toBe('merge');
                expect(response.data.new_scryfall_id).toBeDefined();
            });

            test('delete', async () => {
                const client = new ScryfallClient();

                const response = await client.getCardMigrationById('01666b16-5dbc-4d31-913d-7f5f2f67ea39');

                expect(response.data).toBeDefined();
                expect(isCardMigration(response.data)).toBe(true);
                expect(response.data.note).toBe("Mistakenly imported, doesn't really exist");
                expect(response.data.migration_strategy).toBe('delete');
                expect(response.data.new_scryfall_id).not.toBeDefined();
            });
        });
    });
});

const toContainCard: MatcherFunction = function (actual: any) {
    const pass = isCard(actual.data);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be a card`,
        pass,
    };
};

const toContainCatalog: MatcherFunction = function (actual: any) {
    const pass = isCatalog(actual.data);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be a catalog`,
        pass,
    };
};

const toContainError: MatcherFunction = function (actual: any) {
    const pass = isErrorResponse(actual) && isScryfallError(actual.error);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be an error`,
        pass,
    };
};

const toContainListOf: MatcherFunction<[(o: unknown) => o is any]> = function <T>(
    actual: any,
    isType: (o: unknown) => o is T,
) {
    if (!isSuccessResponse(actual)) {
        return {
            message: () => `expect object with keys ${Object.keys(actual)} to be a success response`,
            pass: false,
        };
    }

    if (!isList(actual.data)) {
        return {
            message: () => `expect object with keys ${Object.keys(actual.data)} to be a list`,
            pass: false,
        };
    }

    if (!isType(actual.data.data[0])) {
        return {
            message: () => `expect object with keys ${Object.keys(actual.data)} to be of the given type`,
            pass: false,
        };
    }

    return {
        message: () => '',
        pass: true,
    };
};

const toContainListOfCards: MatcherFunction = function (actual: any) {
    const pass = isSuccessResponse(actual) && isList(actual.data) && isCard(actual.data.data[0]);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be a list of cards`,
        pass,
    };
};

const toContainSet: MatcherFunction = function (actual: any) {
    const pass = actual.data && isScryfallSet(actual.data);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be a set`,
        pass,
    };
};

expect.extend({
    toContainCard,
    toContainCatalog,
    toContainError,
    toContainListOf,
    toContainListOfCards,
    toContainSet,
});

interface CustomMatchers<R = unknown> {
    toContainCard(): R;
    toContainCatalog(): R;
    toContainError(): R;
    toContainListOf<T>(isType: (o: unknown) => o is T): R;
    toContainListOfCards(): R;
    toContainSet(): R;
}

declare global {
    namespace jest {
        interface Expect extends CustomMatchers {}
        interface Matchers<R> extends CustomMatchers<R> {}
        interface InverseAsymmetricMatchers extends CustomMatchers {}
    }
}
