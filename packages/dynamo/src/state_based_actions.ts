import {getToughness} from './board_state';
import {GameState, Zone, isCreatureObject} from './game_state';
import {move} from './mutations';
import {assert} from './utils';

export function applyStateBasedActions(state: GameState) {
    creaturesDie(state);
}

export function creaturesDie(state: GameState) {
    for (const object of state.zones[Zone.Battlefield]) {
        if (!isCreatureObject(object)) {
            continue;
        }

        const toughness = getToughness(state, object);
        if (toughness - object.markedDamage <= 0) {
            move(object, Zone.Battlefield, Zone.Graveyard)(state);

            assert(state.zones.graveyard[state.zones.graveyard.length - 1] === object);
            state.zones.graveyard[state.zones.graveyard.length - 1].markedDamage = 0;
        }
    }
}
