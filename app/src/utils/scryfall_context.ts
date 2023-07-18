import {createContext, useContext} from 'react';

import ScryfallClient from '@hmhealey/scryfall/client';

import {CardSymbol} from '@hmhealey/scryfall/types/card_symbol';

export type ContextValue = {
    client: ScryfallClient;
    symbols: Map<string, CardSymbol>;
};

export function makeContext() {
    return {
        client: new ScryfallClient(),
        symbols: new Map(),
    };
}

export const Context = createContext<ContextValue>(makeContext());

export function useScryfallContext() {
    return useContext(Context);
}

export function useScryfallClient() {
    return useScryfallContext().client;
}
