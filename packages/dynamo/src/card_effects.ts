import {Color} from '@hmhealey/scryfall/types/color';

import {getPower, isInZone} from './board_state';
import {Entity, GameObject, GameState, Zone, isCreatureObject, isPlayer} from './game_state';
import {applyDamage, changeLife, move} from './mutations';
import {assert} from './utils';

// filter definitions

interface TargetFilter<T, ExtraParams extends any[] = []> {
    (state: GameState, entity: Entity, ...ExtraParams): T | undefined;
}

function anyCreature(state: GameState, entity: Entity): GameObject | undefined {
    if (isInZone(state, entity, Zone.Battlefield) && isCreatureObject(entity)) {
        return entity;
    }

    return undefined;
}
anyCreature satisfies TargetFilter<GameObject>;

function anyNonBlackCreature(state: GameState, entity: Entity): GameObject | undefined {
    const creature = anyCreature(state, entity);
    if (creature && creature.card.colors?.includes(Color.Black)) {
        return creature;
    }

    return undefined;
}
anyNonBlackCreature satisfies TargetFilter<GameObject>;

function anyDamageableTarget(state: GameState, entity: Entity): Entity | undefined {
    if (isPlayer(entity)) {
        return entity;
    }

    if (isInZone(state, entity, Zone.Battlefield)) {
        if (isCreatureObject(entity) /*|| isPlaneswalkerObject(entity) || isBattleObject(entity)*/) {
            return entity;
        }
    }

    return undefined;
}
anyDamageableTarget satisfies TargetFilter<Entity>;

// effect definitions

class Effect<ExtraParams extends any[]> {
    constructor(private _apply: (GameState, ...ExtraParams) => GameState) {}
}

class TargetedEffect<T, ExtraParams extends any[]> {
    constructor(
        private _filter: TargetFilter<T, ExtraParams>,
        private _apply: (GameState, T, ...ExtraParams) => GameState,
    ) {}

    public apply(state: GameState, target: Entity, ...extra: ExtraParams) {
        const filteredTarget = this._filter(state, target, ...extra);

        assert(filteredTarget, 'unably to apply effect to target');

        return this._apply(state, filteredTarget, ...extra);
    }
}

const murder = new TargetedEffect(anyCreature, (state: GameState, target: GameObject) => {
    return move(state, target, Zone.Battlefield, Zone.Graveyard);
});
const doomBlade = new TargetedEffect(anyNonBlackCreature, (state: GameState, target: GameObject) => {
    return move(state, target, Zone.Battlefield, Zone.Graveyard);
});
const swordsToPlowshares = new TargetedEffect(anyCreature, (state: GameState, target: GameObject) => {
    const controller = target.controller;

    state = move(state, target, Zone.Battlefield, Zone.Exile);
    state = changeLife(state, controller, getPower(state, target));
    return state;
});
const pathToExile = new TargetedEffect(anyCreature, (state: GameState, target: GameObject) => {
    const controller = target.controller;

    state = move(state, target, Zone.Battlefield, Zone.Exile);
    // state = searchForBasicTapped(state, controller); // TODO
    return state;
});
const lightningBolt = new TargetedEffect(anyDamageableTarget, (state: GameState, target: Entity) => {
    return applyDamage(state, target, 3);
});
