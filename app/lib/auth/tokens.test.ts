// app/lib/auth/tokens.test.ts
import {describe, expect, it} from 'vitest';
import {createJWT, generateVerificationToken, verifyJWT} from './tokens';

describe('tokens utils', () => {
    const secret = 'test-jwt-secret';

    it('creates and verifies a JWT', () => {
        const payload = {userId: 'abc123', role: 'artist'};
        const token = createJWT(payload, '1h', secret);
        expect(token).toBeTypeOf('string');
        const decoded = verifyJWT<typeof payload>(token, secret);
        expect(decoded).toMatchObject(payload);
    });

    it('returns null for invalid JWT', () => {
        const invalid = verifyJWT('not.a.jwt', secret);
        expect(invalid).toBeNull();
    });

    it('generates a random verification token', () => {
        const token1 = generateVerificationToken();
        const token2 = generateVerificationToken();
        expect(token1).toBeTypeOf('string');
        expect(token1.length).toBeGreaterThan(10);
        expect(token1).not.toBe(token2);
    });
});
