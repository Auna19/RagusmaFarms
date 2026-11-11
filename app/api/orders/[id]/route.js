import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = params;
    const order = await db.orders.findById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Role check: customer can only access their own order
    if (user.role !== 'admin' && order.customerId !== user.id) {
      return NextResponse.json({ error: 'Access denied: You cannot view this order.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = params;
    const order = await db.orders.findById(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const body = await req.json();
    const { action, status, note, paymentStatus, paymentReference, adminNotes } = body;

    // Customer cancellation
    if (action === 'cancel') {
      if (user.role !== 'admin' && order.customerId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const cancelled = await db.orders.cancelOrder(
        id,
        user.role === 'admin' ? `Admin (${user.fullName})` : `Customer (${user.fullName})`,
        note || 'Cancelled by user request.'
      );

      return NextResponse.json({
        success: true,
        message: 'Order cancelled successfully',
        order: cancelled
      });
    }

    // Payment simulation or update
    if (action === 'update_payment') {
      if (user.role !== 'admin' && order.customerId !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const updated = await db.orders.updatePaymentStatus(
        id,
        paymentStatus || 'successful',
        paymentReference || 'VERIFIED-' + Date.now()
      );

      return NextResponse.json({
        success: true,
        message: 'Payment status updated successfully',
        order: updated
      });
    }

    // Admin-only updates
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Administrative permission required' }, { status: 403 });
    }

    let updatedOrder = order;

    if (status && status !== order.orderStatus) {
      updatedOrder = await db.orders.updateStatus(id, status, user.fullName, note);
    }

    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      updatedOrder = await db.orders.updatePaymentStatus(id, paymentStatus, paymentReference);
    }

    if (adminNotes !== undefined) {
      updatedOrder = await db.orders.addAdminNote(id, adminNotes);
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: await db.orders.findById(id)
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 });
  }
}

