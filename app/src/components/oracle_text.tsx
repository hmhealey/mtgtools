import React, {ReactNode, useMemo} from 'react';

import {Card} from '@hmhealey/scryfall/types/card';

import {classNames, ClassName} from '../utils/css';
// import ManaSymbol from './mana_symbol';

export interface Props {
    card: Card;
    className?: ClassName;
}

export default function OracleText(props: Props) {
    const oracleText = props.card.oracle_text;

    const rendered = useMemo(() => renderOracleText(oracleText), [oracleText]);

    return <div className={classNames('OracleText', props.className)}>{rendered}</div>;
}

function renderOracleText(text: string): ReactNode[] {
    return [];
}
