import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, comparePassword, hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const user = getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 403 });
    }

    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All password fields are required.' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New password and confirmation do not match.' }, { status: 400 });
    }

    // Verify current password
    const adminUser = await db.users.findByEmail(user.email);
    if (!adminUser) {
      return NextResponse.json({ error: 'Admin account not found' }, { status: 404 });
    }

    const isMatch = await comparePassword(currentPassword, adminUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Incorrect current password. Please try again.' }, { status: 400 });
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    await db.users.update(adminUser.id, {
      passwordHash: newHash
    });

    return NextResponse.json({
      success: true,
      message: 'Admin password changed successfully! Please use your new password next time you log in.'
    });
  } catch (error) {
    console.error('Admin password change error:', error);
    return NextResponse.json({ error: error.message || 'Failed to change password' }, { status: 500 });
  }
}

