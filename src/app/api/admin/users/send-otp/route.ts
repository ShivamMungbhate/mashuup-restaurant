import { randomInt } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

// Stops text typed in the name field from being read as HTML in the email
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email } = body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      !name.trim() ||
      !email.trim()
    ) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const cleanName = name.trim();
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

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 500 }
      );
    }

    // Generate a secure 6-digit OTP
    const code = randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    // Save OTP to DB
    await prisma.adminOtp.upsert({
      where: { email: cleanEmail },
      update: { code, expiresAt, createdAt: new Date() },
      create: { email: cleanEmail, code, expiresAt },
    });

    // Send OTP by email. The code is never logged or returned to the browser.
    const { Resend } = await import('resend');
    const resend = new Resend(resendKey);

    const { error: emailError } = await resend.emails.send({
      from: 'Mashuup Cafe Admin <onboarding@resend.dev>',
      to: cleanEmail,
      subject: 'Your Mashuup Admin OTP Code',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:16px;border:1px solid #e5e7eb;">
          <h2 style="color:#166534;margin-bottom:8px;">Mashuup Cafe — Admin Access</h2>
          <p style="color:#374151;margin-bottom:24px;">Hello <strong>${escapeHtml(cleanName)}</strong>,</p>
          <p style="color:#374151;">Your one-time verification code to register as an Admin is:</p>
          <div style="background:#f0fdf4;border:2px solid #16a34a;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:40px;font-weight:900;letter-spacing:12px;color:#166534;">${code}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;">This code expires in <strong>30 minutes</strong>. Do not share it with anyone.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="color:#9ca3af;font-size:12px;">Mashuup Cafe &mdash; Street Eats &amp; Sips &bull; Chhindwara, MP</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend email error:', emailError.name);
      return NextResponse.json(
        { error: 'Could not send the OTP email. Please try again later.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${cleanEmail}`,
      expiresInMinutes: 30,
    });
  } catch (error) {
    console.error('Error sending admin OTP:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}