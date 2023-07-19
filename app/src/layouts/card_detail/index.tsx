import React from 'react';

import {Card} from '@hmhealey/scryfall/types/card';

import CardImage from '../../components/card_image';
import ManaCost from '../../components/mana_cost';
import OracleText from '../../components/oracle_text';

import './card_detail.css';

export interface Props {
    card: Card;
}

export default function CardDetail(props: Props) {
    return (
        <div className='CardDetail'>
            <CardImage card={props.card} />
            <div className='CardDetailText'>
                <h1 className='CardDetailTitle'>
                    <span className='CardDetailName'>{props.card.name}</span>
                    <ManaCost cost={props.card.mana_cost} />
                </h1>
                <hr />
                <div className='CardDetailTypeLine'>
                    <span>{props.card.type_line}</span>
                    <span>{props.card.set_name}</span>
                </div>
                <hr />
                <OracleText card={props.card} />
                <hr />
                <span>{props.card.flavor_text}</span>
            </div>
        </div>
    );
}
