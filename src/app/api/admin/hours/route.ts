import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const hours = await prisma.openingHour.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return NextResponse.json({ hours });
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { hours } = body; // Array of OpeningHour items

    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: 'Hours array is required' }, { status: 400 });
    }

    const updatedHours = [];
    for (const h of hours) {
      if (h.id) {
        const item = await prisma.openingHour.update({
          where: { id: h.id },
          data: {
            openTime: h.openTime || '11:00 AM',
            closeTime: h.closeTime || '10:00 PM',
            isClosed: Boolean(h.isClosed),
          },
        });
        updatedHours.push(item);
      }
    }

    return NextResponse.json({ success: true, hours: updatedHours });
  } catch (error) {
    console.error('Error updating opening hours:', error);
    return NextResponse.json({ error: 'Failed to update opening hours' }, { status: 500 });
  }
}
