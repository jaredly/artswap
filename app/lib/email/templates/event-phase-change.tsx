// app/lib/email/templates/event-phase-change.tsx
import {Body, Container, Head, Html, Preview, Section, Text} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

import type {EventPhaseChangeProps} from '../types';

function EventPhaseChangeEmail({artistName, eventName, oldPhase, newPhase, actionUrl, actionText}: EventPhaseChangeProps) {
    return (
        <Html>
            <Head />
            <Preview>
                {eventName} phase changed: {newPhase}
            </Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>Event Phase Updated</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', margin: '20px 0'}}>
                                Hi {artistName},<br />
                                The event <strong>{eventName}</strong> has changed from <strong>{oldPhase}</strong> to <strong>{newPhase}</strong>.
                            </Text>
                            <EmailButton href={actionUrl}>{actionText}</EmailButton>
                            <Text style={{fontSize: '14px', color: '#9ca3af', marginTop: '30px'}}>
                                If the button above does not work, copy and paste this link into your browser:
                                <br />
                                <a href={actionUrl} style={{color: '#3b82f6'}}>
                                    {actionUrl}
                                </a>
                            </Text>
                        </Section>
                    </Container>
                </EmailLayout>
            </Body>
        </Html>
    );
}

EventPhaseChangeEmail.PreviewProps = {
    artistName: 'Alex Painter',
    eventName: 'July Art Swap',
    oldPhase: 'submission',
    newPhase: 'voting',
    actionUrl: 'https://artswap.com/events/789',
    actionText: 'Go to Event',
};

export default EventPhaseChangeEmail;
