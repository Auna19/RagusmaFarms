import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const onlyActive = searchParams.get('all') !== 'true';
    const locations = await db.deliveryLocations.getAll(onlyActive);

    return NextResponse.json({
      success: true,
      locations
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch delivery locations' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { name, charge, description, estimatedDeliveryTime, isActive } = body;

    if (!name || charge === undefined) {
      return NextResponse.json({ error: 'Location name and charge are required.' }, { status: 400 });
    }

    const created = await db.deliveryLocations.create({
      name,
      charge: Number(charge),
      description,
      estimatedDeliveryTime,
      isActive: isActive !== false
    });

    try {
      revalidatePath('/', 'page');
      revalidatePath('/dashboard/checkout', 'page');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Delivery location created successfully!',
      location: created
    }, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

