import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const products = db.products.getAll();
    const logs = db.inventory.getLogs(productId);
    const settings = db.settings.get();
    const threshold = settings.lowStockThreshold || 10;

    const inventoryStatus = products.map(p => ({
      id: p.id,
      name: p.name,
      unit: p.unit,
      stock: p.stock,
      price: p.price,
      isAvailable: p.isAvailable,
      status: p.stock === 0 ? 'Out of Stock' : p.stock <= threshold ? 'Low Stock' : 'Optimal'
    }));

    return NextResponse.json({
      success: true,
      inventoryStatus,
      logs: logs.slice(0, 50),
      threshold
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(req) {
  try {
    requireAdmin(req);
    const { productId, newStock, reason } = await req.json();

    if (!productId || newStock === undefined) {
      return NextResponse.json({ error: 'Product ID and new stock level are required' }, { status: 400 });
    }

    const updated = db.products.update(productId, {
      stock: Number(newStock),
      stockReason: reason || 'manual_admin_adjustment',
      isAvailable: Number(newStock) > 0
    });

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      product: updated
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

