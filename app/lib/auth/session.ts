// app/lib/auth/session.ts
import {createHmac, timingSafeEqual} from 'crypto';

const SESSION_COOKIE = 'artswap_session';
const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 30, // 30 days
};

function sign(value: string, secret: string = process.env.SESSION_SECRET!): string {
    const hmac = createHmac('sha256', secret);
    hmac.update(value);
    return hmac.digest('hex');
}

export function createSessionCookie(userId: string, secret?: string): string {
    const value = `${userId}.${sign(userId, secret)}`;
    const encoded = Buffer.from(value).toString('base64');
    return `${SESSION_COOKIE}=${encoded}; HttpOnly; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge};${COOKIE_OPTIONS.secure ? ' Secure;' : ''} SameSite=Lax`;
}

export function getSessionUserId(cookieHeader: string | null, secret?: string): string | null {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
    if (!match) return null;
    try {
        const decoded = Buffer.from(match[1], 'base64').toString();
        const [userId, sig] = decoded.split('.');
        if (!userId || !sig) return null;
        const expected = sign(userId, secret);
        if (timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
            return userId;
        }
        return null;
    } catch {
        return null;
    }
}

export function destroySessionCookie(): string {
    return `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0;${COOKIE_OPTIONS.secure ? ' Secure;' : ''} SameSite=Lax`;
}
