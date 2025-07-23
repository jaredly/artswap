// app/lib/email/templates/match-notification.tsx
import {Body, Container, Head, Html, Preview, Section, Text, Img, Hr} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

interface MatchNotificationProps {
    artistName: string;
    matchedArtworkTitle: string;
    matchedArtworkImage: string;
    yourArtworkTitle: string;
    yourArtworkImage: string;
    eventName: string;
    viewMatchUrl: string;
}

function MatchNotification({
    artistName,
    matchedArtworkTitle,
    matchedArtworkImage,
    yourArtworkTitle,
    yourArtworkImage,
    eventName,
    viewMatchUrl,
}: MatchNotificationProps) {
    return (
        <Html>
            <Head />
            <Preview>🎉 You have a new art match in {eventName}!</Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>🎨 Art Match Found!</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', marginBottom: '30px'}}>
                                Congratulations {artistName}! You and another artist have mutually liked each other's work in{' '}
                                <strong>{eventName}</strong>.
                            </Text>
                            <Hr style={{margin: '30px 0'}} />
                            <Section style={{display: 'flex', justifyContent: 'space-around', margin: '30px 0'}}>
                                <div style={{textAlign: 'center', flex: 1}}>
                                    <Text style={{fontSize: '14px', color: '#9ca3af', marginBottom: '10px'}}>Your Artwork</Text>
                                    <Img
                                        src={yourArtworkImage}
                                        alt={yourArtworkTitle}
                                        style={{width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                                    />
                                    <Text style={{fontSize: '16px', fontWeight: 600, marginTop: '10px'}}>{yourArtworkTitle}</Text>
                                </div>
                                <div style={{textAlign: 'center', flex: 1}}>
                                    <Text style={{fontSize: '14px', color: '#9ca3af', marginBottom: '10px'}}>Matched Artwork</Text>
                                    <Img
                                        src={matchedArtworkImage}
                                        alt={matchedArtworkTitle}
                                        style={{width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px'}}
                                    />
                                    <Text style={{fontSize: '16px', fontWeight: 600, marginTop: '10px'}}>{matchedArtworkTitle}</Text>
                                </div>
                            </Section>
                            <EmailButton href={viewMatchUrl}>View Your Match</EmailButton>
                            <Text style={{fontSize: '14px', color: '#9ca3af', marginTop: '30px'}}>
                                Connect with your matched artist and explore each other's work!
                            </Text>
                        </Section>
                    </Container>
                </EmailLayout>
            </Body>
        </Html>
    );
}

MatchNotification.PreviewProps = {
    artistName: 'Alex Painter',
    matchedArtworkTitle: 'Sunset Over Water',
    matchedArtworkImage: 'https://artswap.com/images/artwork2.jpg',
    yourArtworkTitle: 'City Lights',
    yourArtworkImage: 'https://artswap.com/images/artwork1.jpg',
    eventName: 'July Art Swap',
    viewMatchUrl: 'https://artswap.com/matches/123',
};

export default MatchNotification;
