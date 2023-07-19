import {appendChild} from './ast';
import {OracleNode, parseOracleText, tokenizeOracleText} from './oracle_text';

describe('tokenizeOracleText', () => {
    test('should correctly tokenize the empty string', () => {
        const actual = tokenizeOracleText('');

        expect(actual).toMatchObject([{type: 'start'}, {type: 'end'}]);
    });

    test('should correctly tokenize a simple string', () => {
        const actual = tokenizeOracleText('Lightning Bolt deals 3 damage to any target.');

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Lightning Bolt deals 3 damage to any target.'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize multiple paragraphs', () => {
        const actual = tokenizeOracleText('Ember Shot deals 3 damage to any target.\nDraw a card.');

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Ember Shot deals 3 damage to any target.'},
            {type: 'newline'},
            {type: 'text', text: 'Draw a card.'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize a list of options', () => {
        const actual = tokenizeOracleText(
            'Choose one —\n• Cathartic Pyre deals 3 damage to target creature or planeswalker.\n• Discard up to two cards, then draw that many cards.',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Choose one —'},
            {type: 'newline'},
            {type: 'text', text: '• Cathartic Pyre deals 3 damage to target creature or planeswalker.'},
            {type: 'newline'},
            {type: 'text', text: '• Discard up to two cards, then draw that many cards.'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize reminder text', () => {
        const actual = tokenizeOracleText(
            'Hexproof (This creature can’t be the target of spells or abilities your opponents control.)',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Hexproof '},
            {type: 'open_bracket'},
            {type: 'text', text: 'This creature can’t be the target of spells or abilities your opponents control.'},
            {type: 'close_bracket'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize multiple paragraphs with multiple pieces of reminder text', () => {
        const actual = tokenizeOracleText(
            "First strike (This creature deals combat damage before creatures without first strike.)\nLifelink (Damage dealt by this creature also causes you to gain that much life.)\nFiendslayer Paladin can't be the target of black or red spells your opponents control.",
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'First strike '},
            {type: 'open_bracket'},
            {type: 'text', text: 'This creature deals combat damage before creatures without first strike.'},
            {type: 'close_bracket'},
            {type: 'newline'},
            {type: 'text', text: 'Lifelink '},
            {type: 'open_bracket'},
            {type: 'text', text: 'Damage dealt by this creature also causes you to gain that much life.'},
            {type: 'close_bracket'},
            {type: 'newline'},
            {
                type: 'text',
                text: "Fiendslayer Paladin can't be the target of black or red spells your opponents control.",
            },
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize mana symbols', () => {
        const actual = tokenizeOracleText(
            '{T}, Sacrifice a Forest: Add three mana in any combination of {R} and/or {G}.',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'symbol', symbol: '{T}'},
            {type: 'text', text: ', Sacrifice a Forest: Add three mana in any combination of '},
            {type: 'symbol', symbol: '{R}'},
            {type: 'text', text: ' and/or '},
            {type: 'symbol', symbol: '{G}'},
            {type: 'text', text: '.'},
            {type: 'end'},
        ]);
    });
});

describe('parseOracleText', () => {
    test('should correctly parse the empty string', () => {
        const tokens = tokenizeOracleText('');
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph);

        expect(actual).toEqual(root);
    });

    test('should correctly parse a simple string', () => {
        const tokens = tokenizeOracleText('Lightning Bolt deals 3 damage to any target.');
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph);

        const text: OracleNode = {
            type: 'text',
            text: 'Lightning Bolt deals 3 damage to any target.',
        };
        appendChild(paragraph, text);

        expect(actual).toEqual(root);
    });

    test('should correctly parse multiple paragraphs', () => {
        const tokens = tokenizeOracleText('Ember Shot deals 3 damage to any target.\nDraw a card.');
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        const text1: OracleNode = {
            type: 'text',
            text: 'Ember Shot deals 3 damage to any target.',
        };
        appendChild(paragraph1, text1);

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        const text2: OracleNode = {
            type: 'text',
            text: 'Draw a card.',
        };
        appendChild(paragraph2, text2);

        expect(actual).toEqual(root);
    });

    test('should correctly parse a list of options', () => {
        const tokens = tokenizeOracleText(
            'Choose one —\n• Cathartic Pyre deals 3 damage to target creature or planeswalker.\n• Discard up to two cards, then draw that many cards.',
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        const text1: OracleNode = {
            type: 'text',
            text: 'Choose one —',
        };
        appendChild(paragraph1, text1);

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        const text2: OracleNode = {
            type: 'text',
            text: '• Cathartic Pyre deals 3 damage to target creature or planeswalker.',
        };
        appendChild(paragraph2, text2);

        const paragraph3: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph3);

        const text3: OracleNode = {
            type: 'text',
            text: '• Discard up to two cards, then draw that many cards.',
        };
        appendChild(paragraph3, text3);

        expect(actual).toEqual(root);
    });

    test('should correctly parse reminder text', () => {
        const tokens = tokenizeOracleText(
            'Hexproof (This creature can’t be the target of spells or abilities your opponents control.)',
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph);

        const text: OracleNode = {
            type: 'text',
            text: 'Hexproof ',
        };
        appendChild(paragraph, text);

        const reminderText: OracleNode = {
            type: 'reminder_text',
        };
        appendChild(reminderText, {
            type: 'text',
            text: 'This creature can’t be the target of spells or abilities your opponents control.',
        });
        appendChild(paragraph, reminderText);

        expect(actual).toEqual(root);
    });

    test('should correctly parse multiple paragraphs with multiple pieces of reminder text', () => {
        const tokens = tokenizeOracleText(
            "First strike (This creature deals combat damage before creatures without first strike.)\nLifelink (Damage dealt by this creature also causes you to gain that much life.)\nFiendslayer Paladin can't be the target of black or red spells your opponents control.",
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        const text1: OracleNode = {
            type: 'text',
            text: 'First strike ',
        };
        appendChild(paragraph1, text1);

        const reminderText1: OracleNode = {
            type: 'reminder_text',
        };
        appendChild(reminderText1, {
            type: 'text',
            text: 'This creature deals combat damage before creatures without first strike.',
        });
        appendChild(paragraph1, reminderText1);

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        const text2: OracleNode = {
            type: 'text',
            text: 'Lifelink ',
        };
        appendChild(paragraph2, text2);

        const reminderText2: OracleNode = {
            type: 'reminder_text',
        };
        appendChild(reminderText2, {
            type: 'text',
            text: 'Damage dealt by this creature also causes you to gain that much life.',
        });
        appendChild(paragraph2, reminderText2);

        const paragraph3: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph3);

        const text3: OracleNode = {
            type: 'text',
            text: "Fiendslayer Paladin can't be the target of black or red spells your opponents control.",
        };
        appendChild(paragraph3, text3);

        expect(actual).toEqual(root);
    });

    test('should correctly parse mana symbols', () => {
        const tokens = tokenizeOracleText(
            '{T}, Sacrifice a Forest: Add three mana in any combination of {R} and/or {G}.',
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph);

        appendChild(paragraph, {
            type: 'symbol',
            symbol: '{T}',
        });
        appendChild(paragraph, {
            type: 'text',
            text: ', Sacrifice a Forest: Add three mana in any combination of ',
        });
        appendChild(paragraph, {
            type: 'symbol',
            symbol: '{R}',
        });
        appendChild(paragraph, {
            type: 'text',
            text: ' and/or ',
        });
        appendChild(paragraph, {
            type: 'symbol',
            symbol: '{G}',
        });
        appendChild(paragraph, {
            type: 'text',
            text: '.',
        });

        expect(actual).toEqual(root);
    });
});
