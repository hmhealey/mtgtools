import {ScryfallDate, UUID, URI} from './scryfall';

export type Set = {
    object: 'set';
    id: UUID;
    code: string;
    mtgo_code?: string;
    tcgpayer_id?: number;
    name: string;
    set_type: SetType;
    released_at?: ScryfallDate;
    block_code?: string;
    block?: string;
    parent_set_code?: string;
    card_count: number;
    printed_size?: number;
    digital: boolean;
    foil_only: boolean;
    nonfoil_only: boolean;
    scryfall_uri: URI;
    uri: URI;
    icon_svg_uri: URI;
    search_uri: URI;
};

export function isSet(o: unknown): o is Set {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'set');
}

export enum SetType {
    Core = 'core',
    Expansion = 'expansion',
    Masters = 'masters',
    Alchemy = 'alchemy',
    Masterpiece = 'masterpiece',
    Arsenal = 'arsenal',
    FromTheVault = 'from_the_vault',
    Spellbook = 'spellbook',
    PremiumDeck = 'premium_deck',
    DuelDeck = 'duel_deck',
    DraftInnovation = 'draft_innovation',
    TreasureChest = 'treasure_chest',
    Commander = 'commander',
    Planechase = 'planechase',
    Archenemy = 'archenemy',
    Vanguard = 'vanguard',
    Funny = 'funny',
    Starter = 'starter',
    Box = 'box',
    Promo = 'promo',
    Token = 'token',
    Memorabilia = 'memorabilia',
}
