import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone, password, confirmPassword } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: 'Full name, email, and password are required.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await db.users.findByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email address already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.users.create({
      fullName,
      email,
      phone: phone || '',
      passwordHash,
      role: 'customer'
    });

    const token = signToken(user);

    // Send welcome notification
    await db.notifications.create({
      userId: user.id,
      title: 'Welcome to Ragusma Farms!',
      message: `Hello ${user.fullName}, welcome to Ragusma Farms NG®. Explore our pasture-raised poultry, fish, rabbits, and organic produce!`,
      type: 'welcome',
      link: '/products'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
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
    console.error('Registration error:', error);
    return NextResponse.json({ error: error.message || 'Server error during registration.' }, { status: 500 });
  }
}

