import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('onlyActive') === 'true';
    const categories = db.categories.getAll(onlyActive);
    
    // Add product counts for each category
    const allProducts = db.products.getAll();
    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      productCount: allProducts.filter(p => p.categoryId === cat.id).length
    }));

    return NextResponse.json({
      success: true,
      categories: categoriesWithCount
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { name, description, image, isActive } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const created = db.categories.create({
      name,
      description,
      image,
      isActive: isActive !== false
    });

    return NextResponse.json({
      success: true,
      message: 'Category created successfully!',
      category: created
    }, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

