import {Node, appendChild, insertSiblingAfter} from './ast';

type OracleTokenTypes =
    | {type: 'start'}
    | {type: 'end'}
    | {type: 'text'; text: string}
    | {type: 'symbol'; symbol: string}
    | {type: 'open_bracket'}
    | {type: 'close_bracket'}
    | {type: 'newline'}
    | {type: 'ability_word'; ability: string}
    | {type: 'bullet'};
export type OracleToken = OracleTokenTypes & {start: number; end: number};

type OracleNodeTypes =
    | {type: 'root'}
    | {type: 'paragraph'}
    | {type: 'reminder_text'}
    | {type: 'symbol'; symbol: string}
    | {type: 'text'; text: string}
    | {type: 'ability_word'; ability: string}
    | {type: 'list'}
    | {type: 'list_item'};
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

    // TODO Treasure Chest has an ability word after a die roll
    // TODO die rolls? sagas? planeswalkers? prototypes?

    let index = 0;
    let remaining = text;
    let startOfLine = true;
    while (remaining) {
        let match;

        if (startOfLine) {
            match = /^\u2022 /.exec(remaining);
            if (match) {
                tokens.push({
                    type: 'bullet',
                    start: index,
                    end: index + match[0].length,
                });

                index += match[0].length;
                remaining = remaining.substring(match[0].length);
                startOfLine = false;

                // Don't continue here since we want to be able to parse an ability word immediately after a bullet
            }

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
                startOfLine = false;
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
            startOfLine = false;
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
            startOfLine = false;
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
            startOfLine = false;
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
            startOfLine = true;
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
            startOfLine = false;
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
        // 3. Bullets only appear immediately after a newline
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

            case 'bullet': {
                const newListItem: OracleNode = {
                    type: 'list_item',
                };
                appendChild(tip, newListItem);
                tip = newListItem;
                break;
            }

            case 'newline': {
                const nextToken = tokens[index + 1];

                if (nextToken.type === 'bullet') {
                    if (tip.type === 'list_item') {
                        // Exit the list item back to the list
                        tip = tip.parent;
                    } else {
                        // Assume we're in a paragraph, so start a new list
                        insertSiblingAfter(tip, {
                            type: 'list',
                        });
                        tip = tip.nextSibling;
                    }
                } else {
                    if (tip.type === 'list_item') {
                        // Exit the list item and list
                        tip = tip.parent;

                        insertSiblingAfter(tip, {
                            type: 'paragraph',
                        });
                        tip = tip.nextSibling;
                    } else {
                        // Start a new paragraph
                        insertSiblingAfter(tip, {
                            type: 'paragraph',
                        });
                        tip = tip.nextSibling;
                    }
                }
                break;
            }

            default:
                throw new Error('Unrecognized token:' + JSON.stringify(token));
        }

        index += 1;
    }

    return root;
}
