// app/lib/auth/tokens.ts
import jwt from 'jsonwebtoken';
import {randomBytes} from 'crypto';

const JWT_EXPIRES_IN = '7d'; // Default: 7 days

export function createJWT(payload: object, expiresIn: string = JWT_EXPIRES_IN, secret: string = process.env.JWT_SECRET!): string {
    return jwt.sign(payload, secret, {expiresIn: expiresIn as '7d'});
}

export function verifyJWT<T = any>(token: string, secret: string = process.env.JWT_SECRET!): T | null {
    try {
        return jwt.verify(token, secret) as T;
    } catch {
        return null;
    }
}

export function generateVerificationToken(length = 32): string {
    return randomBytes(length).toString('hex');
}
