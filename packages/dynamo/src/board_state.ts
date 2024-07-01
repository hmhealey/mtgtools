import {CreatureObject, Entity, GameState, Zone, isGameObject} from './game_state';
import {assert} from './utils';

export function isInZone(state: GameState, entity: Entity, zone: Zone): boolean {
    return isGameObject(entity) && state.zones[zone].includes(entity);
}

export function getBasePower(creature: CreatureObject): number {
    assert(creature.card.power, 'unable to get base power of card without power: ' + creature.card.id);

    const basePower = parseInt(creature.card.power, 10);

    assert(!isNaN(basePower), 'unable to handle non-integer power: ' + creature.card.power);

    return basePower;
}

export function getPower(state: GameState, creature: CreatureObject): number {
    const basePower = getBasePower(creature);

    if (!isInZone(state, creature, Zone.Battlefield)) {
        return basePower;
    }

    return basePower;
}

export function getBaseToughness(creature: CreatureObject): number {
    assert(creature.card.toughness, 'unable to get base toughness of card without toughness: ' + creature.card.id);

    const baseToughness = parseInt(creature.card.toughness, 10);

    assert(!isNaN(baseToughness), 'unable to handle non-integer toughness: ' + creature.card.toughness);

    return baseToughness;
}

export function getToughness(state: GameState, creature: CreatureObject): number {
    const basePower = getBasePower(creature);

    if (!isInZone(state, creature, Zone.Battlefield)) {
        return basePower;
    }

    return basePower;
}
