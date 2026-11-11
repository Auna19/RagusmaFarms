import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const featuredOnly = searchParams.get('featured') === 'true';
    const search = searchParams.get('search');
    const includeOutOfStock = searchParams.get('includeOutOfStock') === 'true';

    const products = await db.products.getAll({
      categoryId,
      featuredOnly,
      search,
      onlyActive: !includeOutOfStock
    });

    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    requireAdmin(req);
    const body = await req.json();

    const {
      name,
      categoryId,
      description,
      price,
      promotionalPrice,
      unit,
      stock,
      isAvailable,
      isFeatured,
      images,
      specifications
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json({ error: 'Product name, category, and price are required.' }, { status: 400 });
    }

    const created = await db.products.create({
      name,
      categoryId,
      description,
      price: Number(price),
      promotionalPrice: promotionalPrice ? Number(promotionalPrice) : null,
      unit: unit || 'per item',
      stock: Number(stock) || 0,
      isAvailable: isAvailable !== false,
      isFeatured: Boolean(isFeatured),
      images: Array.isArray(images) && images.length > 0 ? images : ['/assets/live-chicken-pasture.webp'],
      specifications: specifications || {}
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully!',
      product: created
    }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

