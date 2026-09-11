import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'the-olive-table-super-secret-jwt-key-2026'
);

const TOKEN_NAME = 'admin_session';

export interface AdminPayload {
  id: string;
  email: string;
  name: string;
}

export async function createSessionToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AdminPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as AdminPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function verifyAdminRequest(req: NextRequest): Promise<AdminPayload | null> {
  const token = req.cookies.get(TOKEN_NAME)?.value || req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  return await verifySessionToken(token);
}
