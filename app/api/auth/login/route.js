import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, requireRole } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = db.users.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'This account has been deactivated. Please contact support.' }, { status: 403 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email address or password.' }, { status: 401 });
    }

    // Role verification for admin login
    if (requireRole === 'admin' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied: You do not have administrator permissions.' }, { status: 403 });
    }

    const token = signToken(user);
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    const response = NextResponse.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token,
      redirectTo
    });

    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error during login.' }, { status: 500 });
  }
}

