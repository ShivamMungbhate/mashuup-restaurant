import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL;

  // If a cloud database URL (Postgres / Turso / Supabase) is provided, use it
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl;
  }

  // On Vercel serverless environment, the bundle directory is read-only.
  // We copy dev.db to /tmp/dev.db which is fully writeable in AWS Lambda / Vercel functions.
  if (process.env.VERCEL || (process.env.NODE_ENV === 'production' && typeof window === 'undefined')) {
    try {
      const tmpDbPath = '/tmp/dev.db';
      const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

      if (!fs.existsSync(tmpDbPath) && fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      }

      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn('Could not copy SQLite database to /tmp:', e);
    }
  }

  if (envUrl && envUrl.startsWith('file:') && !envUrl.startsWith('file:/') && !envUrl.startsWith('file:\\')) {
    const relativeFileName = envUrl.replace('file:', '').replace(/^\.\//, '');
    const absolutePath = path.join(process.cwd(), 'prisma', relativeFileName);
    return `file:${absolutePath}`;
  }

  return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
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
