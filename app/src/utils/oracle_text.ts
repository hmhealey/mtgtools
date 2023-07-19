import {Node, appendChild, insertSiblingAfter} from './ast';

type OracleTokenTypes =
    | {type: 'start'}
    | {type: 'end'}
    | {type: 'text'; text: string}
    | {type: 'symbol'; symbol: string}
    | {type: 'open_bracket'}
    | {type: 'close_bracket'}
    | {type: 'newline'};
export type OracleToken = OracleTokenTypes & {start: number; end: number};

type OracleNodeTypes =
    | {type: 'root'}
    | {type: 'paragraph'}
    | {type: 'reminder_text'}
    | {type: 'symbol'; symbol: string}
    | {type: 'text'; text: string};
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

    let index = 0;
    let remaining = text;
    while (remaining) {
        let match = /^\{[^}]*\}/.exec(remaining);
        if (match) {
            tokens.push({
                type: 'symbol',
                symbol: match[0],
                start: index,
                end: index + match[0].length,
            });

            index += match[0].length;
            remaining = remaining.substring(match[0].length);
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
    // let current = [root, root.firstChild];
    // let tip = current[current.length - 1];
    // while (index <= tokens.length && current.length > 1) {
    let tip = root.firstChild;
    while (index < tokens.length && tip.parent) {
        const token = tokens[index];

        // This all assumes that the array of tokens are validly nested. In particular:
        // 1. Brackets are matched and never nested
        // 2. Newlines don't appear in brackets
        switch (token.type) {
            case 'start':
            case 'end':
                // TODO these tokens might not be needed
                break;

            case 'text':
                appendChild(tip, {
                    type: 'text',
                    text: token.text,
                });
                // tip.children.push({
                //     type: 'text',
                //     text: token.text,
                // });
                break;
            case 'symbol':
                appendChild(tip, {
                    type: 'symbol',
                    symbol: token.symbol,
                });
                // tip.children.push({
                //     type: 'symbol',
                //     symbol: token.symbol,
                // });
                break;

            case 'open_bracket': {
                const newReminderText: OracleNode = {
                    type: 'reminder_text',
                };
                appendChild(tip, newReminderText);
                tip = newReminderText;
                // tip.children.push({
                //     type: 'reminder_text',
                //     children: [],
                // });
                // tip = tip.children[tip.children.length - 1];
                break;
            }
            case 'close_bracket':
                tip = tip.parent;
                // current.pop();
                // tip = current[current.length - 1];
                break;

            case 'newline': {
                insertSiblingAfter(tip, {
                    type: 'paragraph',
                });
                tip = tip.nextSibling;
                // current.pop();
                // tip = current[current.length - 1];

                // const newParagraph: OracleNode = {
                //     type: 'paragraph',
                //     children: [],
                // };

                // current.push(newParagraph);
                // tip.children.push(newParagraph);
                // tip = current[current.length - 1];
                break;
            }

            default:
                throw new Error('Unrecognized token:' + JSON.stringify(token));
        }

        index += 1;
    }

    return root;
}
