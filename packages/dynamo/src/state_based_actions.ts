import {produce} from 'immer';
import {getToughness} from './board_state';
import {GameState, Zone, isCreatureObject} from './game_state';
import {move} from './mutations';
import {assert} from './utils';

export function applyStateBasedActions(state: GameState): GameState {
    return produce(state, (draft) => {
        creaturesDie()(draft);
    });
}

export function creaturesDie() {
    return (state: GameState) => {
        let nextState = state;

        for (const object of state.zones[Zone.Battlefield]) {
            if (!isCreatureObject(object)) {
                continue;
            }

            const toughness = getToughness(state, object);
            if (toughness - object.markedDamage <= 0) {
                move(object, Zone.Battlefield, Zone.Graveyard)(state);

                assert(nextState.zones.graveyard[nextState.zones.graveyard.length - 1] === object);
                nextState.zones.graveyard[nextState.zones.graveyard.length - 1] = {
                    ...object,
                    markedDamage: 0,
                };
            }
        }
    };
}
