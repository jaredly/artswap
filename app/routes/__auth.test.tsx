// app/routes/__auth.test.tsx
import {describe, it, expect, vi} from 'vitest';
import {action as loginAction} from './login';
import {action as signupAction} from './signup';
import {action as logoutAction} from './logout';
import {action as forgotPasswordAction} from './forgot-password';
import {action as resetPasswordAction} from './reset-password';
import {loader as verifyEmailLoader} from './verify-email';

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
    it('login: missing fields', async () => {
        const res = await loginAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('Email and password are required.');
    });

    it('login: invalid credentials', async () => {
        const res = await loginAction({request: mockRequest({email: 'bad@example.com', password: 'wrong'}), params: {}, context: {}});
        expect(await res.text()).toContain('Invalid email or password');
    });

    it('login: valid credentials', async () => {
        // Replace with valid test credentials if available
        const res = await loginAction({request: mockRequest({email: 'test@example.com', password: 'password123'}), params: {}, context: {}});
        // Accept either redirect or success message
        expect(res.status === 302 || (await res.text()).includes('Welcome')).toBe(true);
    });

    it('signup: missing fields', async () => {
        const res = await signupAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('All fields are required.');
    });

    it('signup: duplicate email', async () => {
        const res = await signupAction({
            request: mockRequest({email: 'test@example.com', password: 'password123', name: 'Test'}),
            params: {},
            context: {},
        });
        expect(await res.text()).toContain('Email already exists');
    });

    it('signup: valid signup', async () => {
        // Use a random email to avoid collision
        const email = `user${Math.random().toString(36).slice(2)}@example.com`;
        const res = await signupAction({request: mockRequest({email, password: 'password123', name: 'User'}), params: {}, context: {}});
        expect(res.status === 302 || (await res.text()).includes('Verify your email')).toBe(true);
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
        const res = await forgotPasswordAction({request: mockRequest({email: 'test@example.com'}), params: {}, context: {}});
        expect(await res.text()).toContain('Password reset email sent');
    });

    it('reset-password: missing fields', async () => {
        const res = await resetPasswordAction({request: mockRequest({}), params: {}, context: {}});
        expect(await res.text()).toContain('Token and new password are required.');
    });

    it('reset-password: invalid token', async () => {
        const res = await resetPasswordAction({request: mockRequest({token: 'badtoken', password: 'newpass'}), params: {}, context: {}});
        expect(await res.text()).toContain('Invalid or expired token');
    });

    it('reset-password: valid token', async () => {
        // Replace with a valid token if available
        const res = await resetPasswordAction({request: mockRequest({token: 'validtoken', password: 'newpass'}), params: {}, context: {}});
        expect(res.status === 302 || (await res.text()).includes('Password reset successful')).toBe(true);
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
        expect(res.message).toContain('Invalid or expired token');
    });

    it('verify-email: valid token', async () => {
        // Replace with a valid token if available
        const req = new Request('http://localhost/verify-email?token=validtoken');
        const res = await verifyEmailLoader({request: req, params: {}, context: {}});
        expect(res.success === true || res.message.includes('Email verified')).toBe(true);
    });
});
