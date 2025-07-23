// app/lib/email/components/artwork-card.tsx
import {Section, Img, Text} from '@react-email/components';
import * as React from 'react';

interface ArtworkCardProps {
    image: string;
    title: string;
    artistName?: string;
    description?: string;
}

export function ArtworkCard({image, title, artistName, description}: ArtworkCardProps) {
    return (
        <Section style={{textAlign: 'center', padding: '16px 0'}}>
            <Img src={image} alt={title} width="200" height="200" style={{objectFit: 'cover', borderRadius: '8px', margin: '0 auto'}} />
            <Text style={{fontSize: '16px', fontWeight: 600, marginTop: '10px'}}>{title}</Text>
            {artistName && <Text style={{fontSize: '14px', color: '#6b7280', marginTop: '2px'}}>{artistName}</Text>}
            {description && <Text style={{fontSize: '13px', color: '#9ca3af', marginTop: '2px'}}>{description}</Text>}
        </Section>
    );
}
