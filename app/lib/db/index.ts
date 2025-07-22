// app/lib/db/index.ts
import {PrismaClient} from '../../../generated/prisma/client';

// In development, prevent multiple instances of PrismaClient due to hot-reloading
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // biome-ignore lint/suspicious/noAssignInExpressions: allow global assignment for dev
    if (!(globalThis as any).prisma) {
        (globalThis as any).prisma = new PrismaClient();
    }
    prisma = (globalThis as any).prisma;
}

export default prisma;
