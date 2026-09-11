import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const items = await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: [{ category: { displayOrder: 'asc' } }, { displayOrder: 'asc' }],
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { categoryId, name, description, price, image, isVeg, isAvailable, isFeatured } = body;

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json({ error: 'Category, name, and price are required' }, { status: 400 });
    }

    const newItem = await prisma.menuItem.create({
      data: {
        categoryId,
        name: name.trim(),
        description: description || '',
        price: parseFloat(price),
        image: image || null,
        isVeg: Boolean(isVeg),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        isFeatured: Boolean(isFeatured),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { id, categoryId, name, description, price, image, isVeg, isAvailable, isFeatured, displayOrder } = body;

    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    const updatedItem = await prisma.menuItem.update({
      where: { id },
      data: {
        ...(categoryId && { categoryId }),
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(image !== undefined && { image }),
        ...(isVeg !== undefined && { isVeg: Boolean(isVeg) }),
        ...(isAvailable !== undefined && { isAvailable: Boolean(isAvailable) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdminRequest(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}
