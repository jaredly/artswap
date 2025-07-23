// app/lib/email/templates/group-invitation.tsx
import {Body, Container, Head, Html, Preview, Section, Text} from '@react-email/components';
import * as React from 'react';
import {EmailLayout} from '../components/email-layout';
import {EmailButton} from '../components/button';

interface GroupInvitationProps {
    inviteeName: string;
    inviterName: string;
    groupName: string;
    joinUrl: string;
    expirationDate: string;
}

function GroupInvitationEmail({inviteeName, inviterName, groupName, joinUrl, expirationDate}: GroupInvitationProps) {
    return (
        <Html>
            <Head />
            <Preview>You're invited to join {groupName} on ArtSwap</Preview>
            <Body style={{fontFamily: 'system-ui, sans-serif'}}>
                <EmailLayout>
                    <Container style={{maxWidth: '600px', margin: '0 auto'}}>
                        <Section style={{textAlign: 'center', padding: '40px 20px'}}>
                            <Text style={{fontSize: '24px', fontWeight: 'bold', color: '#1f2937'}}>Invitation to join {groupName}</Text>
                            <Text style={{fontSize: '16px', color: '#6b7280', margin: '20px 0'}}>
                                Hi {inviteeName},<br />
                                {inviterName} has invited you to join the group <strong>{groupName}</strong> on ArtSwap. Click the button below to
                                accept your invitation and get started. This invitation expires on {expirationDate}.
                            </Text>
                            <EmailButton href={joinUrl}>Accept Invitation</EmailButton>
                            <Text style={{fontSize: '14px', color: '#9ca3af', marginTop: '30px'}}>
                                If the button above does not work, copy and paste this link into your browser:
                                <br />
                                <a href={joinUrl} style={{color: '#3b82f6'}}>
                                    {joinUrl}
                                </a>
                            </Text>
                        </Section>
                    </Container>
                </EmailLayout>
            </Body>
        </Html>
    );
}

GroupInvitationEmail.PreviewProps = {
    inviteeName: 'Alex Painter',
    inviterName: 'Jamie Curator',
    groupName: 'Downtown Artists',
    joinUrl: 'https://artswap.com/invite?token=group456',
    expirationDate: '2025-08-01',
};

export default GroupInvitationEmail;
