// app/lib/db/index.ts
import {PrismaClient} from '../../../generated/prisma/client';

// In development, prevent multiple instances of PrismaClient due to hot-reloading
let prisma: PrismaClient;

declare global {
    var _prisma: PrismaClient;
}

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else if (process.env.NODE_ENV === 'test') {
    process.env.DATABASE_URL = 'file:memory:?cache=shared';
    prisma = new PrismaClient();
} else {
    if (!globalThis._prisma) {
        globalThis._prisma = new PrismaClient();
    }
    prisma = globalThis._prisma;
}

export default prisma;
