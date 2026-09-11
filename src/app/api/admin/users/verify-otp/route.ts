import { NextRequest, NextResponse } from 'next/server';
import { prisma as globalPrisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const prisma = (globalPrisma as any).adminOtp ? globalPrisma : new PrismaClient();

  try {
    const body = await req.json();
    const { name, email, password, code } = body;

    if (!email || !code || !name || !password) {
      return NextResponse.json(
        { error: 'Name, email, password, and OTP code are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const inputCode = String(code).trim();

    // Find OTP record
    const otpRecord = await prisma.adminOtp.findUnique({
      where: { email: cleanEmail },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No OTP verification request found for this email. Please request a new code.' },
        { status: 400 }
      );
    }

    if (otpRecord.code.trim() !== inputCode) {
      return NextResponse.json(
        { error: `Invalid OTP code. You entered "${inputCode}", but expected "${otpRecord.code}".` },
        { status: 400 }
      );
    }

    const nowTime = Date.now();
    const expireTime = new Date(otpRecord.expiresAt).getTime();
    if (nowTime > expireTime) {
      return NextResponse.json(
        { error: 'OTP code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Hash password & create admin
    const passwordHash = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.adminUser.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Delete used OTP
    await prisma.adminOtp.delete({ where: { email: cleanEmail } });

    console.log(`[Congratulations Email Sent to ${cleanEmail}]: Mashuup Admin account verified and created!`);

    return NextResponse.json({
      success: true,
      user: newAdmin,
      message: `Congratulations! ${cleanEmail} has been verified and added as an Admin user.`,
    });
  } catch (error: any) {
    console.error('Error verifying admin OTP:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to verify OTP and create admin user' },
      { status: 500 }
    );
  }
}
