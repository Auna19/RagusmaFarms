import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    requireAdmin(req);
    const { id } = params;
    const body = await req.json();

    const updated = await db.testimonials.update(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial updated successfully',
      testimonial: updated
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

    await db.testimonials.delete(id);

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

