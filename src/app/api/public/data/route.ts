import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [restaurant, categories, featuredItems, gallery, hours] = await Promise.all([
      prisma.restaurant.findFirst(),
      prisma.menuCategory.findMany({
        orderBy: { displayOrder: 'asc' },
        include: {
          items: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      }),
      prisma.menuItem.findMany({
        where: { isFeatured: true, isAvailable: true },
        include: { category: true },
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.galleryImage.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.openingHour.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({
      restaurant,
      categories,
      featuredItems,
      gallery,
      hours,
    });
  } catch (error) {
    console.error('Error fetching public data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public website data' },
      { status: 500 }
    );
  }
}
