import {Entity, GameObject, GameState, Player, Zone, isCreatureObject, isPlayer} from './game_state';
import {assert} from './utils';

export function move(state: GameState, object: GameObject, from: Zone, to: Zone) {
    const nextFromZone = [...state.zones[from]];

    const index = nextFromZone.indexOf(object);
    assert(index !== -1, 'unable to move object from ' + from);

    nextFromZone.splice(index, 1);

    const nextToZone = [...state.zones[to]];
    nextToZone.push(object);

    return {
        ...state,
        board: {
            ...state.zones,
            [from]: nextFromZone,
            [to]: nextToZone,
        },
    };
}

export function changeLife(state: GameState, player: Player, amount: number) {
    const nextPlayers = [...state.players];

    const index = nextPlayers.indexOf(player);
    assert(index !== -1, 'unable to change life of player');

    nextPlayers[index] = {
        ...nextPlayers[index],
        life: nextPlayers[index].life + amount,
    };

    return {
        ...state,
        players: nextPlayers,
    };
}

export function applyDamage(state: GameState, entity: Entity, amount: number) {
    if (isPlayer(entity)) {
        return changeLife(state, entity, -amount);
    }

    const nextBattlefield = [...state.zones[Zone.Battlefield]];

    const index = nextBattlefield.indexOf(entity);
    assert(index !== -1, 'unable to find entity on battlefield to damage');

    assert(isCreatureObject(entity));

    nextBattlefield[index] = {
        ...nextBattlefield[index],
        markedDamage: nextBattlefield[index].markedDamage + amount,
    };

    return {
        ...state,
        zones: {
            ...state.zones,
            [Zone.Battlefield]: nextBattlefield,
        },
    };
}
