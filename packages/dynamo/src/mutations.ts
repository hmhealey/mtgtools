import {Entity, GameObject, GameState, Player, Zone, isCreatureObject, isPlayer} from './game_state';
import {assert} from './utils';

export function move(object: GameObject, from: Zone, to: Zone) {
    return (state: GameState) => {
        const fromZone = state.zones[from];

        const index = fromZone.findIndex((o) => o.id === object.id);
        assert(index !== -1, 'unable to find object to move it from ' + from + ' to ' + to);

        fromZone.splice(index, 1);

        const toZone = state.zones[to];

        toZone.push(object);
    };
}

export function changeLife(player: Player, amount: number) {
    return (state: GameState) => {
        const index = state.players.findIndex((p) => p.id === player.id);
        assert(index !== -1, 'unable to find player to change their life total');

        state.players[index].life += amount;
    };
}

export function applyDamage(entity: Entity, amount: number) {
    return (state: GameState) => {
        if (isPlayer(entity)) {
            return changeLife(entity, -amount)(state);
        }

        const battlefield = state.zones[Zone.Battlefield];

        const index = battlefield.findIndex((e) => e.id === entity.id);
        assert(index !== -1, 'unable to find entity on battlefield to damage');

        assert(isCreatureObject(entity));

        battlefield[index].markedDamage += amount;
    };
}
