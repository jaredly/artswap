// app/lib/auth/password.ts
import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

/**
 * Hash a plain text password using bcrypt.
 */
export async function hashPassword(password: string, roundsOverride = BCRYPT_ROUNDS): Promise<string> {
    return bcrypt.hash(password, roundsOverride);
}

/**
 * Compare a plain text password to a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
