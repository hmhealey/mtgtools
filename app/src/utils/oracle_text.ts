import {Node, appendChild, insertSiblingAfter} from './ast';

type OracleTokenTypes =
    | {type: 'start'}
    | {type: 'end'}
    | {type: 'text'; text: string}
    | {type: 'symbol'; symbol: string}
    | {type: 'open_bracket'}
    | {type: 'close_bracket'}
    | {type: 'newline'}
    | {type: 'ability_word'; ability: string};
export type OracleToken = OracleTokenTypes & {start: number; end: number};

type OracleNodeTypes =
    | {type: 'root'}
    | {type: 'paragraph'}
    | {type: 'reminder_text'}
    | {type: 'symbol'; symbol: string}
    | {type: 'text'; text: string}
    | {type: 'ability_word'; ability: string};
export type OracleNode = Node<OracleNodeTypes>;

export interface OracleWalker {
    hasNext(): boolean;
    next(): {node: OracleNode; entering: boolean};
}

export function tokenizeOracleText(text: string): OracleToken[] {
    const tokens: OracleToken[] = [
        {
            type: 'start',
            start: 0,
            end: 0,
        },
    ];

    // TODO AFR cards have ability words in a list of options
    // TODO Treasure Chest has an ability word after a die roll
    // TODO die rolls? sagas? planeswalkers? prototypes?

    let index = 0;
    let remaining = text;
    let startOfParagraph = true;
    while (remaining) {
        let match;

        if (startOfParagraph) {
            match = /^[^\u2014\n]+(?= \u2014 )/.exec(remaining);
            if (match) {
                tokens.push({
                    type: 'ability_word',
                    ability: match[0],
                    start: index,
                    end: index + match[0].length,
                });

                index += match[0].length;
                remaining = remaining.substring(match[0].length);
                continue;
            }
        }

        match = /^\{[^}]*\}/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'symbol',
                symbol: match[0],
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
            startOfParagraph = false;
            continue;
        }

        match = /^\(/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'open_bracket',
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
            startOfParagraph = false;
            continue;
        }

        match = /^\)/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'close_bracket',
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
            startOfParagraph = false;
            continue;
        }

        match = /^\n/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'newline',
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
            startOfParagraph = true;
            continue;
        }

        match = /^.[^{()\n]*/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'text',
                text: match[0],
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
            startOfParagraph = false;
            continue;
        }

        throw new Error('Unable to match any more oracle text in `' + remaining + '`');
    }

    tokens.push({
        type: 'end',
        start: text.length,
        end: text.length,
    });

    return tokens;
}

export function parseOracleText(tokens: OracleToken[]): OracleNode {
    let root: OracleNode = {
        type: 'root',
    };
    appendChild(root, {
        type: 'paragraph',
    });

    let index = 0;
    let tip = root.firstChild;
    while (index < tokens.length && tip.parent) {
        const token = tokens[index];

        // This all assumes that the array of tokens are validly nested. In particular:
        // 1. Brackets are matched and never nested
        // 2. Newlines don't appear in brackets
        switch (token.type) {
            case 'start':
            case 'end':
                break;

            case 'text':
                appendChild(tip, {
                    type: 'text',
                    text: token.text,
                });
                break;
            case 'symbol':
                appendChild(tip, {
                    type: 'symbol',
                    symbol: token.symbol,
                });
                break;
            case 'ability_word':
                appendChild(tip, {
                    type: 'ability_word',
                    ability: token.ability,
                });
                break;

            case 'open_bracket': {
                const newReminderText: OracleNode = {
                    type: 'reminder_text',
                };
                appendChild(tip, newReminderText);
                tip = newReminderText;
                break;
            }
            case 'close_bracket':
                tip = tip.parent;
                break;

            case 'newline': {
                insertSiblingAfter(tip, {
                    type: 'paragraph',
                });
                tip = tip.nextSibling;
                break;
            }

            default:
                throw new Error('Unrecognized token:' + JSON.stringify(token));
        }

        index += 1;
    }

    return root;
}
