import React, {ReactNode, useEffect, useState} from 'react';

import ScryfallClient from '@hmhealey/scryfall/client';
import {CardSymbol} from '@hmhealey/scryfall/types/card_symbol';

import {Context, makeContext} from '../utils/scryfall_context';

export default function ScryfallWrapper(props: {children: ReactNode}) {
    const [context, setContext] = useState(makeContext());

    useLoadCardSymbols(context.client, (symbols: Map<string, CardSymbol>) => {
        setContext((nextContext) => ({
            ...nextContext,
            symbols,
        }));
    });

    if (!context.symbols) {
        return 'Loading...';
    }

    return <Context.Provider value={context}>{props.children}</Context.Provider>;
}

function useLoadCardSymbols(client: ScryfallClient, callback: (symbols: Map<string, CardSymbol>) => void) {
    useEffect(() => {
        client.getAllCardSymbols().then((response) => {
            if (response.error) {
                return;
            }

            const symbols = new Map();
            for (const symbol of response.data.data) {
                symbols.set(symbol.symbol, symbol);
            }

            callback(symbols);
        });
    }, [client]);
}
