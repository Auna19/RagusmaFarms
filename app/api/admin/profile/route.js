import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const user = getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const admin = await db.users.findById(user.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone || '',
        role: admin.role,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    });
  } catch (error) {
    console.error('Fetch admin profile error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const user = getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { fullName, phone } = await req.json();

    if (!fullName || fullName.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    const updated = await db.users.update(user.id, {
      fullName: fullName.trim(),
      phone: phone ? phone.trim() : user.phone
    });

    return NextResponse.json({
      success: true,
      message: 'Admin profile updated successfully!',
      profile: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role
      }
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update profile' }, { status: 500 });
  }
}

