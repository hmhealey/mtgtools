import React from 'react';
import ManaSymbol from './mana_symbol';

import {ClassName, classNames} from '../utils/css';

export interface Props {
    className?: ClassName;
    cost: string;
}

export default function ManaCost(props: Props) {
    const symbols = props.cost.split(/(?=\{)/);

    return (
        <span className={classNames('ManaCost', props.className)}>
            {symbols.map((symbol, i) => (
                <ManaSymbol
                    key={i}
                    symbol={symbol}
                />
            ))}
        </span>
    );
}
