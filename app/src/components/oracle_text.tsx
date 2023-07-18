import React, {useMemo} from 'react';

import {Card} from '@hmhealey/scryfall/types/card';

import {classNames, ClassName} from '../utils/css';
import ManaSymbol from './mana_symbol';

export interface Props {
    card: Card;
    className?: ClassName;
}

export default function OracleText(props: Props) {
    const oracleText = props.card.oracle_text;

    const rendered = useMemo(() => {
        const parts = [];

        let remaining = oracleText;
        while (remaining) {
            let match = /^\{[^}]*\}/.exec(remaining);
            if (match) {
                parts.push(
                    <ManaSymbol
                        key={parts.length}
                        symbol={match[0]}
                    />,
                );
                remaining = remaining.substring(match[0].length);
                continue;
            }

            match = /^.[^{]*/.exec(remaining);

            parts.push(match[0]);
            remaining = remaining.substring(match[0].length);
        }

        return parts;
    }, [oracleText]);

    return <div className={classNames('OracleText', props.className)}>{rendered}</div>;
}
