import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    requireAdmin(req);
    const { id } = params;
    const body = await req.json();

    const existing = await db.categories.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const updated = await db.categories.update(id, body);

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully!',
      category: updated
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

    const existing = await db.categories.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if products exist in category
    const prods = await db.products.getAll({ categoryId: id });
    if (prods.length > 0) {
      return NextResponse.json({ 
        error: `Cannot delete category: ${prods.length} product(s) are assigned to it. Reassign or delete products first.` 
      }, { status: 400 });
    }

    await db.categories.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully!'
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

