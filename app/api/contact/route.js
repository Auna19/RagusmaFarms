import { NextResponse } from 'next/server';
import { sendContactInquiryEmail, INQUIRY_LABELS } from '@/lib/email';
import { db } from '@/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, phone, email, inquiryType, message } = body;

    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Please provide a message or order details.' },
        { status: 400 }
      );
    }

    // 1. Dispatch email to official farm desk: ragusmaa@gmail.com
    const emailResult = await sendContactInquiryEmail({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      inquiryType: inquiryType || 'general',
      message: message.trim()
    });

    // 2. Also register a notification in DB for admin dashboard
    try {
      const inquiryLabel = INQUIRY_LABELS[inquiryType] || 'Direct Inquiry';
      await db.notifications.create({
        userId: 'admin',
        title: `New Inquiry: ${fullName.trim()} (${inquiryLabel})`,
        message: `Phone: ${phone.trim()}${email ? ` | Email: ${email.trim()}` : ''} - "${message.trim().slice(0, 140)}..."`,
        type: 'contact',
        isRead: false,
        link: '/admin'
      });
    } catch (notifErr) {
      console.warn('Could not record contact notification in DB:', notifErr.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to our farm desk at ragusmaa@gmail.com!',
      details: emailResult
    });
  } catch (err) {
    console.error('Contact API Error:', err);
    return NextResponse.json(
      { error: 'Failed to process inquiry. Please call our farm desk directly.' },
      { status: 500 }
    );
  }
}
