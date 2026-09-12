import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let hours = await prisma.openingHour.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  // Seed default 7 days if database has no hours
  if (hours.length === 0) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let i = 0; i < days.length; i++) {
      await prisma.openingHour.create({
        data: {
          day: days[i],
          openTime: '11:00 AM',
          closeTime: '11:00 PM',
          isClosed: false,
          displayOrder: i,
        },
      });
    }
    hours = await prisma.openingHour.findMany({ orderBy: { displayOrder: 'asc' } });
  }

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
      // Find existing record by ID or by Day
      let existing = null;
      if (h.id) {
        existing = await prisma.openingHour.findUnique({ where: { id: h.id } });
      }
      if (!existing && h.day) {
        existing = await prisma.openingHour.findFirst({ where: { day: h.day } });
      }

      if (existing) {
        const item = await prisma.openingHour.update({
          where: { id: existing.id },
          data: {
            openTime: h.openTime || '11:00 AM',
            closeTime: h.closeTime || '11:00 PM',
            isClosed: Boolean(h.isClosed),
          },
        });
        updatedHours.push(item);
      } else {
        const item = await prisma.openingHour.create({
          data: {
            day: h.day || 'Monday',
            openTime: h.openTime || '11:00 AM',
            closeTime: h.closeTime || '11:00 PM',
            isClosed: Boolean(h.isClosed),
            displayOrder: h.displayOrder || 0,
          },
        });
        updatedHours.push(item);
      }
    }

    return NextResponse.json({ success: true, hours: updatedHours });
  } catch (error: any) {
    console.error('Error updating opening hours:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update opening hours' },
      { status: 500 }
    );
  }
}
