import {Colors} from './color';

export type ManaCost = {
    object: 'mana_cost';
    cost: string;
    colors: Colors;
    cmc: number;
    colorless: boolean;
    monocolored: boolean;
    multicolored: boolean;
};
