import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    requireAdmin(req);

    const products = await db.products.getAll();
    const orders = await db.orders.getAll();
    const users = await db.users.getAll();
    const categories = await db.categories.getAll();
    const settings = await db.settings.get();

    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isAvailable && p.stock > 0).length;
    const outOfStockProducts = products.filter(p => p.stock <= 0).length;
    const lowStockThreshold = settings.lowStockThreshold || 10;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= lowStockThreshold);

    const customers = users.filter(u => u.role === 'customer');
    const totalCustomers = customers.length;

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
    const processingOrders = orders.filter(o => ['Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery'].includes(o.orderStatus)).length;
    const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

    // Total sales = sum of orders that are not cancelled (or where payment is successful or delivered)
    const validSalesOrders = orders.filter(o => o.orderStatus !== 'Cancelled' && (o.paymentStatus === 'successful' || o.orderStatus === 'Delivered'));
    const totalSales = validSalesOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    // Category distribution
    const categoryDistribution = categories.map(cat => ({
      name: cat.name,
      count: products.filter(p => p.categoryId === cat.id).length
    }));

    // Best selling products calculation
    const allItems = orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .flatMap(o => o.items || []);

    const salesByProduct = {};
    allItems.forEach(item => {
      if (!salesByProduct[item.productId]) {
        salesByProduct[item.productId] = {
          name: item.productName,
          quantity: 0,
          totalRevenue: 0
        };
      }
      salesByProduct[item.productId].quantity += item.quantity;
      salesByProduct[item.productId].totalRevenue += item.subtotal;
    });

    const topSellingProducts = Object.values(salesByProduct)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Recent orders (last 6)
    const recentOrders = orders.slice(0, 6);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        totalCustomers,
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalSales,
        categoryDistribution,
        topSellingProducts,
        recentOrders
      }
    });
  } catch (error) {
    const status = error.message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

