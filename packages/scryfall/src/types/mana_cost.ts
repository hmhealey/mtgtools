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

export function isManaCost(o: unknown): o is ManaCost {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'mana_cost');
}
