import { NextRequest, NextResponse } from 'next/server';
import { prisma as globalPrisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const prisma = (globalPrisma as any).adminOtp ? globalPrisma : new PrismaClient();

  try {
    const body = await req.json();
    const { name, email } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if email is already an active admin
    const existingUser = await prisma.adminUser.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An admin user with this email address already exists.' },
        { status: 400 }
      );
    }

    // Generate 6-digit random OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiry

    // Save or update OTP record in AdminOtp table
    await prisma.adminOtp.upsert({
      where: { email: cleanEmail },
      update: { code, expiresAt, createdAt: new Date() },
      create: { email: cleanEmail, code, expiresAt },
    });

    console.log(`[OTP Verification Email Sent to ${cleanEmail}]: Code is ${code}`);

    return NextResponse.json({
      success: true,
      message: `OTP verification code generated and sent to ${cleanEmail}`,
      otpCode: code,
      expiresInMinutes: 30,
    });
  } catch (error: any) {
    console.error('Error sending admin OTP:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to send OTP verification code' },
      { status: 500 }
    );
  }
}
