// app/lib/auth/session.test.ts
import {describe, it, expect} from 'vitest';
import {createSessionCookie, getSessionUserId, destroySessionCookie} from './session';

describe('session utils', () => {
    const userId = 'user-123';
    const secret = 'test-session-secret';

    it('creates and parses a session cookie', () => {
        const cookie = createSessionCookie(userId, secret);
        // Simulate a request header
        const parsed = getSessionUserId(cookie, secret);
        expect(parsed).toBe(userId);
    });

    it('returns null for tampered cookie', () => {
        const cookie = createSessionCookie(userId, secret);
        // Tamper with the signature (break HMAC) in the base64-encoded value
        const match = cookie.match(/artswap_session=([^;]+)/);
        expect(match).not.toBeNull();
        const encoded = match![1];
        const decoded = Buffer.from(encoded, 'base64').toString();
        const [uid, sig] = decoded.split('.');
        const tamperedValue = Buffer.from(`${uid}.invalidsig`).toString('base64');
        const tampered = cookie.replace(encoded, tamperedValue);
        const parsed = getSessionUserId(tampered, secret);
        expect(parsed).toBeNull();
    });

    it('returns null for missing cookie', () => {
        expect(getSessionUserId(null)).toBeNull();
        expect(getSessionUserId('')).toBeNull();
    });

    it('destroys session cookie', () => {
        const destroyed = destroySessionCookie();
        expect(destroyed).toContain('Max-Age=0');
    });
});
