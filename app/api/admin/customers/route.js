import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    requireAdmin(req);

    const users = db.users.getAll();
    const orders = db.orders.getAll();

    const customers = users
      .filter(u => u.role === 'customer')
      .map(cust => {
        const custOrders = orders.filter(o => o.customerId === cust.id);
        const totalSpent = custOrders
          .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus === 'successful')
          .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

        return {
          id: cust.id,
          fullName: cust.fullName,
          email: cust.email,
          phone: cust.phone,
          isActive: cust.isActive,
          createdAt: cust.createdAt,
          totalOrders: custOrders.length,
          totalSpent,
          lastOrderDate: custOrders[0]?.createdAt || null
        };
      });

    return NextResponse.json({
      success: true,
      customers
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function PATCH(req) {
  try {
    requireAdmin(req);
    const { userId, isActive } = await req.json();

    const updated = db.users.update(userId, { isActive: Boolean(isActive) });

    return NextResponse.json({
      success: true,
      message: `Customer ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updated
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

