// app/lib/db/index.ts
import {PrismaClient} from '../../../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {prisma?: PrismaClient};

// biome-ignore lint/suspicious/noAssignInExpressions: no thanks
const prisma = globalForPrisma.prisma ?? (globalForPrisma.prisma = new PrismaClient());

export default prisma;
