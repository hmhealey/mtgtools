export type Catalog = {
    object: 'catalog';
    uri: URI;
    total_values: number;
    data: string[];
};

export function isCatalog(o: unknown): o is Catalog {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'catalog');
}

export type List<T, NotFoundType = never> = {
    object: 'list';
    data: T[];
    has_more?: boolean;
    next_page?: URI;
    not_found: NotFoundType[];
    total_card?: string;
    warnings: string[];
};

export function isList(o: unknown): o is List<unknown> {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'list');
}

export type ScryfallDate = string; // string of the form `yyyy-mm-dd`

export type ScryfallError = {
    object: 'error';
    status: number;
    code: string;
    details: string;
    type?: string;
    warnings?: string[];
};

export function isScryfallError(o: unknown): o is ScryfallError {
    return Boolean(o && typeof o === 'object' && (o as any).object === 'error');
}

export type ScryfallResponse<T> =
    | {
          data: T;
          error: undefined;
      }
    | {
          data: undefined;
          error: ScryfallError;
      };

export function isSuccessResponse(o: unknown): o is {data: unknown} {
    return Boolean(o && typeof o === 'object' && 'data' in o && (o as any).data && 'error' in o && !(o as any).error);
}

export function isErrorResponse(o: unknown): o is {error: unknown} {
    return Boolean(o && typeof o === 'object' && 'data' in o && !(o as any).data && 'error' in o && (o as any).error);
}

export type URI = string;

export type UUID = string;
