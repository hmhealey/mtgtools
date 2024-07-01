import {produce} from 'immer';

import {grizzlyBears} from '@hmhealey/scryfall/test_data';

import {EntityType, Zone, makeEmptyGameState} from './game_state';
import {applyStateBasedActions} from './state_based_actions';

describe('applyStateBasedActions', () => {
    test('creatures with marked damage greater than its toughness should die', () => {
        const state = makeEmptyGameState();
        state.players = [
            {
                type: EntityType.Player,
                id: 'player1',
                life: 20,
            },
        ];
        state.zones[Zone.Battlefield] = [
            {
                type: EntityType.Card,
                id: 'card1',
                card: grizzlyBears,
                controller: state.players[0],
                markedDamage: 0,
            },
            {
                type: EntityType.Card,
                id: 'card2',
                card: grizzlyBears,
                controller: state.players[0],
                markedDamage: 13,
            },
        ];

        const nextState = produce(state, applyStateBasedActions);

        expect(nextState).not.toBe(state);
        expect(nextState.players).toBe(state.players);
        expect(nextState.zones).not.toBe(state.zones);
        expect(nextState.zones[Zone.Library]).toBe(state.zones[Zone.Library]);
        expect(nextState.zones[Zone.Battlefield]).not.toBe(state.zones[Zone.Battlefield]);
        expect(nextState.zones[Zone.Battlefield].length).toEqual(1);
        expect(nextState.zones[Zone.Battlefield][0]).toBe(state.zones[Zone.Battlefield][0]);
        expect(nextState.zones[Zone.Graveyard]).not.toBe(state.zones[Zone.Graveyard]);
        expect(nextState.zones[Zone.Graveyard][0]).toEqual({...state.zones[Zone.Battlefield][1], markedDamage: 0});
    });
});
