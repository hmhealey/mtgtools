import {getToughness} from './board_state';
import {GameState, Zone, isCreatureObject} from './game_state';
import {move} from './mutations';
import {assert} from './utils';

export function applyStateBasedActions(state: GameState): GameState {
    let nextState = creaturesDie(state);
    return nextState;
}

export function creaturesDie(state: GameState): GameState {
    let nextState = state;

    for (const object of state.zones[Zone.Battlefield]) {
        if (!isCreatureObject(object)) {
            continue;
        }

        const toughness = getToughness(state, object);
        if (toughness - object.markedDamage <= 0) {
            nextState = move(state, object, Zone.Battlefield, Zone.Graveyard);

            assert(nextState.zones.graveyard[nextState.zones.graveyard.length - 1] === object);
            nextState.zones.graveyard[nextState.zones.graveyard.length - 1] = {
                ...object,
                markedDamage: 0,
            };
        }
    }

    return nextState;
}
