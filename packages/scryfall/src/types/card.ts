import {Colors} from './color';
import {ScryfallDate, URI, UUID} from './scryfall';

export enum BorderColor {
    Black = 'black',
    Borderless = 'borderless',
    Gold = 'gold',
    Silver = 'silver',
    White = 'white',
}

export type Card = {
    // Core Card Fields
    arena_id?: number;
    id: UUID;
    lang: string;
    mtgo_id?: number;
    mtgo_foil_id?: number;
    multiverse_ids?: number[];
    tcgplayer_id?: number;
    tcgplayer_etched_id?: number;
    cardmarket_id?: number;
    object: 'card';
    oracle_id: UUID;
    prints_search_uri: URI;
    rulings_uri: URI;
    scryfall_uri: URI;
    uri: URI;

    // Gameplay Fields
    all_parts?: RelatedCard[];
    card_faces?: CardFace[];
    cmc: number;
    color_identity: Colors;
    color_indicator?: Colors;
    colors?: Colors;
    edhrec_rank?: number;
    hand_modifier?: string;
    keywords: string[];
    layout: FrameLayout;
    legalities: Legalities;
    life_modifier?: string;
    loyalty?: string;
    mana_cost?: string;
    name: string;
    oracle_text?: string;
    oversized: boolean;
    penny_rank?: number;
    power?: string;
    produced_mana?: Colors;
    reserved: boolean;
    toughness?: string;
    type_line: string;

    // Print Fields
    artist?: string;
    attraction_lights?: number[];
    booster: boolean;
    border_color: BorderColor;
    card_back_id: UUID;
    collector_number: string;
    content_warning?: boolean;
    digital: boolean;
    finishes: Finish[];
    flavor_name?: string;
    flavor_text?: string;
    frame_effects?: FrameEffect[];
    frame: FrameLayout;
    full_art: boolean;
    games: Game[];
    highres_image: boolean;
    illustration_id?: UUID;
    image_status: 'missing' | 'placeholder' | 'lowres' | 'highres_scan';
    image_uris?: ImageUris;
    prices: CardPrices;
    printed_name?: string;
    printed_text?: string;
    printed_type_line?: string;
    promo: boolean;
    promo_types?: string[];
    purchase_uris: Record<string, URI>;
    rarity: Rarity;
    related_uris?: Record<string, URI>;
    released_at: ScryfallDate;
    reprint: boolean;
    scryfall_set_uri: URI;
    set_name: string;
    set_search_uri: URI;
    set_type: string;
    set_uri: URI;
    story_spotlight: boolean;
    textless: boolean;
    variation: boolean;
    variation_of?: UUID;
    security_stamp: 'oval' | 'triangle' | 'acorn' | 'circle' | 'arena' | 'heart';
    watermark: string;
    preview?: {
        previewed_at: ScryfallDate;
        source_uri: URI;
        source: string;
    };
};

type CardWithLayout<Layout, RequiredFields extends keyof Card> = Card &
    Required<Pick<Card, RequiredFields>> & {layout: Layout};

export type SplitCard = CardWithLayout<FrameLayout.Split, 'card_faces'>;
export type FlipCard = CardWithLayout<FrameLayout.Flip, 'card_faces'>;
export type DoubleFacedCard = CardWithLayout<FrameLayout.Transform | FrameLayout.ModalDfc, 'card_faces'>;
export type DoubleFacedToken = CardWithLayout<FrameLayout.DoubleFacedToken, 'card_faces'>;
export type MeldCard = CardWithLayout<FrameLayout.Meld, 'all_parts'>;

export type CardFace = {
    artist?: string;
    cmc?: number;
    color_indicator?: Colors;
    colors?: Colors;
    flavor_text?: string;
    illustration_id?: UUID;
    image_uris?: ImageUris;
    layout?: FrameLayout;
    loyalty?: string;
    mana_cost: string;
    name: string;
    object: 'card_face';
    oracle_id?: UUID;
    oracle_text?: string;
    power?: string;
    printed_name?: string;
    printed_text?: string;
    printed_type_line?: string;
    toughness?: string;
    type_line?: string;
    watermark?: string;
};

export type CardPrices = {
    usd: string;
    usd_foil: string;
    usd_etched: string;
    eur: string;
    tix: string;
};

export enum Finish {
    Etched = 'etched',
    Foil = 'foil',
    Glossy = 'glossy',
    NonFoil = 'nonfoil',
}

export enum Format {
    Standard = 'standard',
    Future = 'future',
    Historic = 'historic',
    Gladiator = 'gladiator',
    Pioneer = 'pioneer',
    Exporer = 'explorer',
    Modern = 'modern',
    Legacy = 'legacy',
    Pauper = 'pauper',
    Vintage = 'vintage',
    Penny = 'penny',
    Commander = 'commander',
    Brawl = 'brawl',
    HistoricBrawl = 'historicbrawl',
    Alchemy = 'alchemy',
    PauperCommander = 'paupercommander',
    DuelCommander = 'duel',
    OldSchool = 'oldschool',
    Premodern = 'premodern',
}

export enum FrameEffect {
    Legendary = 'legendary',
    Miracle = 'miracle',
    NyxTouched = 'nyxtouched',
    Draft = 'draft',
    Devoid = 'devoid',
    Tombstone = 'tombstone',
    ColorShifted = 'colorshifted',
    Inverted = 'inverted',
    SunMoonDfc = 'sunmoondfc',
    CompassLandDfc = 'compasslanddfc',
    OriginPlaneswalkerDfc = 'originpwdfc',
    MoonEldraziDfc = 'mooneldrazydfc',
    WaxingAndWaningMoonDfc = 'waxingandwaningmoondfc',
    Showcase = 'showcase',
    ExtendedArt = 'extendedart',
    Companion = 'companion',
    Etched = 'etched',
    Snow = 'snow',
    Lesson = 'lesson',
    ShatteredGlass = 'shatteredglass',
    ConvertDfc = 'convertdfc',
    FanDfc = 'fandfc',
    UpsideDownDfc = 'upsidedowndfc',
}

export enum FrameLayout {
    Normal = 'normal',
    Split = 'split',
    Flip = 'flip',
    Transform = 'transform',
    ModalDfc = 'modal_dfc',
    Meld = 'meld',
    Leveler = 'leveler',
    Class = 'class',
    Saga = 'saga',
    Adventure = 'adventure',
    Planar = 'planar',
    Scheem = 'scheme',
    Vanguard = 'vanguard',
    Token = 'token',
    DoubleFacedToken = 'double_faced_token',
    Emblem = 'emblem',
    Augment = 'augment',
    Host = 'host',
    ArtSeries = 'art_series',
    ReversibleCard = 'reversible_card',
}

export enum Game {
    Arena = 'arena',
    Mtgo = 'mtgo',
    Paper = 'paper',
}

export enum ImageType {
    Png = 'png',
    BorderCrop = 'border_crop',
    ArtCrop = 'art_crop',
    Large = 'large',
    Normal = 'normal',
    Small = 'small',
}

export type ImageUris = {[type in ImageType]: string};

export type Legalities = {[type in Format]: Legality};
export enum Legality {
    Banned = 'banned',
    Legal = 'legal',
    NotLegal = 'not_legal',
    Restricted = 'restricted',
}

export enum Rarity {
    Common = 'common',
    Uncommon = 'uncommon',
    Rare = 'rare',
    Special = 'special',
    MythicRare = 'mythic',
    Bonus = 'bonus',
}

export type RelatedCard = {
    id: UUID;
    object: 'related_card';
    component: 'token' | 'meld_part' | 'meld_result' | 'combo_piece';
    name: string;
    type_line: string;
    uri: URI;
};

export type Ruling = {
    object: 'ruling';
    oracle_id: UUID;
    source: 'wotc' | 'scryfall';
    published_at: ScryfallDate;
    comment: string;
};
