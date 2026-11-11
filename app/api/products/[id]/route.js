import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { id } = params;
    let product = await db.products.findById(id);
    if (!product) {
      product = await db.products.findBySlug(id);
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const category = await db.categories.findById(product.categoryId);

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        categoryName: category ? category.name : 'Uncategorized'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    requireAdmin(req);
    const { id } = params;
    const body = await req.json();

    const existing = await db.products.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updated = await db.products.update(id, body);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully!',
      product: updated
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    requireAdmin(req);
    const { id } = params;

    const existing = await db.products.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await db.products.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

