import {ScryfallDate} from './scryfall';

export type Ruling = {
    object: 'ruling';
    oracle_id: string;
    source: 'scryfall' | 'wotc';
    published_at: ScryfallDate;
    comment: string;
};
