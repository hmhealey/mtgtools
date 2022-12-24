import {BulkData} from './types/bulk_data';
import {Card} from './types/card';
import {CardMigration} from './types/card_migration';
import {CardSymbol} from './types/card_symbol';
import {ManaCost} from './types/mana_cost';
import {Ruling} from './types/ruling';
import {Catalog, List, ScryfallError, ScryfallResponse, UUID} from './types/scryfall';
import {ScryfallSet} from './types/set';

export default class ScryfallClient {
    private apiRoot = 'https://api.scryfall.com';

    // Sets

    getAllSets() {
        return this.doFetch<List<ScryfallSet>>('/sets');
    }

    getSetByCode(code: string) {
        return this.doFetch<ScryfallSet>(`/sets/${code}`);
    }

    getSetByTcgplayerId(id: number) {
        return this.doFetch<ScryfallSet>(`/sets/tcgplayer/${id}`);
    }

    getSetById(id: string) {
        return this.doFetch<ScryfallSet>(`/sets/${id}`);
    }

    // Cards

    searchCards(searchQuery: string, options?: CardSearchOptions) {
        const queryString = this.makeQueryString({
            ...options,
            q: searchQuery,
        });
        return this.doFetch<List<Card>>(`/cards/search${queryString}`);
    }

    getCardByName(name: string, {fuzzy, ...options}: GetCardOptions) {
        const queryString = this.makeQueryString({
            ...options,
            [fuzzy ? 'fuzzy' : 'exact']: name,
        });
        return this.doFetch<Card>(`/cards/named${queryString}`);
    }

    autocompleteCards(query: string, options?: AutocompleteOptions) {
        const queryString = this.makeQueryString({
            ...options,
            q: query,
        });
        return this.doFetch<Catalog>(`/cards/autocomplete${queryString}`);
    }

    getRandomCard(query?: string) {
        const queryString = this.makeQueryString({
            q: query,
        });
        return this.doFetch<Card>(`/cards/random${queryString}`);
    }

    getCardCollection(identifiers: CardIdentifier[]) {
        return this.doFetch<List<Card, CardIdentifier>>('/cards/collection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({identifiers}),
        });
    }

    getCardBySetAndCollectorNumber(setCode: string, collectorNumber: string, language?: string) {
        let url;
        if (language) {
            url = `/cards/${setCode}/${collectorNumber}/${language}`;
        } else {
            url = `/cards/${setCode}/${collectorNumber}`;
        }

        return this.doFetch<Card>(url);
    }

    getCardByMultiverseId(id: number) {
        return this.doFetch<Card>(`/cards/multiverse/${id}`);
    }

    getCardByMtgoId(id: number) {
        return this.doFetch<Card>(`/cards/mtgo/${id}`);
    }

    getCardByArenaId(id: number) {
        return this.doFetch<Card>(`/cards/arena/${id}`);
    }

    getCardByTcgplayerId(id: number) {
        return this.doFetch<Card>(`/cards/tcgplayer/${id}`);
    }

    getCardByCardmarketId(id: number) {
        return this.doFetch<Card>(`/cards/cardmarket/${id}`);
    }

    getCardById(id: UUID) {
        return this.doFetch<Card>(`/cards/${id}`);
    }

    // Rulings

    getRulingsByMultiverseId(id: number) {
        return this.doFetch<List<Ruling>>(`/cards/multiverse/${id}/rulings`);
    }

    getRulingsByMtgoId(id: number) {
        return this.doFetch<List<Ruling>>(`/cards/mtgo/${id}/rulings`);
    }

    getRulingsByArenaId(id: number) {
        return this.doFetch<List<Ruling>>(`/cards/arena/${id}/rulings`);
    }

    getRulingsBySetAndCollectorNumber(setCode: string, collectorNumber: string) {
        return this.doFetch<List<Ruling>>(`/cards/${setCode}/${collectorNumber}/rulings`);
    }

    getRulingsById(id: number) {
        return this.doFetch<List<Ruling>>(`/cards/${id}/rulings`);
    }

    // Card Symbols

    getAllCardSymbols() {
        return this.doFetch<List<CardSymbol>>('/symbology');
    }

    parseManaCost(cost: string) {
        return this.doFetch<ManaCost>(`/symbology/parse-mana?cost=${cost}`);
    }

    // Catalogs

    getAllCardNames() {
        return this.doFetch<Catalog>('/catalog/card-names');
    }

    getAllArtistNames() {
        return this.doFetch<Catalog>('/catalog/artist-names');
    }

    getWordBank() {
        return this.doFetch<Catalog>('/catalog/word-bank');
    }

    getAllCreatureTypes() {
        return this.doFetch<Catalog>('/catalog/creature-types');
    }

    getAllPlaneswalkerTypes() {
        return this.doFetch<Catalog>('/catalog/palneswalker-types');
    }

    getAllLandTypes() {
        return this.doFetch<Catalog>('/catalog/land-types');
    }

    getAllArtifactTypes() {
        return this.doFetch<Catalog>('/catalog/artifact-types');
    }

    getAllEnchantmentTypes() {
        return this.doFetch<Catalog>('/catalog/enchantment-types');
    }

    getAllSpellTypes() {
        return this.doFetch<Catalog>('/catalog/spell-types');
    }

    getAllPowers() {
        return this.doFetch<Catalog>('/catalog/powers');
    }

    getAllToughnesses() {
        return this.doFetch<Catalog>('/catalog/toughnesses');
    }

    getAllLoyalties() {
        return this.doFetch<Catalog>('/catalog/loyalties');
    }

    getAllWatermarks() {
        return this.doFetch<Catalog>('/catalog/watermarks');
    }

    getAllKeywordAbilities() {
        return this.doFetch<Catalog>('/catalog/keyword-abilities');
    }

    getAllKeywordActions() {
        return this.doFetch<Catalog>('/catalog/keyword-actions');
    }

    getAllAbilityWords() {
        return this.doFetch<Catalog>('/catalog/ability-words');
    }

    // Bulk Data

    getAllBulkData() {
        return this.doFetch<List<BulkData>>('/bulk-data');
    }

    getBulkDataById(id: UUID) {
        return this.doFetch<List<BulkData>>(`/bulk-data/${id}`);
    }

    getBulkDataByType(type: string) {
        return this.doFetch<List<BulkData>>(`/bulk-data/${type}`);
    }

    // Card Migrations

    getCardMigrations(page: number) {
        return this.doFetch<List<CardMigration>>(`/migrations?page=${page}`);
    }

    getCardMigrationByid(id: string) {
        return this.doFetch<CardMigration>(`/migrations/${id}`);
    }

    // Private

    private makeQueryString(options: Record<string, any>) {
        const params: string[] = [];

        for (const [key, value] of Object.entries(options)) {
            if (value === undefined) {
                continue;
            }

            params.push(`${key}=${encodeURIComponent(value)}`);
        }

        return params.length > 0 ? `?${params.join('&')}` : '';
    }

    private async doFetch<T>(path: string, fetchOptions?: RequestInit): Promise<ScryfallResponse<T>> {
        const response = await fetch(this.apiRoot + path, fetchOptions);
        const responseJson = await response.json();

        if (response.ok) {
            return {
                data: responseJson as T,
                error: undefined,
            };
        } else {
            return {
                data: undefined,
                error: responseJson as ScryfallError,
            };
        }
    }
}

export interface CardSearchOptions {
    unique?: 'cards' | 'art' | 'prints';
    order?:
        | 'name'
        | 'set'
        | 'released'
        | 'rarity'
        | 'color'
        | 'usd'
        | 'tix'
        | 'eur'
        | 'cmc'
        | 'power'
        | 'toughness'
        | 'edhrec'
        | 'penny'
        | 'artist'
        | 'review';
    dir?: 'auto' | 'asc' | 'desc';
    include_extras?: boolean;
    include_variations?: boolean;
    page?: number;
}

export interface GetCardOptions {
    set?: string;
    fuzzy?: boolean;
}

export interface AutocompleteOptions {
    include_extras?: boolean;
}

export type CardIdentifier =
    | {id: UUID}
    | {mtgo_id: number}
    | {multiverse_id: number}
    | {oracle_id: UUID}
    | {illustration_id: UUID}
    | {name: string}
    | {name: string; set: string}
    | {collector_number: string; set: string};
