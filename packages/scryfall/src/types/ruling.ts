import {ScryfallDate} from './scryfall';

export type Ruling = {
    object: 'ruling';
    oracle_id: string;
    source: 'scryfall' | 'wotc';
    published_at: ScryfallDate;
    comment: string;
};

export function isRuling(o: unknown): o is Ruling {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'ruling');
}
