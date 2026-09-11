import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const gallery = await prisma.galleryImage.findMany({
    orderBy: { displayOrder: 'asc' },
  });
  return NextResponse.json({ gallery });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { imageUrl, caption } = body;

    if (!imageUrl) return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });

    const maxOrder = await prisma.galleryImage.findFirst({
      orderBy: { displayOrder: 'desc' },
      select: { displayOrder: true },
    });

    const displayOrder = (maxOrder?.displayOrder || 0) + 1;

    const item = await prisma.galleryImage.create({
      data: {
        imageUrl,
        caption: caption || '',
        displayOrder,
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, imageUrl, caption, displayOrder } = body;

    if (!id) return NextResponse.json({ error: 'Gallery item ID is required' }, { status: 400 });

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(imageUrl && { imageUrl }),
        ...(caption !== undefined && { caption }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
      },
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return NextResponse.json({ error: 'Failed to update gallery image' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Gallery image removed' });
  } catch (error) {
    console.error('Error removing gallery image:', error);
    return NextResponse.json({ error: 'Failed to remove gallery image' }, { status: 500 });
  }
}
