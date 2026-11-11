import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const addresses = await db.addresses.getByUserId(user.id);
    const userNotifications = await db.notifications.getByUserId(user.id);
    const unreadNotifications = userNotifications.filter(n => !n.isRead).length;

    return NextResponse.json({
      authenticated: true,
      user: {
        ...user,
        addresses,
        unreadNotifications
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}

export async function PUT(req) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { fullName, phone } = body;

    const updated = await db.users.update(user.id, {
      fullName: fullName || user.fullName,
      phone: phone !== undefined ? phone : user.phone
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updated.id,
        fullName: updated.fullName,
        email: updated.email,
        phone: updated.phone,
        role: updated.role
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

