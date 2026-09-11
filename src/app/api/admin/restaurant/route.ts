import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const restaurant = await prisma.restaurant.findFirst();
  return NextResponse.json({ restaurant });
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const existing = await prisma.restaurant.findFirst();

    let restaurant;
    if (existing) {
      restaurant = await prisma.restaurant.update({
        where: { id: existing.id },
        data: {
          name: body.name,
          tagline: body.tagline,
          description: body.description,
          about: body.about,
          logo: body.logo,
          heroImage: body.heroImage,
          restaurantImage: body.restaurantImage,
          address: body.address,
          phone: body.phone,
          email: body.email,
          instagramUrl: body.instagramUrl,
          mapUrl: body.mapUrl,
        },
      });
    } else {
      restaurant = await prisma.restaurant.create({
        data: {
          name: body.name || 'THE OLIVE TABLE',
          tagline: body.tagline || 'Good Food. Great Moments.',
          description: body.description || '',
          about: body.about || '',
          logo: body.logo,
          heroImage: body.heroImage,
          restaurantImage: body.restaurantImage,
          address: body.address || '',
          phone: body.phone || '',
          email: body.email || '',
          instagramUrl: body.instagramUrl,
          mapUrl: body.mapUrl,
        },
      });
    }

    return NextResponse.json({ success: true, restaurant });
  } catch (error) {
    console.error('Failed to update restaurant:', error);
    return NextResponse.json({ error: 'Failed to update restaurant' }, { status: 500 });
  }
}
