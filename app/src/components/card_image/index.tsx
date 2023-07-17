import React, {ReactNode} from 'react';

import {Card, ImageType} from '@hmhealey/scryfall/types/card';

import {classNames} from '../../utils/css';
import {snakeToTitleCase} from '../../utils/text';

import './card_image.css';

export interface Props {
    card?: Card;
    face?: number;
    size?: ImageType;
}

export default function CardImage(props: Props) {
    const card = props.card;
    const face = props.face ?? 0;
    const size = props.size ?? ImageType.Normal;

    const className = classNames('CardImage', snakeToTitleCase(size));

    if (!card) {
        return <CardImageError className={className}>{'Card not found'}</CardImageError>;
    }

    let imageUris = card.image_uris;
    if (card.card_faces) {
        imageUris = card.card_faces?.[face].image_uris ?? imageUris;
    }

    if (imageUris && size in imageUris) {
        return (
            <img
                className={className}
                src={imageUris[size]}
                title={card.name}
            />
        );
    } else {
        return <CardImageError className={className}>{'Card image not found'}</CardImageError>;
    }
}

function CardImageError(props: {children: ReactNode; className: string}) {
    return <div className={classNames(props.className, 'CardImageError')}>{props.children}</div>;
}
