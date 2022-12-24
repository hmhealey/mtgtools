import type {MatcherFunction} from 'expect';

import ScryfallClient from './client';
import {isCard} from './types/card';
import {Color} from './types/color';
import {isCatalog, isErrorResponse, isList, isScryfallError, isSuccessResponse} from './types/scryfall';
import {isScryfallSet} from './types/set';

describe('ScryfallClient', () => {
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

                const response = await client.getRandomCard('mv=4 colors=bg');

                expect(response).toContainCard();
                expect(response.data.cmc).toBe(4);
                expect(response.data.colors).toEqual([Color.Black, Color.Green]);
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
        // TODO
    });

    describe('Card Symbols', () => {
        // TODO
    });

    describe('Catalogs', () => {
        // TODO
    });

    describe('Bulk Data', () => {
        // TODO
    });

    describe('Card Migrations', () => {
        // TODO
    });

    // ---

    test('asdf', async () => {
        const client = new ScryfallClient();

        const response = await client.getAllSets();

        expect(response.data).toBeDefined();
        expect(response.error).not.toBeDefined();
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
    const pass = isSuccessResponse(actual) && isList(actual.data) && isType(actual.data.data[0]);

    return {
        message: () => `expected ${JSON.stringify(actual)} to be a list of the given type`,
        pass,
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
