import React, {ReactNode, useMemo} from 'react';

import {Card} from '@hmhealey/scryfall/types/card';

import {classNames, ClassName} from '../utils/css';
import ManaSymbol from './mana_symbol';

export interface Props {
    card: Card;
    className?: ClassName;
}

export default function OracleText(props: Props) {
    const oracleText = props.card.oracle_text;

    const rendered = useMemo(() => renderOracleText(oracleText), [oracleText]);

    return <div className={classNames('OracleText', props.className)}>{rendered}</div>;
}

// const parts: ReactNode[] = [];

// let remaining = text;
// while (remaining) {
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

//     if (!inReminderText) {
//         match = /^\([^)]*\)/.exec(remaining);
//         if (match) {
//             parts.push(<i key={parts.length}>{match[0]}</i>);
//             remaining = remaining.substring(match[0].length);
//             continue;
//         }

//         match = /^\n/.exec(remaining);

//     }

match = /^.+(?=[{(]|$)/.exec(remaining);
//     console.log('matched plain text aaa', remaining, match);

//     parts.push(match[0]);
//     remaining = remaining.substring(match[0].length);
// }

// console.log(text);

// return parts;

function renderOracleText(text: string): ReactNode[] {
    return [];
}

// function parseManaSymbols(text: string) {
//     const parts: ReactNode[] = [];

//     let remaining = text;
//     while (remaining) {
//         let match = matchManaSymbol(remaining);
//         if ()
//     }

//     return parts;
// }

// function matchManaSymbol(text: string) {
//     let match = /^\{[^}]*\}/.exec(text);
//     if (match) {
//         return {
//             symbol: match[0],
//             remaining: text.substring(match[0].length),
//         };
//     }

//     return null;
// }
