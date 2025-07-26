// app/routes/__auth.test.tsx
import {describe, it, expect, vi, beforeAll, beforeEach} from 'vitest';
import {action as loginAction} from './login';
import {action as signupAction} from './signup';
import {action as logoutAction} from './logout';
import {action as forgotPasswordAction} from './forgot-password';
import {action as resetPasswordAction} from './reset-password';
import {loader as verifyEmailLoader} from './verify-email';
import {createArtist, deleteArtist} from '../lib/db/artist';
import {hashPassword} from '../lib/auth/password';
import prisma from '~/lib/db';
import {createJWT, getSessionUserId} from '~/lib/auth';
import {success} from 'zod';

function mockRequest(form: Record<string, string>) {
    const params = new URLSearchParams(form);
    const req = new Request('http://localhost', {
        method: 'POST',
        body: params,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    Object.defineProperty(req, 'formData', {
        value: async () => ({
            get: (key: string) => form[key],
        }),
    });
    return req;
}

describe('Auth Routes', () => {
    beforeEach(async () => {
        await prisma.artist.deleteMany();
    });
    it('login: missing fields', async () => {
        const res = await loginAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('Email and password are required.');
    });

    it('login: invalid credentials', async () => {
        const res = await loginAction({request: mockRequest({email: 'bad@example.com', password: 'wrong'}), params: {}, context: {}});
        expect(await res.text()).toContain('Invalid email or password');
    });

    it('login: valid credentials', async () => {
        // Create a user for login
        const password = 'testpass123';
        const artist = await createArtist({
            email: 'test-login_auth@example.com',
            passwordHash: await hashPassword(password, 1),
            fullName: 'Login Test User',
        });
        const res = await loginAction({request: mockRequest({email: artist.email, password}), params: {}, context: {}});
        expect(res.status).toBe(302);
        expect(res.headers.get('Set-Cookie')).toContain('artswap_session=');
        await deleteArtist(artist.id);
    });

    it('signup: missing fields', async () => {
        const res = await signupAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('All fields are required.');
    });

    it('signup: duplicate email', async () => {
        const artist = await createArtist({
            email: 'test@example.com',
            passwordHash: await hashPassword('lolok', 1),
            fullName: 'Login Test User',
        });

        const res = await signupAction({
            request: mockRequest({
                email: 'test@example.com',
                password: 'password123',
                fullName: 'Test',
            }),
            params: {},
            context: {},
        });
        expect(await res.text()).toContain('Email already registered');
        await deleteArtist(artist.id);
    });

    it('signup: valid signup', async () => {
        // Use a random email to avoid collision
        const email = `user${Math.random().toString(36).slice(2)}@example.com`;
        const res = await signupAction({
            request: mockRequest({
                email,
                password: 'password123',
                fullName: 'User',
            }),
            params: {},
            context: {},
        });
        expect(res.status).toBe(302);
        expect(res.headers.get('Set-Cookie')).toContain('artswap_session=');
        const id = getSessionUserId(res.headers.get('Set-Cookie'));
        expect(id).not.toBeNull();
        await deleteArtist(id!);
    });

    it('logout: destroys session', async () => {
        const req = new Request('http://localhost', {method: 'POST'});
        Object.defineProperty(req, 'formData', {
            value: async () => ({}),
        });
        const res = await logoutAction({request: req, params: {}, context: {}});
        expect(res.headers.get('Set-Cookie')).toContain('artswap_session=;');
    });

    it('logout: already logged out', async () => {
        const req = new Request('http://localhost', {method: 'POST'});
        Object.defineProperty(req, 'formData', {
            value: async () => ({}),
        });
        // Simulate no session cookie
        const res = await logoutAction({request: req, params: {}, context: {}});
        expect(res.headers.get('Set-Cookie')).toContain('artswap_session=;');
    });

    it('forgot-password: missing email', async () => {
        const res = await forgotPasswordAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('Email is required.');
    });

    it('forgot-password: invalid email', async () => {
        const res = await forgotPasswordAction({request: mockRequest({email: 'notfound@example.com'}), params: {}, context: {}});
        expect(await res.text()).toContain('No account found');
    });

    it('forgot-password: valid email', async () => {
        const artist = await createArtist({
            email: 'test@example.com',
            passwordHash: await hashPassword('lolok', 1),
            fullName: 'Login Test User',
        });
        const res = await forgotPasswordAction({request: mockRequest({email: 'test@example.com'}), params: {}, context: {}});
        expect(await res.text()).toContain('A password reset link has been sent');
        await deleteArtist(artist.id);
    });

    it('reset-password: missing fields', async () => {
        const res = await resetPasswordAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('Token and new password are required.');
    });

    it('reset-password: invalid token', async () => {
        const res = await resetPasswordAction({request: mockRequest({token: 'badtoken', password: 'newpass'}), params: {}, context: {}});
        expect(await res.text()).toContain('Invalid or expired reset token.');
    });

    it('reset-password: valid token', async () => {
        const artist = await createArtist({
            email: 'test@example.com',
            passwordHash: await hashPassword('lolok', 1),
            fullName: 'Login Test User',
        });

        const token = createJWT({artistId: artist.id, type: 'password-reset'}, '1h');
        // Replace with a valid token if available
        const res = await resetPasswordAction({request: mockRequest({token, password: 'newpass'}), params: {}, context: {}});
        expect(await res.json()).toMatchObject({
            success: true,
        });

        await deleteArtist(artist.id);
    });

    it('verify-email: missing token', async () => {
        const req = new Request('http://localhost/verify-email');
        const res = await verifyEmailLoader({request: req, params: {}, context: {}});
        expect(res.success).toBe(false);
        expect(res.message).toContain('Verification token missing.');
    });

    it('verify-email: invalid token', async () => {
        const req = new Request('http://localhost/verify-email?token=badtoken');
        const res = await verifyEmailLoader({request: req, params: {}, context: {}});
        expect(res.success).toBe(false);
        expect(res.message).toContain('Invalid or expired verification token.');
    });

    it('verify-email: valid token', async () => {
        const artist = await createArtist({
            email: 'test@example.com',
            passwordHash: await hashPassword('lolok', 1),
            fullName: 'Login Test User',
        });

        const token = createJWT({artistId: artist.id, type: 'verify-email'}, '1h');
        // Replace with a valid token if available
        const req = new Request('http://localhost/verify-email?token=' + token);
        const res = await verifyEmailLoader({request: req, params: {}, context: {}});
        expect(res).toMatchObject({success: true});

        await deleteArtist(artist.id);
    });
});
