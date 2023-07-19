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
            {type: 'bullet'},
            {type: 'text', text: 'Cathartic Pyre deals 3 damage to target creature or planeswalker.'},
            {type: 'newline'},
            {type: 'bullet'},
            {type: 'text', text: 'Discard up to two cards, then draw that many cards.'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize text following a list of options', () => {
        const actual = tokenizeOracleText(
            'Choose one —\n• Search your library for up to two creature cards, reveal them, put them into your hand, then shuffle.\n• Put up to two creature cards from your hand onto the battlefield.\nEntwine {2} (Choose both if you pay the entwine cost.)',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Choose one —'},
            {type: 'newline'},
            {type: 'bullet'},
            {
                type: 'text',
                text: 'Search your library for up to two creature cards, reveal them, put them into your hand, then shuffle.',
            },
            {type: 'newline'},
            {type: 'bullet'},
            {type: 'text', text: 'Put up to two creature cards from your hand onto the battlefield.'},
            {type: 'newline'},
            {type: 'text', text: 'Entwine '},
            {type: 'symbol', symbol: '{2}'},
            {type: 'text', text: ' '},
            {type: 'open_bracket'},
            {type: 'text', text: 'Choose both if you pay the entwine cost.'},
            {type: 'close_bracket'},
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

    test('should correctly tokenize mana symbols in reminder text', () => {
        const actual = tokenizeOracleText(
            'Vigilance\nExtort (Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain that much life.)',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Vigilance'},
            {type: 'newline'},
            {type: 'text', text: 'Extort '},
            {type: 'open_bracket'},
            {type: 'text', text: 'Whenever you cast a spell, you may pay '},
            {type: 'symbol', symbol: '{W/B}'},
            {type: 'text', text: '. If you do, each opponent loses 1 life and you gain that much life.'},
            {type: 'close_bracket'},
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize ability words at the beginning of a paragraph', () => {
        const actual = tokenizeOracleText(
            'Landfall — Whenever a land enters the battlefield under your control, add one mana of any color.',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'ability_word', ability: 'Landfall'},
            {
                type: 'text',
                text: ' — Whenever a land enters the battlefield under your control, add one mana of any color.',
            },
            {type: 'end'},
        ]);
    });

    test('should correctly tokenize flavour words at the beginning of a paragraph', () => {
        const actual = tokenizeOracleText('Trample\nKeen Senses — When Owlbear enters the battlefield, draw a card.');

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Trample'},
            {type: 'newline'},
            {type: 'ability_word', ability: 'Keen Senses'},
            {type: 'text', text: ' — When Owlbear enters the battlefield, draw a card.'},
            {type: 'end'},
        ]);
    });

    test('should be able to tokenize multiple flavour words', () => {
        const actual = tokenizeOracleText(
            'Berzerker — Khârn the Betrayer attacks or blocks each combat if able.\nSigil of Corruption — When you lose control of Khârn the Betrayer, draw two cards.\nThe Betrayer — If damage would be dealt to Khârn the Betrayer, prevent that damage and an opponent of your choice gains control of it.',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'ability_word', ability: 'Berzerker'},
            {type: 'text', text: ' — Khârn the Betrayer attacks or blocks each combat if able.'},
            {type: 'newline'},
            {type: 'ability_word', ability: 'Sigil of Corruption'},
            {type: 'text', text: ' — When you lose control of Khârn the Betrayer, draw two cards.'},
            {type: 'newline'},
            {type: 'ability_word', ability: 'The Betrayer'},
            {
                type: 'text',
                text: ' — If damage would be dealt to Khârn the Betrayer, prevent that damage and an opponent of your choice gains control of it.',
            },
            {type: 'end'},
        ]);
    });

    test('should be able to differentiate between keyword abilities with costs and ability words (Sedgemoor Witch)', () => {
        const actual = tokenizeOracleText(
            'Menace\nWard—Pay 3 life. (Whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays 3 life.)\nMagecraft — Whenever you cast or copy an instant or sorcery spell, create a 1/1 black and green Pest creature token with "When this creature dies, you gain 1 life."',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'text', text: 'Menace'},
            {type: 'newline'},
            {type: 'text', text: 'Ward—Pay 3 life. '},
            {type: 'open_bracket'},
            {
                type: 'text',
                text: 'Whenever this creature becomes the target of a spell or ability an opponent controls, counter it unless that player pays 3 life.',
            },
            {type: 'close_bracket'},
            {type: 'newline'},
            {type: 'ability_word', ability: 'Magecraft'},
            {
                type: 'text',
                text: ' — Whenever you cast or copy an instant or sorcery spell, create a 1/1 black and green Pest creature token with "When this creature dies, you gain 1 life."',
            },
            {type: 'end'},
        ]);
    });

    test('should be able to differentiate between keyword abilities with costs and ability words (Gathan Raiders)', () => {
        const actual = tokenizeOracleText(
            'Hellbent — Gathan Raiders gets +2/+2 as long as you have no cards in hand.\nMorph—Discard a card. (You may cast this card face down as a 2/2 creature for {3}. Turn it face up any time for its morph cost.)',
        );

        expect(actual).toMatchObject([
            {type: 'start'},
            {type: 'ability_word', ability: 'Hellbent'},
            {type: 'text', text: ' — Gathan Raiders gets +2/+2 as long as you have no cards in hand.'},
            {type: 'newline'},
            {type: 'text', text: 'Morph—Discard a card. '},
            {type: 'open_bracket'},
            {type: 'text', text: 'You may cast this card face down as a 2/2 creature for '},
            {type: 'symbol', symbol: '{3}'},
            {type: 'text', text: '. Turn it face up any time for its morph cost.'},
            {type: 'close_bracket'},
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

        appendChild(paragraph, {
            type: 'text',
            text: 'Lightning Bolt deals 3 damage to any target.',
        });

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

        appendChild(paragraph1, {
            type: 'text',
            text: 'Ember Shot deals 3 damage to any target.',
        });

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        appendChild(paragraph2, {
            type: 'text',
            text: 'Draw a card.',
        });

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

        appendChild(paragraph1, {
            type: 'text',
            text: 'Choose one —',
        });

        const list: OracleNode = {
            type: 'list',
        };
        appendChild(root, list);

        const listItem1: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem1);

        appendChild(listItem1, {
            type: 'text',
            text: 'Cathartic Pyre deals 3 damage to target creature or planeswalker.',
        });

        const listItem2: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem2);

        appendChild(listItem2, {
            type: 'text',
            text: 'Discard up to two cards, then draw that many cards.',
        });

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

        appendChild(paragraph1, {
            type: 'text',
            text: 'Choose one —',
        });

        const list: OracleNode = {
            type: 'list',
        };
        appendChild(root, list);

        const listItem1: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem1);

        appendChild(listItem1, {
            type: 'text',
            text: 'Cathartic Pyre deals 3 damage to target creature or planeswalker.',
        });

        const listItem2: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem2);

        appendChild(listItem2, {
            type: 'text',
            text: 'Discard up to two cards, then draw that many cards.',
        });

        expect(actual).toEqual(root);
    });

    test('should correctly parse text following a list of options', () => {
        const tokens = tokenizeOracleText(
            'Choose one —\n• Search your library for up to two creature cards, reveal them, put them into your hand, then shuffle.\n• Put up to two creature cards from your hand onto the battlefield.\nEntwine {2} (Choose both if you pay the entwine cost.)',
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        appendChild(paragraph1, {
            type: 'text',
            text: 'Choose one —',
        });

        const list: OracleNode = {
            type: 'list',
        };
        appendChild(root, list);

        const listItem1: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem1);

        appendChild(listItem1, {
            type: 'text',
            text: 'Search your library for up to two creature cards, reveal them, put them into your hand, then shuffle.',
        });

        const listItem2: OracleNode = {
            type: 'list_item',
        };
        appendChild(list, listItem2);

        appendChild(listItem2, {
            type: 'text',
            text: 'Put up to two creature cards from your hand onto the battlefield.',
        });

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        appendChild(paragraph2, {
            type: 'text',
            text: 'Entwine ',
        }),
            appendChild(paragraph2, {type: 'symbol', symbol: '{2}'});
        appendChild(paragraph2, {type: 'text', text: ' '});

        const reminderText: OracleNode = {
            type: 'reminder_text',
        };
        appendChild(paragraph2, reminderText);

        appendChild(reminderText, {type: 'text', text: 'Choose both if you pay the entwine cost.'});

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

        appendChild(paragraph, {
            type: 'text',
            text: 'Hexproof ',
        });

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

        appendChild(paragraph1, {
            type: 'text',
            text: 'First strike ',
        });

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

        appendChild(paragraph2, {
            type: 'text',
            text: 'Lifelink ',
        });

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

        appendChild(paragraph3, {
            type: 'text',
            text: "Fiendslayer Paladin can't be the target of black or red spells your opponents control.",
        });

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

    test('should correctly parse mana symbols in reminder text', () => {
        const tokens = tokenizeOracleText(
            'Vigilance\nExtort (Whenever you cast a spell, you may pay {W/B}. If you do, each opponent loses 1 life and you gain that much life.)',
        );
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        appendChild(paragraph1, {type: 'text', text: 'Vigilance'});

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        appendChild(paragraph2, {type: 'text', text: 'Extort '});

        const reminderText: OracleNode = {
            type: 'reminder_text',
        };
        appendChild(paragraph2, reminderText);

        appendChild(reminderText, {
            type: 'text',
            text: 'Whenever you cast a spell, you may pay ',
        });
        appendChild(reminderText, {type: 'symbol', symbol: '{W/B}'});
        appendChild(reminderText, {
            type: 'text',
            text: '. If you do, each opponent loses 1 life and you gain that much life.',
        });

        expect(actual).toEqual(root);
    });

    test('should correctly parse ability words the beginning of a paragraph', () => {
        const tokens = tokenizeOracleText(
            'Landfall — Whenever a land enters the battlefield under your control, add one mana of any color.',
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
            type: 'ability_word',
            ability: 'Landfall',
        });
        appendChild(paragraph, {
            type: 'text',
            text: ' — Whenever a land enters the battlefield under your control, add one mana of any color.',
        });

        expect(actual).toEqual(root);
    });

    test('should correctly parse flavour words at the beginning of a paragraph', () => {
        const tokens = tokenizeOracleText('Trample\nKeen Senses — When Owlbear enters the battlefield, draw a card.');
        const actual = parseOracleText(tokens);

        const root: OracleNode = {
            type: 'root',
        };

        const paragraph1: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph1);

        appendChild(paragraph1, {
            type: 'text',
            text: 'Trample',
        });

        const paragraph2: OracleNode = {
            type: 'paragraph',
        };
        appendChild(root, paragraph2);

        appendChild(paragraph2, {
            type: 'ability_word',
            ability: 'Keen Senses',
        });
        appendChild(paragraph2, {
            type: 'text',
            text: ' — When Owlbear enters the battlefield, draw a card.',
        });

        expect(actual).toEqual(root);
    });
});
