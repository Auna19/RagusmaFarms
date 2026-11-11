import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = db.users.findByEmail(email);
    // In production we send an email with a secure token; for development we generate and return the reset token directly
    if (!user) {
      // Don't reveal account absence for security, but return generic success
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been dispatched.'
      });
    }

    const resetToken = 'reset_' + Buffer.from(user.email + ':' + Date.now()).toString('base64');
    
    return NextResponse.json({
      success: true,
      message: 'Password reset link generated successfully.',
      devResetLink: `/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

