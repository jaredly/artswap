// app/lib/email/types.ts

export interface WelcomeEmailProps {
    artistName: string;
    verificationUrl: string;
}

export interface VerificationEmailProps {
    artistName: string;
    verificationUrl: string;
    expirationTime: string;
}

export interface PasswordResetProps {
    artistName: string;
    resetUrl: string;
    expirationTime: string;
}

export interface GroupInvitationProps {
    inviteeName: string;
    inviterName: string;
    groupName: string;
    joinUrl: string;
    expirationDate: string;
}

export interface EventPhaseChangeProps {
    artistName: string;
    eventName: string;
    oldPhase: string;
    newPhase: string;
    actionUrl: string;
    actionText: string;
}

export interface MatchNotificationProps {
    artistName: string;
    matchedArtworkTitle: string;
    matchedArtworkImage: string;
    yourArtworkTitle: string;
    yourArtworkImage: string;
    eventName: string;
    viewMatchUrl: string;
}
