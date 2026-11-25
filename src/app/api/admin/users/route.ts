import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

// The one super-admin who can delete other admins
const SUPER_ADMIN_EMAIL = 'shivammungbhate671@gmail.com';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const users = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const isSuperAdmin = admin.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  return NextResponse.json({ users, currentAdminId: admin.id, isSuperAdmin });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.adminUser.findUnique({ where: { email: cleanEmail } });
    if (existing) {
      return NextResponse.json({ error: 'An admin user with this email already exists.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.adminUser.create({
      data: { name: name.trim(), email: cleanEmail, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ success: true, user: newAdmin });
  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create admin user.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Only the super admin can delete other admins
  const isSuperAdmin = admin.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  if (!isSuperAdmin) {
    return NextResponse.json(
      { error: 'Only the Super Admin (shivammungbhate671@gmail.com) can delete admin accounts.' },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    if (id === admin.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    const totalAdmins = await prisma.adminUser.count();
    if (totalAdmins <= 1) {
      return NextResponse.json({ error: 'Cannot delete the only remaining admin account.' }, { status: 400 });
    }

    await prisma.adminUser.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Admin user removed successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
  }
}
