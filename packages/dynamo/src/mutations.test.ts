import {produce} from 'immer';

import {Card} from '@hmhealey/scryfall/types/card';

import {EntityType, Zone, makeEmptyGameState} from './game_state';
import {applyDamage, changeLife} from './mutations';

describe('changeLife', () => {
    test("should change a player's life", () => {
        const state = makeEmptyGameState();
        state.players = [
            {
                type: EntityType.Player,
                life: 20,
            },
            {
                type: EntityType.Player,
                life: 20,
            },
        ];

        const nextState = produce(state, changeLife(state.players[0], -3));

        expect(nextState).not.toBe(state);
        expect(nextState.players).not.toBe(state.players);
        expect(nextState.players[0]).not.toBe(state.players[0]);
        expect(nextState.players[0].life).toEqual(17);
        expect(nextState.players[1]).toBe(state.players[1]);
        expect(nextState.zones).toBe(state.zones);
    });
});

describe('applyDamage', () => {
    test("should lower a player's life", () => {
        const state = makeEmptyGameState();
        state.players = [
            {
                type: EntityType.Player,
                life: 10,
            },
        ];

        const nextState = produce(state, applyDamage(state.players[0], 10));

        expect(nextState).not.toBe(state);
        expect(nextState.players).not.toBe(state.players);
        expect(nextState.players[0]).not.toBe(state.players[0]);
        expect(nextState.players[0].life).toEqual(0);
        expect(nextState.zones).toBe(state.zones);
    });

    test('should damage a creature', () => {
        const state = makeEmptyGameState();
        state.players = [
            {
                type: EntityType.Player,
                life: 20,
            },
        ];
        state.zones.battlefield = [
            {
                type: EntityType.Card,
                controller: state.players[0],
                card: {type_line: 'Creature'} as Card,
                markedDamage: 0,
            },
        ];

        const nextState = produce(state, applyDamage(state.zones.battlefield[0], 2));

        expect(nextState).not.toBe(state);
        expect(nextState.players).toBe(state.players);
        expect(nextState.zones).not.toBe(state.zones);
        expect(nextState.zones[Zone.Battlefield]).not.toBe(state.zones[Zone.Battlefield]);
        expect(nextState.zones[Zone.Battlefield][0]).not.toBe(state.zones[Zone.Battlefield][0]);
        expect(nextState.zones[Zone.Battlefield][0].markedDamage).toEqual(2);
        expect(nextState.zones[Zone.Library]).toBe(state.zones[Zone.Library]);
    });
});
