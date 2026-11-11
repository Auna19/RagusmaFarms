import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.users.findByEmail(email.toLowerCase().trim());
    
    // Always return a positive message to avoid user email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email address, a password reset link has been dispatched to your inbox.'
      });
    }

    // Determine current base URL
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    const proto = req.headers.get('x-forwarded-proto') || 'https';
    
    let baseUrl = origin;
    if (!baseUrl && host) {
      baseUrl = `${proto}://${host}`;
    }
    if (!baseUrl) {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ragusma-farms.vercel.app';
    }

    // Generate signed 1-hour secure password reset token
    const resetToken = signPasswordResetToken(user);
    const resetLink = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(user.email)}`;

    // Dispatch beautiful HTML password reset email
    await sendPasswordResetEmail({
      to: user.email,
      name: user.fullName,
      resetLink
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email address, a password reset link has been dispatched to your inbox.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process password reset request' }, { status: 500 });
  }
}

