import {ScryfallDate, URI, UUID} from './scryfall';

export type CardMigration = {
    object: 'migration';
    id: UUID;
    uri: URI;
    performed_at: ScryfallDate;
    old_scryfall_id: UUID;
    node?: string;
} & {migration_strategy: 'merge'; new_scryfall_id: UUID} & {migration_strategy: 'delete'};

export function isCardMigration(o: unknown): o is CardMigration {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'migration');
}
