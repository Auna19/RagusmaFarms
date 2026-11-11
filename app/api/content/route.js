import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const content = db.content.get();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    requireAdmin(req);
    const body = await req.json();

    const updated = db.content.update(body);

    return NextResponse.json({
      success: true,
      message: 'Website content updated successfully!',
      content: updated
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

