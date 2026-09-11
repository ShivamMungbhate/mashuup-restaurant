import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma && (globalForPrisma.prisma as any).adminOtp
    ? globalForPrisma.prisma
    : new PrismaClient({
        log: ['error', 'warn'],
      });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
