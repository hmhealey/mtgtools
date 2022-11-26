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
