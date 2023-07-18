import React from 'react';
import {useScryfallContext} from '../../utils/scryfall_context';

import {ClassName, classNames} from '../../utils/css';

import './mana_symbol.css';

export interface Props {
    className?: ClassName;
    symbol: string;
}

export default function ManaSymbol(props: Props) {
    const context = useScryfallContext();

    const symbolObject = context.symbols.get(props.symbol) ?? context.symbols.get('{0}');

    if (!symbolObject) {
        return null;
    }

    return (
        <img
            className={classNames('ManaSymbol', props.className)}
            src={symbolObject.svg_uri}
        />
    );
}
