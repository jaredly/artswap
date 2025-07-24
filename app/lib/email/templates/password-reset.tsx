// app/lib/email/templates/password-reset.tsx
import {Body, Container, Head, Html, Preview, Section, Text} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

import type {PasswordResetProps} from '../types';

function PasswordResetEmail({artistName, resetUrl, expirationTime}: PasswordResetProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset your ArtSwap password</Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>Password Reset Request</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', margin: '20px 0'}}>
                                Hi {artistName},<br />
                                We received a request to reset your ArtSwap password. Click the button below to set a new password. This link will
                                expire in {expirationTime}.
                            </Text>
                            <EmailButton href={resetUrl}>Reset Password</EmailButton>
                            <Text style={{fontSize: '14px', color: '#9ca3af', marginTop: '30px'}}>
                                If you did not request a password reset, you can safely ignore this email.
                                <br />
                                If the button above does not work, copy and paste this link into your browser:
                                <br />
                                <a href={resetUrl} style={{color: '#3b82f6'}}>
                                    {resetUrl}
                                </a>
                            </Text>
                        </Section>
                    </Container>
                </EmailLayout>
            </Body>
        </Html>
    );
}

PasswordResetEmail.PreviewProps = {
    artistName: 'Alex Painter',
    resetUrl: 'https://artswap.com/reset?token=xyz789',
    expirationTime: '1 hour',
};

export default PasswordResetEmail;
