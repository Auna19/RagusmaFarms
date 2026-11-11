import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === 'true';
    const testimonials = await db.testimonials.getAll(!all);
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { name, roleOrTitle, content, rating, location, avatar, isFeatured } = body;

    if (!name || !content) {
      return NextResponse.json({ error: 'Name and testimonial content are required' }, { status: 400 });
    }

    const created = await db.testimonials.create({
      name,
      roleOrTitle,
      content,
      rating,
      location,
      avatar,
      isFeatured: Boolean(isFeatured)
    });

    return NextResponse.json({
      success: true,
      message: 'Testimonial created successfully',
      testimonial: created
    }, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

