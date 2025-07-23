// app/lib/auth/guards.test.ts
import {beforeEach, describe, expect, it, vi} from 'vitest';
import db from '../db';
import {optionalAuth, requireAuth} from './guards';
import * as session from './session';
import * as tokens from './tokens';

vi.mock('./session');
vi.mock('./tokens');
vi.mock('../db', () => ({
    default: {
        artist: {
            findUnique: vi.fn(),
        },
    },
}));

function makeRequest(headers: Record<string, string>): Request {
    return new Request('http://localhost', {headers: new Headers(headers)});
}

describe('guards utils', () => {
    const user = {id: 'user-1', name: 'Test User'};

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('requireAuth returns user for valid session', async () => {
        vi.spyOn(session, 'getSessionUserId').mockReturnValue(user.id);
        (db.artist.findUnique as any).mockResolvedValue(user);

        const req = makeRequest({cookie: 'artswap_session=...'});
        const result = await requireAuth(req);
        expect(result).toEqual(user);
    });

    it('requireAuth returns user for valid JWT', async () => {
        vi.spyOn(session, 'getSessionUserId').mockReturnValue(null);
        vi.spyOn(tokens, 'verifyJWT').mockReturnValue({userId: user.id});
        (db.artist.findUnique as any).mockResolvedValue(user);

        const req = makeRequest({authorization: 'Bearer token'});
        const result = await requireAuth(req);
        expect(result).toEqual(user);
    });

    it('requireAuth throws for missing auth', async () => {
        vi.spyOn(session, 'getSessionUserId').mockReturnValue(null);
        vi.spyOn(tokens, 'verifyJWT').mockReturnValue(null);
        (db.artist.findUnique as any).mockResolvedValue(undefined);

        const req = makeRequest({});
        try {
            await requireAuth(req);
            throw new Error('Should have thrown');
        } catch (err: any) {
            expect(err).toBeInstanceOf(Response);
            expect(err.status).toBe(401);
        }
    });

    it('optionalAuth returns user or null', async () => {
        vi.spyOn(session, 'getSessionUserId').mockReturnValue(user.id);
        (db.artist.findUnique as any).mockResolvedValue(user);

        const req = makeRequest({cookie: 'artswap_session=...'});
        const result = await optionalAuth(req);
        expect(result).toEqual(user);

        vi.spyOn(session, 'getSessionUserId').mockReturnValue(null);
        vi.spyOn(tokens, 'verifyJWT').mockReturnValue(null);

        const req2 = makeRequest({});
        const result2 = await optionalAuth(req2);
        expect(result2).toBeNull();
    });
});
