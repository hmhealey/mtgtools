import React, {FormEvent, useCallback, useRef, useState} from 'react';

import ScryfallClient from '@hmhealey/scryfall/client';
import {Card} from '@hmhealey/scryfall/types/card';

import './App.css';

function App() {
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
        <div className='App'>
            <form onSubmit={submitCard}>
                <input ref={cardNameBox} />
                <input
                    type='submit'
                    value='Get Card'
                />
            </form>
            <div>{JSON.stringify(card)}</div>
        </div>
    );
}

export default App;
