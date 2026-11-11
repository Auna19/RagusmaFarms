import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

const INITIAL_DATA = {
  users: [],
  categories: [],
  products: [],
  orders: [],
  orderItems: [],
  orderStatusHistory: [],
  deliveryLocations: [],
  inventoryLogs: [],
  notifications: [],
  testimonials: [],
  addresses: [],
  content: {
    hero: {
      badge: "Purely Farm-Fresh & 100% Organic",
      headline: "Fresh From Our Farm, Quality You Can Trust.",
      subheadline: "Discover premium farm-raised live & frozen chicken, healthy rabbits, fresh catfish, and organic manure straight from Ragusma Farms. Rooted in sustainable agricultural heritage.",
      ctaPrimary: "Explore Our Products",
      ctaSecondary: "Get to Know Us",
      heroImage: "/assets/live-chicken-pasture.webp",
      taglineBadge: "Project: GREEN ECONOMY"
    },
    about: {
      title: "Rooted in Passion, Dedicated to Quality",
      paragraph1: "At Ragusma Farms, we are pleased to be a family-owned and operated agricultural business dedicated to providing high-quality farm produce and livestock to our community. Our roots run deep in the farming industry with two generations of hands-on experience in livestock, poultry, and crop farming.",
      paragraph2: "Founded in 2015 by Hajiya Ramatu Mallam Madaki and co-managed by the Madaki brothers since 2022, Ragusma Farms has evolved into a modern, sustainable farming brand serving households, caterers, hotels, and agricultural partners across Niger State and beyond.",
      quote: "Access to Food is a right, not a privilege.",
      founderCaption: "Hajiya Ramatu Mallam Madaki (Founder, 2015) & Madaki Brothers (Management)",
      heritageImage: "/assets/about-heritage.webp",
      ceoImage: "/assets/meet-ceo.webp"
    },
    mission: {
      statement: "To promote sustainable agriculture, providing households and commercial clients with healthy, organic, and affordable farm products through responsible farming practices, innovation, environmental stewardship, and dependable delivery."
    },
    vision: {
      statement: "To become a trusted and leading agricultural brand across Nigeria, recognized for top-tier poultry and livestock, sustainable green economy practices, and unmatched customer satisfaction."
    },
    whyChooseUs: [
      {
        id: "w1",
        title: "100% Healthy & Farm-Raised",
        description: "Our poultry, rabbits, and fish are nurtured in hygienic, spacious pastures with organic feeds and regular veterinary oversight."
      },
      {
        id: "w2",
        title: "Transparent & Affordable Pricing",
        description: "Direct farm-gate pricing in Nigerian Naira with zero middleman markups, ensuring healthy food is accessible to every family."
      },
      {
        id: "w3",
        title: "Free Delivery in Tunga & Pickup",
        description: "Enjoy completely free door-to-door delivery within Tunga or collect your order fresh at our farm gate at ₦0 delivery fee."
      },
      {
        id: "w4",
        title: "Rigorous Hygiene & Processing",
        description: "Processed poultry and fish undergo sanitary slaughtering, flash freezing, and insulated temperature-controlled handling."
      },
      {
        id: "w5",
        title: "Green & Circular Farming",
        description: "We recycle animal waste into nutrient-dense organic manure, promoting closed-loop sustainable agriculture and healthier soils."
      },
      {
        id: "w6",
        title: "Expert Agricultural Advisory",
        description: "Consult with seasoned farm managers on poultry setup, fish pond design, rabbitry management, and organic crop fertilization."
      }
    ],
    contact: {
      phone: "+234 813 583 4368",
      whatsapp: "+234 813 583 4368",
      email: "Ragusmaa@gmail.com",
      farmAddress: "Tunga goro, Behind FGC minna, Niger state.",
      workingHours: "Monday – Saturday: 7:00 AM – 6:30 PM (Sunday: 1:00 PM – 6:00 PM)",
      instagram: "https://www.instagram.com/ragusmafarmsng/",
      facebook: "https://facebook.com/ragusmafarmsng",
      twitter: "https://x.com/ragusmafarmsng",
      serviceTagline: "At the very heart of agriculture is the drive to feed the world."
    }
  },
  settings: {
    farmName: "Ragusma Farms NG®",
    currency: "₦",
    farmPickupAddress: "Ragusma Farms Main Gate, Tunga goro, Behind FGC minna, Niger state.",
    pickupInstructions: "Please present your Order ID and phone number at the customer service gate for prompt collection. Ready items are kept in cold-storage or live holding pens.",
    bankTransfer: {
      enabled: true,
      bankName: "First Bank of Nigeria",
      accountName: "Ragusma Farms Integrated Services",
      accountNumber: "2039485721",
      instructions: "Transfer the exact order total and use your Order ID as payment narration. Once transferred, click 'I Have Paid' to notify our team."
    },
    paystack: {
      enabled: true,
      testMode: true,
      publicKey: "pk_test_sample_ragusma_paystack_key_here",
      secretKey: "sk_test_sample_ragusma_secret_key_here"
    },
    lowStockThreshold: 10,
    allowGuestBrowsing: true,
    freeDeliveryTunga: true
  }
};

function ensureDataDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readDB() {
  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
    writeDB(INITIAL_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database:", err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

function writeDB(data) {
  ensureDataDir();
  const tempPath = `${DB_PATH}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_PATH);
}

// Relational Operations
export const db = {
  // USERS
  users: {
    getAll: () => readDB().users,
    findById: (id) => readDB().users.find(u => u.id === id) || null,
    findByEmail: (email) => {
      if (!email) return null;
      return readDB().users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
    },
    create: (userData) => {
      const data = readDB();
      const newUser = {
        id: userData.id || 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        fullName: userData.fullName,
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone || '',
        passwordHash: userData.passwordHash,
        role: userData.role || 'customer',
        isActive: userData.isActive !== false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    },
    update: (id, updates) => {
      const data = readDB();
      const index = data.users.findIndex(u => u.id === id);
      if (index === -1) return null;
      data.users[index] = {
        ...data.users[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      writeDB(data);
      return data.users[index];
    },
    delete: (id) => {
      const data = readDB();
      data.users = data.users.filter(u => u.id !== id);
      writeDB(data);
      return true;
    }
  },

  // CATEGORIES
  categories: {
    getAll: (onlyActive = false) => {
      const cats = readDB().categories || [];
      return onlyActive ? cats.filter(c => c.isActive) : cats;
    },
    findById: (id) => readDB().categories.find(c => c.id === id) || null,
    findBySlug: (slug) => readDB().categories.find(c => c.slug === slug) || null,
    create: (catData) => {
      const data = readDB();
      const newCat = {
        id: catData.id || 'cat_' + Date.now(),
        name: catData.name,
        slug: catData.slug || catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: catData.description || '',
        image: catData.image || '/assets/live-chicken-pasture.webp',
        isActive: catData.isActive !== false,
        displayOrder: catData.displayOrder || data.categories.length + 1,
        createdAt: new Date().toISOString()
      };
      data.categories.push(newCat);
      writeDB(data);
      return newCat;
    },
    update: (id, updates) => {
      const data = readDB();
      const index = data.categories.findIndex(c => c.id === id);
      if (index === -1) return null;
      data.categories[index] = { ...data.categories[index], ...updates };
      writeDB(data);
      return data.categories[index];
    },
    delete: (id) => {
      const data = readDB();
      data.categories = data.categories.filter(c => c.id !== id);
      writeDB(data);
      return true;
    }
  },

  // PRODUCTS
  products: {
    getAll: (filter = {}) => {
      let prods = readDB().products || [];
      if (filter.onlyActive) prods = prods.filter(p => p.isAvailable);
      if (filter.categoryId) prods = prods.filter(p => p.categoryId === filter.categoryId);
      if (filter.featuredOnly) prods = prods.filter(p => p.isFeatured);
      if (filter.search) {
        const q = filter.search.toLowerCase();
        prods = prods.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q)
        );
      }
      return prods;
    },
    findById: (id) => readDB().products.find(p => p.id === id) || null,
    findBySlug: (slug) => readDB().products.find(p => p.slug === slug) || null,
    create: (prodData) => {
      const data = readDB();
      const id = prodData.id || 'prod_' + Date.now();
      const slug = prodData.slug || prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
      const newProd = {
        id,
        name: prodData.name,
        slug,
        categoryId: prodData.categoryId,
        description: prodData.description || '',
        price: Number(prodData.price) || 0,
        promotionalPrice: prodData.promotionalPrice ? Number(prodData.promotionalPrice) : null,
        unit: prodData.unit || 'per bird',
        stock: Number(prodData.stock) || 0,
        isAvailable: prodData.isAvailable !== false,
        isFeatured: Boolean(prodData.isFeatured),
        images: Array.isArray(prodData.images) && prodData.images.length > 0 ? prodData.images : ['/assets/live-chicken-pasture.webp'],
        specifications: prodData.specifications || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      data.products.push(newProd);

      // Log initial inventory
      data.inventoryLogs.push({
        id: 'inv_' + Date.now(),
        productId: id,
        changeAmount: newProd.stock,
        previousStock: 0,
        newStock: newProd.stock,
        reason: 'initial_stock',
        referenceId: null,
        createdAt: new Date().toISOString()
      });

      writeDB(data);
      return newProd;
    },
    update: (id, updates) => {
      const data = readDB();
      const index = data.products.findIndex(p => p.id === id);
      if (index === -1) return null;

      const prev = data.products[index];
      const updated = {
        ...prev,
        ...updates,
        price: updates.price !== undefined ? Number(updates.price) : prev.price,
        promotionalPrice: updates.promotionalPrice !== undefined 
          ? (updates.promotionalPrice ? Number(updates.promotionalPrice) : null) 
          : prev.promotionalPrice,
        stock: updates.stock !== undefined ? Number(updates.stock) : prev.stock,
        updatedAt: new Date().toISOString()
      };

      if (updates.stock !== undefined && updates.stock !== prev.stock) {
        data.inventoryLogs.push({
          id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          productId: id,
          changeAmount: updates.stock - prev.stock,
          previousStock: prev.stock,
          newStock: updates.stock,
          reason: updates.stockReason || 'admin_adjustment',
          referenceId: updates.referenceId || null,
          createdAt: new Date().toISOString()
        });
      }

      data.products[index] = updated;
      writeDB(data);
      return updated;
    },
    delete: (id) => {
      const data = readDB();
      data.products = data.products.filter(p => p.id !== id);
      writeDB(data);
      return true;
    }
  },

  // ORDERS
  orders: {
    getAll: (filter = {}) => {
      let ords = readDB().orders || [];
      if (filter.customerId) ords = ords.filter(o => o.customerId === filter.customerId);
      if (filter.status) ords = ords.filter(o => o.orderStatus === filter.status);
      return ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findById: (id) => {
      const data = readDB();
      const order = data.orders.find(o => o.id === id);
      if (!order) return null;
      const items = (data.orderItems || []).filter(item => item.orderId === id);
      const history = (data.orderStatusHistory || []).filter(h => h.orderId === id).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      return { 
        ...order, 
        status: order.orderStatus, 
        items, 
        history, 
        statusHistory: history 
      };
    },
    create: (orderPayload) => {
      const data = readDB();
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      // Stock deduction validation & preparation
      for (const item of orderPayload.items) {
        const prod = data.products.find(p => p.id === item.productId);
        if (!prod) {
          throw new Error(`Product ${item.productName || item.productId} no longer exists.`);
        }
        if (prod.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stock}, requested: ${item.quantity}.`);
        }
      }

      // Deduct stock safely
      for (const item of orderPayload.items) {
        const prod = data.products.find(p => p.id === item.productId);
        const prevStock = prod.stock;
        prod.stock -= item.quantity;
        if (prod.stock <= 0) {
          prod.stock = 0;
          prod.isAvailable = false;
        }
        data.inventoryLogs.push({
          id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          productId: prod.id,
          changeAmount: -item.quantity,
          previousStock: prevStock,
          newStock: prod.stock,
          reason: 'order_deduction',
          referenceId: orderId,
          createdAt: new Date().toISOString()
        });
      }

      const newOrder = {
        id: orderId,
        orderNumber: orderId,
        customerId: orderPayload.customerId,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        customerPhone: orderPayload.customerPhone,
        deliveryMethod: orderPayload.deliveryMethod, // 'delivery' or 'pickup'
        deliveryLocationId: orderPayload.deliveryLocationId || null,
        deliveryLocationName: orderPayload.deliveryLocationName || 'Farm Pickup',
        deliveryAddress: orderPayload.deliveryAddress || 'Farm Pickup Counter',
        deliveryFee: Number(orderPayload.deliveryFee) || 0,
        subtotal: Number(orderPayload.subtotal),
        totalAmount: Number(orderPayload.totalAmount),
        paymentStatus: orderPayload.paymentStatus || 'pending', // 'pending', 'successful', 'failed'
        paymentMethod: orderPayload.paymentMethod || 'test_mode', // 'paystack', 'bank_transfer', 'test_mode'
        paymentReference: orderPayload.paymentReference || 'REF-' + Date.now(),
        orderStatus: 'Pending', // 'Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'
        status: 'Pending',
        customerNotes: orderPayload.customerNotes || '',
        adminNotes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.orders.push(newOrder);

      // Create snapshot order items
      const createdItems = orderPayload.items.map((item, idx) => ({
        id: `item_${orderId}_${idx + 1}`,
        orderId,
        productId: item.productId,
        productName: item.productName,
        productUnit: item.productUnit || 'item',
        unitPrice: Number(item.unitPrice),
        quantity: Number(item.quantity),
        subtotal: Number(item.unitPrice) * Number(item.quantity),
        productImage: item.productImage || '/assets/live-chicken-pasture.webp'
      }));

      data.orderItems.push(...createdItems);

      // Add status history entry
      data.orderStatusHistory.push({
        id: 'hist_' + Date.now(),
        orderId,
        previousStatus: null,
        newStatus: 'Pending',
        changedBy: orderPayload.customerName || 'Customer',
        note: 'Order successfully placed by customer.',
        createdAt: new Date().toISOString()
      });

      // Add notification for customer
      data.notifications.push({
        id: 'notif_' + Date.now(),
        userId: orderPayload.customerId,
        title: `Order Placed Successfully! (${orderId})`,
        message: `Your order of ₦${newOrder.totalAmount.toLocaleString()} has been received. Our farm team is reviewing it.`,
        type: 'order',
        isRead: false,
        link: `/dashboard/orders/${orderId}`,
        createdAt: new Date().toISOString()
      });

      // Add notification for admin
      data.notifications.push({
        id: 'notif_admin_' + Date.now(),
        userId: 'admin',
        title: `New Order Received (${orderId})`,
        message: `Customer ${orderPayload.customerName} placed an order for ₦${newOrder.totalAmount.toLocaleString()} (${orderPayload.deliveryMethod}).`,
        type: 'order',
        isRead: false,
        link: `/admin/orders/${orderId}`,
        createdAt: new Date().toISOString()
      });

      writeDB(data);
      return { ...newOrder, items: createdItems };
    },
    updateStatus: (orderId, newStatus, changedBy = 'Admin', note = '') => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      const prevStatus = order.orderStatus || order.status;
      order.orderStatus = newStatus;
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();

      data.orderStatusHistory.push({
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        orderId,
        previousStatus: prevStatus,
        newStatus,
        changedBy,
        note: note || `Order status updated to ${newStatus}.`,
        createdAt: new Date().toISOString()
      });

      // Notify customer
      data.notifications.push({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        userId: order.customerId,
        title: `Order Status Update: ${newStatus}`,
        message: `Your order #${orderId} is now marked as "${newStatus}". ${note ? `Note: ${note}` : ''}`,
        type: 'status',
        isRead: false,
        link: `/dashboard/orders/${orderId}`,
        createdAt: new Date().toISOString()
      });

      writeDB(data);
      return order;
    },
    updatePaymentStatus: (orderId, paymentStatus, paymentReference = null) => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      order.paymentStatus = paymentStatus;
      if (paymentReference) order.paymentReference = paymentReference;
      order.updatedAt = new Date().toISOString();

      // If marked successful and order still pending, auto confirm
      if (paymentStatus === 'successful' && order.orderStatus === 'Pending') {
        order.orderStatus = 'Confirmed';
        data.orderStatusHistory.push({
          id: 'hist_' + Date.now(),
          orderId,
          previousStatus: 'Pending',
          newStatus: 'Confirmed',
          changedBy: 'Payment Gateway',
          note: 'Payment verified successfully. Order confirmed.',
          createdAt: new Date().toISOString()
        });
      }

      writeDB(data);
      return order;
    },
    cancelOrder: (orderId, cancelledBy = 'Customer', reason = '') => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      // Business rule: Can only cancel if Pending or Confirmed
      if (['Delivered', 'Cancelled', 'Out for Delivery'].includes(order.orderStatus)) {
        throw new Error(`Cannot cancel order in status ${order.orderStatus}.`);
      }

      const prevStatus = order.orderStatus;
      order.orderStatus = 'Cancelled';
      order.updatedAt = new Date().toISOString();

      // Restore inventory
      const items = (data.orderItems || []).filter(item => item.orderId === orderId);
      for (const item of items) {
        const prod = data.products.find(p => p.id === item.productId);
        if (prod) {
          const prevStock = prod.stock;
          prod.stock += item.quantity;
          if (prod.stock > 0) prod.isAvailable = true;
          data.inventoryLogs.push({
            id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            productId: prod.id,
            changeAmount: item.quantity,
            previousStock: prevStock,
            newStock: prod.stock,
            reason: 'order_cancellation_restore',
            referenceId: orderId,
            createdAt: new Date().toISOString()
          });
        }
      }

      data.orderStatusHistory.push({
        id: 'hist_' + Date.now(),
        orderId,
        previousStatus: prevStatus,
        newStatus: 'Cancelled',
        changedBy: cancelledBy,
        note: reason || `Order cancelled by ${cancelledBy}.`,
        createdAt: new Date().toISOString()
      });

      data.notifications.push({
        id: 'notif_' + Date.now(),
        userId: order.customerId,
        title: `Order Cancelled #${orderId}`,
        message: `Your order has been cancelled. If payment was made, farm support will process your refund.`,
        type: 'order',
        isRead: false,
        link: `/dashboard/orders/${orderId}`,
        createdAt: new Date().toISOString()
      });

      writeDB(data);
      return order;
    },
    addAdminNote: (orderId, note) => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;
      order.adminNotes = note;
      order.updatedAt = new Date().toISOString();
      writeDB(data);
      return order;
    }
  },

  // DELIVERY LOCATIONS & CHARGES
  deliveryLocations: {
    getAll: (onlyActive = false) => {
      const locs = readDB().deliveryLocations || [];
      return onlyActive ? locs.filter(l => l.isActive) : locs;
    },
    findById: (id) => readDB().deliveryLocations.find(l => l.id === id) || null,
    create: (locData) => {
      const data = readDB();
      const newLoc = {
        id: locData.id || 'loc_' + Date.now(),
        name: locData.name,
        charge: Number(locData.charge) || 0,
        isActive: locData.isActive !== false,
        description: locData.description || '',
        estimatedDeliveryTime: locData.estimatedDeliveryTime || 'Same-day or next-day',
        createdAt: new Date().toISOString()
      };
      data.deliveryLocations.push(newLoc);
      writeDB(data);
      return newLoc;
    },
    update: (id, updates) => {
      const data = readDB();
      const index = data.deliveryLocations.findIndex(l => l.id === id);
      if (index === -1) return null;
      data.deliveryLocations[index] = {
        ...data.deliveryLocations[index],
        ...updates,
        charge: updates.charge !== undefined ? Number(updates.charge) : data.deliveryLocations[index].charge
      };
      writeDB(data);
      return data.deliveryLocations[index];
    },
    delete: (id) => {
      const data = readDB();
      data.deliveryLocations = data.deliveryLocations.filter(l => l.id !== id);
      writeDB(data);
      return true;
    }
  },

  // TESTIMONIALS
  testimonials: {
    getAll: (onlyActive = false) => {
      const tests = readDB().testimonials || [];
      return onlyActive ? tests.filter(t => t.isActive) : tests;
    },
    create: (testData) => {
      const data = readDB();
      const newTest = {
        id: testData.id || 'test_' + Date.now(),
        name: testData.name,
        roleOrTitle: testData.roleOrTitle || 'Verified Customer',
        content: testData.content,
        rating: Number(testData.rating) || 5,
        location: testData.location || 'Minna, Niger State',
        avatar: testData.avatar || '',
        isFeatured: Boolean(testData.isFeatured),
        isActive: testData.isActive !== false,
        createdAt: new Date().toISOString()
      };
      data.testimonials.push(newTest);
      writeDB(data);
      return newTest;
    },
    update: (id, updates) => {
      const data = readDB();
      const index = data.testimonials.findIndex(t => t.id === id);
      if (index === -1) return null;
      data.testimonials[index] = { ...data.testimonials[index], ...updates };
      writeDB(data);
      return data.testimonials[index];
    },
    delete: (id) => {
      const data = readDB();
      data.testimonials = data.testimonials.filter(t => t.id !== id);
      writeDB(data);
      return true;
    }
  },

  // NOTIFICATIONS
  notifications: {
    getByUserId: (userId) => {
      const all = readDB().notifications || [];
      return all
        .filter(n => n.userId === userId || n.userId === 'all')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    markAsRead: (id) => {
      const data = readDB();
      const notif = data.notifications.find(n => n.id === id);
      if (notif) {
        notif.isRead = true;
        writeDB(data);
      }
      return notif;
    },
    markAllAsRead: (userId) => {
      const data = readDB();
      data.notifications.forEach(n => {
        if (n.userId === userId || n.userId === 'all') n.isRead = true;
      });
      writeDB(data);
      return true;
    }
  },

  // WEBSITE CONTENT
  content: {
    get: () => readDB().content || INITIAL_DATA.content,
    update: (newContent) => {
      const data = readDB();
      data.content = { ...data.content, ...newContent };
      writeDB(data);
      return data.content;
    }
  },

  // BUSINESS SETTINGS
  settings: {
    get: () => {
      const s = readDB().settings || INITIAL_DATA.settings;
      return {
        ...s,
        businessName: s.businessName || s.farmName || 'Ragusma Farms NG®',
        farmName: s.farmName || s.businessName || 'Ragusma Farms NG®'
      };
    },
    update: (newSettings) => {
      const data = readDB();
      data.settings = { ...data.settings, ...newSettings };
      writeDB(data);
      return data.settings;
    }
  },

  // INVENTORY LOGS
  inventory: {
    getLogs: (productId = null) => {
      const logs = readDB().inventoryLogs || [];
      if (productId) return logs.filter(l => l.productId === productId);
      return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    adjustStock: (productId, amount, reason = 'adjustment', note = '', adminId = null) => {
      const prod = db.products.findById(productId);
      if (!prod) return null;
      const targetStock = Math.max(0, prod.stock + amount);
      return db.products.update(productId, {
        stock: targetStock,
        stockReason: `${reason}: ${note}`,
        isAvailable: targetStock > 0
      });
    }
  },

  // CUSTOMER ADDRESSES
  addresses: {
    getByUserId: (userId) => {
      const addrs = readDB().addresses || [];
      return addrs.filter(a => a.userId === userId);
    },
    create: (addrData) => {
      const data = readDB();
      const newAddr = {
        id: 'addr_' + Date.now(),
        userId: addrData.userId,
        label: addrData.label || 'Home',
        recipientName: addrData.recipientName,
        phone: addrData.phone,
        locationId: addrData.locationId,
        address: addrData.address,
        isDefault: Boolean(addrData.isDefault),
        createdAt: new Date().toISOString()
      };
      if (newAddr.isDefault) {
        data.addresses.forEach(a => {
          if (a.userId === addrData.userId) a.isDefault = false;
        });
      }
      data.addresses.push(newAddr);
      writeDB(data);
      return newAddr;
    },
    delete: (id) => {
      const data = readDB();
      data.addresses = data.addresses.filter(a => a.id !== id);
      writeDB(data);
      return true;
    }
  }
};

