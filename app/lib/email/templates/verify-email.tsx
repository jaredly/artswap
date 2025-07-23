// app/lib/email/templates/verify-email.tsx
import {Body, Container, Head, Html, Preview, Section, Text} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

interface VerificationEmailProps {
    artistName: string;
    verificationUrl: string;
    expirationTime: string;
}

export default function VerificationEmail({artistName, verificationUrl, expirationTime}: VerificationEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address for ArtSwap</Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>Verify your email, {artistName}</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', margin: '20px 0'}}>
                                Please verify your email address to activate your ArtSwap account. This link will expire in {expirationTime}.
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
