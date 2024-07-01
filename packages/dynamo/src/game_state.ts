import type {Card} from '@hmhealey/scryfall/types/card';

export type GameState = {
    players: Player[];

    zones: BoardState;
};

export function makeEmptyGameState(): GameState {
    return {
        players: [],
        zones: {
            [Zone.Library]: [],
            [Zone.Hand]: [],
            [Zone.Battlefield]: [],
            [Zone.Graveyard]: [],
            [Zone.Exile]: [],
            [Zone.CommandZone]: [],
            [Zone.Sideboard]: [],
        },
    };
}

export type Player = {
    type: EntityType.Player;
    id: string;

    // name: string;

    // conceded: boolean;
    life: number;

    // commanders: Array<{
    //     card: CardReference;
    //     timesCast: number;
    // }>;

    // counters: {
    //     energy: number;
    //     experience: number;
    //     poison: number;
    //     rad: number;
    //     ticket: number;
    // };
};

export function isPlayer(entity: Entity): entity is Player {
    return entity.type === EntityType.Player;
}

export type BoardState = {
    [zone in Zone]: GameObject[];
};

export type CardReference = {
    id: Card['id'];

    // TODO owner
    // TODO controller

    // zone: Zone;

    // damage: number;

    // counters: {
    //     plusOne: number;

    //     // TODO
    // };
};

export const enum Zone {
    Library = 'library',
    Hand = 'hand',
    Battlefield = 'battlefield',
    Graveyard = 'graveyard',
    Exile = 'exile',
    CommandZone = 'commandZone',
    Sideboard = 'sideboard',
}

export const enum EntityType {
    Player = 'player',
    Card = 'card',
    Token = 'token',
}

export type Entity = Player | GameObject;

export type GameObject = CreatureObject;

export function isGameObject(entity: Entity): entity is GameObject {
    return entity.type === EntityType.Card || entity.type === EntityType.Token;
}

type BaseGameObject = {
    type: EntityType.Card | EntityType.Token;
    id: string;

    card: Card;

    controller: Player;
    // owner: Player;

    // tapped: boolean;
    // counters: Counters
};

export type CreatureObject = BaseGameObject & {
    markedDamage: number;
};

export function isCreatureObject(entity: Entity): entity is CreatureObject {
    return isGameObject(entity) && entity.card.type_line.includes('Creature');
}
