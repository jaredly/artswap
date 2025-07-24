// app/lib/email/templates/welcome.tsx
import {Body, Container, Head, Html, Preview, Section, Text} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

import type {WelcomeEmailProps} from '../types';

function WelcomeEmail({artistName, verificationUrl}: WelcomeEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Welcome to ArtSwap! Confirm your email to get started.</Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>Welcome to ArtSwap, {artistName}!</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', margin: '20px 0'}}>
                                Thanks for joining ArtSwap. Please confirm your email address to activate your account and start swapping art with
                                local artists.
                            </Text>
                            <EmailButton href={verificationUrl}>Verify Email</EmailButton>
                            <Text style={{fontSize: '14px', color: '#9ca3af', marginTop: '30px'}}>
                                If the button above does not work, copy and paste this link into your browser:
                                <br />
                                <a href={verificationUrl} style={{color: '#3b82f6'}}>
                                    {verificationUrl}
                                </a>
                            </Text>
                        </Section>
                    </Container>
                </EmailLayout>
            </Body>
        </Html>
    );
}

WelcomeEmail.PreviewProps = {
    artistName: 'Alex Painter',
    verificationUrl: 'https://artswap.com/verify?token=abc123',
};

export default WelcomeEmail;
