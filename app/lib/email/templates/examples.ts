// app/lib/email/templates/examples.ts

export const welcome = {
    artistName: 'Alex Painter',
    verificationUrl: 'https://artswap.com/verify?token=abc123',
};

export const verifyEmail = {
    artistName: 'Alex Painter',
    verificationUrl: 'https://artswap.com/verify?token=abc123',
    expirationTime: '24 hours',
};

export const passwordReset = {
    artistName: 'Alex Painter',
    resetUrl: 'https://artswap.com/reset?token=xyz789',
    expirationTime: '1 hour',
};

export const groupInvitation = {
    inviteeName: 'Alex Painter',
    inviterName: 'Jamie Curator',
    groupName: 'Downtown Artists',
    joinUrl: 'https://artswap.com/invite?token=group456',
    expirationDate: '2025-08-01',
};

export const matchNotification = {
    artistName: 'Alex Painter',
    matchedArtworkTitle: 'Sunset Over Water',
    matchedArtworkImage: 'https://artswap.com/images/artwork2.jpg',
    yourArtworkTitle: 'City Lights',
    yourArtworkImage: 'https://artswap.com/images/artwork1.jpg',
    eventName: 'July Art Swap',
    viewMatchUrl: 'https://artswap.com/matches/123',
};

export const eventPhaseChange = {
    artistName: 'Alex Painter',
    eventName: 'July Art Swap',
    oldPhase: 'submission',
    newPhase: 'voting',
    actionUrl: 'https://artswap.com/events/789',
    actionText: 'Go to Event',
};
