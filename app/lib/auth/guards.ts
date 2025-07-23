// app/lib/auth/guards.ts

import db from '../db';
import {getSessionUserId} from './session';
import {verifyJWT} from './tokens';

export async function requireAuth(request: Request) {
    const cookie = request.headers.get('cookie');
    let userId = getSessionUserId(cookie);

    // Fallback to JWT in Authorization header
    if (!userId) {
        const auth = request.headers.get('authorization') || '';
        if (auth.startsWith('Bearer ')) {
            const token = auth.slice(7);
            const payload = verifyJWT<{userId: string}>(token);
            userId = payload?.userId || null;
        }
    }

    if (!userId) {
        throw new Response('Unauthorized', {status: 401});
    }

    if (typeof userId !== 'string') {
        throw new Response('Unauthorized', {status: 401});
    }

    const user = await db.artist.findUnique({where: {id: userId}});
    if (!user) {
        throw new Response('User not found', {status: 401});
    }
    return user;
}

export async function optionalAuth(request: Request) {
    const cookie = request.headers.get('cookie');
    let userId = getSessionUserId(cookie);

    if (!userId) {
        const auth = request.headers.get('authorization');
        if (auth && auth.startsWith('Bearer ')) {
            const token = auth.slice(7);
            const payload = verifyJWT<{userId: string}>(token);
            userId = payload?.userId || null;
        }
    }

    if (!userId) return null;
    return db.artist.findUnique({where: {id: userId}});
}
