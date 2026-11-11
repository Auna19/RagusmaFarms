import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let orders;
    if (user.role === 'admin') {
      orders = await db.orders.getAll({ status });
    } else {
      orders = await db.orders.getAll({ customerId: user.id, status });
    }

    // Attach brief items summary for list view
    const enriched = await Promise.all(orders.map(async (ord) => {
      const full = await db.orders.findById(ord.id);
      return {
        ...ord,
        itemsCount: full?.items?.length || 0,
        items: full?.items || []
      };
    }));

    return NextResponse.json({
      success: true,
      orders: enriched
    });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const user = getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to place an order.' }, { status: 401 });
    }

    const body = await req.json();
    const {
      items,
      deliveryMethod, // 'delivery' or 'pickup'
      deliveryLocationId,
      deliveryAddress,
      customerNotes,
      paymentMethod, // 'test_mode', 'paystack', 'bank_transfer'
      customerName,
      customerPhone,
      customerEmail
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    if (!deliveryMethod || !['delivery', 'pickup'].includes(deliveryMethod)) {
      return NextResponse.json({ error: 'Please choose either Delivery or Farm Pickup.' }, { status: 400 });
    }

    // Backend validation of delivery fees
    let verifiedDeliveryFee = 0;
    let verifiedLocationName = 'Farm Pickup (Ragusma Farms Main Gate)';

    if (deliveryMethod === 'delivery') {
      if (!deliveryLocationId) {
        return NextResponse.json({ error: 'Please select a delivery location.' }, { status: 400 });
      }
      if (!deliveryAddress || deliveryAddress.trim().length < 5) {
        return NextResponse.json({ error: 'Please enter a complete delivery address.' }, { status: 400 });
      }

      const loc = await db.deliveryLocations.findById(deliveryLocationId);
      if (!loc || !loc.isActive) {
        return NextResponse.json({ error: 'The selected delivery location is not available. Please contact farm support.' }, { status: 400 });
      }

      verifiedDeliveryFee = Number(loc.charge);
      verifiedLocationName = loc.name;
    } else {
      // Pickup must strictly have 0 delivery fee
      verifiedDeliveryFee = 0;
      const settings = await db.settings.get();
      verifiedLocationName = settings.farmPickupAddress || 'Farm Pickup';
    }

    // Verify products, pricing snapshots, and stock
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await db.products.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productName || item.productId}` }, { status: 400 });
      }

      if (!product.isAvailable) {
        return NextResponse.json({ error: `Product "${product.name}" is currently unavailable.` }, { status: 400 });
      }

      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        return NextResponse.json({ error: `Invalid quantity for ${product.name}.` }, { status: 400 });
      }

      if (product.stock < qty) {
        return NextResponse.json({
          error: `Insufficient stock for "${product.name}". Only ${product.stock} ${product.unit} available.`
        }, { status: 400 });
      }

      const unitPrice = product.promotionalPrice && product.promotionalPrice < product.price
        ? product.promotionalPrice
        : product.price;

      const itemSubtotal = unitPrice * qty;
      verifiedSubtotal += itemSubtotal;

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        productUnit: product.unit,
        unitPrice,
        quantity: qty,
        subtotal: itemSubtotal,
        productImage: product.images?.[0] || '/assets/live-chicken-pasture.webp'
      });
    }

    const verifiedTotal = verifiedSubtotal + verifiedDeliveryFee;

    // Create the order
    const createdOrder = await db.orders.create({
      customerId: user.id,
      customerName: customerName || user.fullName,
      customerEmail: customerEmail || user.email,
      customerPhone: customerPhone || user.phone,
      deliveryMethod,
      deliveryLocationId: deliveryMethod === 'delivery' ? deliveryLocationId : null,
      deliveryLocationName: verifiedLocationName,
      deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : verifiedLocationName,
      deliveryFee: verifiedDeliveryFee,
      subtotal: verifiedSubtotal,
      totalAmount: verifiedTotal,
      paymentStatus: paymentMethod === 'test_mode' ? 'successful' : 'pending',
      paymentMethod: paymentMethod || 'test_mode',
      paymentReference: 'REF-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      customerNotes: customerNotes || '',
      items: verifiedItems
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully!',
      order: createdOrder
    }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

