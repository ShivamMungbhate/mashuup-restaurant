import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.startsWith('file:') && !envUrl.startsWith('file:/') && !envUrl.startsWith('file:\\')) {
    const relativeFileName = envUrl.replace('file:', '').replace(/^\.\//, '');
    const absolutePath = path.join(process.cwd(), 'prisma', relativeFileName);
    return `file:${absolutePath}`;
  }
  if (!envUrl) {
    return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  }
  return envUrl;
}

export const prisma =
  globalForPrisma.prisma && (globalForPrisma.prisma as any).adminOtp
    ? globalForPrisma.prisma
    : new PrismaClient({
        datasources: {
          db: {
            url: getDatabaseUrl(),
          },
        },
        log: ['error', 'warn'],
      });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
