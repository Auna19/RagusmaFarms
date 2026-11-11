import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    requireAdmin(req);
    const { id } = params;
    const body = await req.json();

    const existing = await db.deliveryLocations.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Delivery location not found' }, { status: 404 });
    }

    const updated = await db.deliveryLocations.update(id, body);

    return NextResponse.json({
      success: true,
      message: 'Delivery location updated successfully!',
      location: updated
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

    const existing = await db.deliveryLocations.findById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Delivery location not found' }, { status: 404 });
    }

    await db.deliveryLocations.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Delivery location deleted successfully!'
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

