import React, {ReactNode, useMemo} from 'react';

import {Card} from '@hmhealey/scryfall/types/card';

import {classNames, ClassName} from '../utils/css';
import {OracleNode, parseOracleText, tokenizeOracleText} from '../utils/oracle_text';
import {walkAST} from '../utils/ast';
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

function renderOracleText(text: string): JSX.Element {
    const tokens = tokenizeOracleText(text);
    const ast = parseOracleText(tokens);

    let stack = [{children: []}];

    const walker = walkAST(ast);
    for (const event of walker) {
        if (event.entering) {
            stack.push({children: []});
        } else {
            const tip = stack.pop();

            const renderedNode = renderOracleNode(event.node, tip.children);
            stack[stack.length - 1].children.push(renderedNode);
        }
    }

    return <>{stack[0].children}</>;
}

function renderOracleNode(node: OracleNode, children: JSX.Element[]) {
    switch (node.type) {
        case 'root':
            return <>{children}</>;
        case 'paragraph':
            return <p>{children}</p>;

        case 'list':
            return <ul>{children}</ul>;
        case 'list_item':
            return <li>{children}</li>;

        case 'text':
            return node.text;
        case 'reminder_text':
            return (
                <i>
                    {'('}
                    {children}
                    {')'}
                </i>
            );
        case 'ability_word':
            return <i>{node.ability}</i>;

        case 'symbol':
            return <ManaSymbol symbol={node.symbol} />;

        default:
            throw new Error('Unrecognized node type:' + JSON.stringify(node));
    }
}
