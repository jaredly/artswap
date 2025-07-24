// app/lib/email/send.ts

import React from 'react';
import {render} from '@react-email/render';
import Mailgun from 'mailgun.js';
import WelcomeEmail from './templates/welcome';
import MatchNotification from './templates/match-notification';
import VerificationEmail from './templates/verify-email';
import PasswordResetEmail from './templates/password-reset';
import GroupInvitationEmail from './templates/group-invitation';
import EventPhaseChangeEmail from './templates/event-phase-change';
import FormData from 'form-data';
import type {WelcomeEmailProps, VerificationEmailProps, PasswordResetProps, GroupInvitationProps, EventPhaseChangeProps} from './types';

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY!,
});

interface EmailData {
    to: string;
    subject: string;
    template: React.ComponentType<any>;
    props: any;
}

export async function sendEmail({to, subject, template: Template, props}: EmailData) {
    try {
        const html = await render(React.createElement(Template, props));
        const text = await render(React.createElement(Template, props), {plainText: true});

        const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
            from: process.env.MAILGUN_FROM_EMAIL!,
            to: [to],
            subject,
            html,
            text,
            'o:tracking': 'yes',
            'o:tracking-clicks': 'yes',
            'o:tracking-opens': 'yes',
        });

        return {success: true, messageId: result.id};
    } catch (error: any) {
        console.error('Email send failed:', error);
        return {success: false, error: error.message};
    }
}

export const emailService = {
    sendWelcome: (to: string, props: WelcomeEmailProps) => sendEmail({to, subject: 'Welcome to ArtSwap!', template: WelcomeEmail, props}),

    sendMatchNotification: (
        to: string,
        props: {
            artistName: string;
            matchedArtworkTitle: string;
            matchedArtworkImage: string;
            yourArtworkTitle: string;
            yourArtworkImage: string;
            eventName: string;
            viewMatchUrl: string;
        },
    ) => sendEmail({to, subject: '🎨 You have a new art match!', template: MatchNotification, props}),

    sendVerification: (to: string, props: VerificationEmailProps) =>
        sendEmail({to, subject: 'Verify your ArtSwap account', template: VerificationEmail, props}),

    sendPasswordReset: (to: string, props: PasswordResetProps) =>
        sendEmail({to, subject: 'Reset your ArtSwap password', template: PasswordResetEmail, props}),

    sendGroupInvitation: (to: string, props: GroupInvitationProps) =>
        sendEmail({to, subject: "You've been invited to join a group on ArtSwap", template: GroupInvitationEmail, props}),

    sendEventPhaseChange: (to: string, props: EventPhaseChangeProps) =>
        sendEmail({to, subject: 'ArtSwap Event Phase Changed', template: EventPhaseChangeEmail, props}),
};
