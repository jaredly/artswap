// app/lib/auth/password.test.ts
import {describe, it, expect} from 'vitest';
import {hashPassword, verifyPassword} from './password';

describe('password utils', () => {
    it('hashes and verifies a password', async () => {
        const password = 'SuperSecret123!';
        const hash = await hashPassword(password, 1);
        expect(hash).toBeTypeOf('string');
        expect(hash.length).toBeGreaterThan(10);

        const valid = await verifyPassword(password, hash);
        expect(valid).toBe(true);

        const invalid = await verifyPassword('WrongPassword', hash);
        expect(invalid).toBe(false);
    });
});
