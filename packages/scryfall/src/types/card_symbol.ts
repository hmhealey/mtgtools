import {Colors} from './color';
import {URI} from './scryfall';

export type CardSymbol = {
    object: 'card_symbol';
    symbol: string;
    loose_variant?: string;
    english: string;
    transposable: boolean;
    represents_mana: boolean;
    cmc?: number;
    appears_in_mana_costs: boolean;
    funny: boolean;
    colors: Colors;
    gatherer_alternates?: string[];
    svg_uri?: URI;
};

export function isCardSymbol(o: unknown): o is CardSymbol {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'card_symbol');
}
