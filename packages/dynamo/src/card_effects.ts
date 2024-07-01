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
    constructor(private _apply: (...ExtraParams) => (GameState) => GameState | void) {}
}

class TargetedEffect<T, ExtraParams extends any[]> {
    constructor(
        private _filter: TargetFilter<T, ExtraParams>,
        private _apply: (T, ...ExtraParams) => (GameState) => GameState | void,
    ) {}

    public apply(target: Entity, ...extra: ExtraParams) {
        return (state: GameState) => {
            const filteredTarget = this._filter(state, target, ...extra);

            assert(filteredTarget, 'unably to apply effect to target');

            return this._apply(filteredTarget, ...extra);
        };
    }
}

const murder = new TargetedEffect(anyCreature, (target: GameObject) => {
    return move(target, Zone.Battlefield, Zone.Graveyard);
});
const doomBlade = new TargetedEffect(anyNonBlackCreature, (target: GameObject) => {
    return move(target, Zone.Battlefield, Zone.Graveyard);
});
const swordsToPlowshares = new TargetedEffect(anyCreature, (target: GameObject) => {
    return (state: GameState) => {
        const controller = target.controller;

        move(target, Zone.Battlefield, Zone.Exile)(state);
        changeLife(controller, getPower(state, target))(state);
    };
});
const pathToExile = new TargetedEffect(anyCreature, (target: GameObject) => {
    return (state: GameState) => {
        const controller = target.controller;

        move(target, Zone.Battlefield, Zone.Exile)(state);
        // searchForBasicTapped(state, controller); // TODO
    };
});
const lightningBolt = new TargetedEffect(anyDamageableTarget, (target: Entity) => {
    return applyDamage(target, 3);
});
