import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
  try {
    const { email, token, newPassword, confirmPassword } = await req.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    const passwordHash = await hashPassword(newPassword);
    await db.users.update(user.id, { passwordHash });

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}

