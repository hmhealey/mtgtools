export type Catalog = {
    object: 'catalog';
    uri: URI;
    total_values: number;
    data: string[];
};

export type List<T, NotFoundType = never> = {
    object: 'list';
    data: T[];
    has_more?: boolean;
    next_page?: URI;
    not_found?: NotFoundType[];
    total_card?: string;
    warnings: string[];
};

export type ScryfallDate = string; // string of the form `yyyy-mm-dd`

export type ScryfallError = {
    status: number;
    code: string;
    details: string;
    type?: string;
    warnings?: string[];
};

export type URI = string;

export type UUID = string;
