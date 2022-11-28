import {URI, UUID} from './scryfall';

export type BulkData = {
    object: 'bulk_data';
    id: UUID;
    uri: URI;
    type: string;
    name: string;
    description: string;
    download_uri: URI;
    updated_at: string;
    compressed_size: number;
    content_type: string;
    content_encoding: string;
};

export function isBulkData(o: unknown): o is BulkData {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'bulk_data');
}
