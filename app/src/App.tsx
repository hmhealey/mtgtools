import React, {FormEvent, useCallback, useRef, useState} from 'react';

import ScryfallClient from '@hmhealey/scryfall/client';
import {Card, ImageType} from '@hmhealey/scryfall/types/card';

import CardImage from './components/card_image';
import './App.css';
import ScryfallWrapper from './components/scryfall_wrapper';
import CardDetail from './layouts/card_detail';
import ManaSymbol from './components/mana_symbol';
import ManaCost from './components/mana_cost';

export default function App() {
    const client = useRef(new ScryfallClient());
    const [card, setCard] = useState<Card | undefined>(undefined);

    const cardNameBox = useRef<HTMLInputElement>();

    const submitCard = useCallback((e: FormEvent) => {
        e.preventDefault();

        client.current.getCardByName(cardNameBox.current.value, {fuzzy: true}).then((response) => {
            if (response.data) {
                setCard(response.data);
            }
        });
    }, []);

    return (
        <ScryfallWrapper>
            <div className='App'>
                <form onSubmit={submitCard}>
                    <input ref={cardNameBox} />
                    <input
                        type='submit'
                        value='Get Card'
                    />
                </form>
                <span>
                    <ManaSymbol symbol={'{R}'} />
                    <ManaSymbol symbol={'{U/B}'} />
                    <ManaSymbol symbol={'{100}'} />
                    <ManaSymbol symbol={'{U/R/P}'} />
                </span>
                <ManaCost cost={'{W}{U}{R}{B}{G}{5}{5}'} />
                {Boolean(card) && <CardDetail card={card} />}
            </div>
        </ScryfallWrapper>
    );
}
