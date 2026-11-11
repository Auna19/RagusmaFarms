import fs from 'fs';
import path from 'path';
import { getSupabaseAdmin } from './supabase.js';

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
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (_) {}
}

function readDB() {
  // Check /tmp fallback first for recent serverless updates
  try {
    const tmpPath = path.join('/tmp', 'ragusma_database.json');
    if (fs.existsSync(tmpPath)) {
      const raw = fs.readFileSync(tmpPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (_) {}

  ensureDataDir();
  if (!fs.existsSync(DB_PATH)) {
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
  try {
    ensureDataDir();
    const tempPath = `${DB_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, DB_PATH);
  } catch (err) {
    // Graceful fallback for serverless read-only filesystems (e.g., Vercel / AWS Lambda /var/task)
    try {
      const tmpPath = path.join('/tmp', 'ragusma_database.json');
      fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {
      console.warn("Could not write to local or /tmp database:", tmpErr.message);
    }
  }
}

// User object mapping between Supabase snake_case and application camelCase
function mapUserFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone || '',
    passwordHash: row.password_hash,
    role: row.role || 'customer',
    isActive: row.is_active !== false,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapUserToDb(user) {
  const row = {};
  if (user.id !== undefined) row.id = user.id;
  if (user.fullName !== undefined) row.full_name = user.fullName;
  if (user.email !== undefined) row.email = user.email ? user.email.toLowerCase().trim() : user.email;
  if (user.phone !== undefined) row.phone = user.phone;
  if (user.passwordHash !== undefined) row.password_hash = user.passwordHash;
  if (user.role !== undefined) row.role = user.role;
  if (user.isActive !== undefined) row.is_active = user.isActive;
  if (user.createdAt !== undefined) row.created_at = user.createdAt;
  if (user.updatedAt !== undefined) row.updated_at = user.updatedAt;
  return row;
}

// Categories mapping
function mapCategoryFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || '',
    image: row.image || '/assets/live-chicken-pasture.webp',
    isActive: row.is_active !== false,
    displayOrder: row.display_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapCategoryToDb(cat) {
  const row = {};
  if (cat.id !== undefined) row.id = cat.id;
  if (cat.name !== undefined) row.name = cat.name;
  if (cat.slug !== undefined) row.slug = cat.slug;
  if (cat.description !== undefined) row.description = cat.description;
  if (cat.image !== undefined) row.image = cat.image;
  if (cat.isActive !== undefined) row.is_active = cat.isActive;
  if (cat.displayOrder !== undefined) row.display_order = cat.displayOrder;
  return row;
}

// Products mapping
function mapProductFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryId: row.category_id,
    description: row.description || '',
    price: Number(row.price) || 0,
    promotionalPrice: row.promotional_price !== null && row.promotional_price !== undefined ? Number(row.promotional_price) : null,
    unit: row.unit || 'per bird',
    stock: Number(row.stock) || 0,
    isAvailable: row.is_available !== false,
    isFeatured: Boolean(row.is_featured),
    images: Array.isArray(row.images) ? row.images : [],
    specifications: row.specifications || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function mapProductToDb(prod) {
  const row = {};
  if (prod.id !== undefined) row.id = prod.id;
  if (prod.name !== undefined) row.name = prod.name;
  if (prod.slug !== undefined) row.slug = prod.slug;
  if (prod.categoryId !== undefined) row.category_id = prod.categoryId;
  if (prod.description !== undefined) row.description = prod.description;
  if (prod.price !== undefined) row.price = Number(prod.price);
  if (prod.promotionalPrice !== undefined) row.promotional_price = prod.promotionalPrice ? Number(prod.promotionalPrice) : null;
  if (prod.unit !== undefined) row.unit = prod.unit;
  if (prod.stock !== undefined) row.stock = Number(prod.stock);
  if (prod.isAvailable !== undefined) row.is_available = prod.isAvailable;
  if (prod.isFeatured !== undefined) row.is_featured = Boolean(prod.isFeatured);
  if (prod.images !== undefined) row.images = prod.images;
  if (prod.specifications !== undefined) row.specifications = prod.specifications;
  return row;
}

// Delivery Locations mapping
function mapLocationFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    state: row.state || 'Niger State',
    charge: Number(row.charge) || 0,
    estimatedDeliveryTime: row.estimated_time || 'Within 2 to 4 hours',
    estimatedTime: row.estimated_time || 'Within 2 to 4 hours',
    isActive: row.is_active !== false,
    createdAt: row.created_at
  };
}

function mapLocationToDb(loc) {
  const row = {};
  if (loc.id !== undefined) row.id = loc.id;
  if (loc.name !== undefined) row.name = loc.name;
  if (loc.state !== undefined) row.state = loc.state;
  if (loc.charge !== undefined) row.charge = Number(loc.charge);
  if (loc.estimatedDeliveryTime !== undefined || loc.estimatedTime !== undefined) {
    row.estimated_time = loc.estimatedDeliveryTime || loc.estimatedTime;
  }
  if (loc.isActive !== undefined) row.is_active = loc.isActive;
  return row;
}

// Testimonials mapping
function mapTestimonialFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.customer_name,
    customerName: row.customer_name,
    roleOrTitle: row.role_location,
    role: row.role_location,
    rating: Number(row.rating) || 5,
    content: row.comment,
    comment: row.comment,
    product: row.product_bought || 'Farm Produce',
    isActive: row.is_active !== false,
    createdAt: row.created_at
  };
}

function mapTestimonialToDb(t) {
  const row = {};
  if (t.id !== undefined) row.id = t.id;
  if (t.name !== undefined || t.customerName !== undefined) row.customer_name = t.name || t.customerName;
  if (t.roleOrTitle !== undefined || t.role !== undefined || t.location !== undefined) {
    row.role_location = t.roleOrTitle || t.role || t.location || 'Verified Customer';
  }
  if (t.rating !== undefined) row.rating = Number(t.rating) || 5;
  if (t.content !== undefined || t.comment !== undefined) row.comment = t.content || t.comment;
  if (t.product !== undefined || t.productBought !== undefined) row.product_bought = t.product || t.productBought;
  if (t.isActive !== undefined) row.is_active = t.isActive;
  return row;
}

// Orders mapping
function mapOrderFromDb(row) {
  if (!row) return null;
  const items = (row.order_items || []).map(it => ({
    id: it.id,
    orderId: it.order_id,
    productId: it.product_id,
    productName: it.product_name,
    productUnit: it.product_unit,
    unitPrice: Number(it.unit_price) || 0,
    quantity: Number(it.quantity) || 1,
    subtotal: Number(it.subtotal) || 0,
    productImage: it.product_image || '/assets/live-chicken-pasture.webp'
  }));

  const history = (row.order_status_history || []).map(h => ({
    id: h.id,
    orderId: h.order_id,
    previousStatus: h.previous_status,
    newStatus: h.new_status,
    changedBy: h.changed_by,
    note: h.note,
    createdAt: h.created_at
  })).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    id: row.id,
    orderNumber: row.order_number,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    deliveryMethod: row.delivery_method,
    deliveryLocationId: row.delivery_location_id,
    deliveryLocationName: row.delivery_location_name,
    deliveryAddress: row.delivery_address,
    deliveryFee: Number(row.delivery_fee) || 0,
    subtotal: Number(row.subtotal) || 0,
    totalAmount: Number(row.total_amount) || 0,
    paymentStatus: row.payment_status,
    paymentMethod: row.payment_method,
    paymentReference: row.payment_reference,
    orderStatus: row.order_status,
    status: row.order_status,
    customerNotes: row.customer_notes || '',
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
    history,
    statusHistory: history
  };
}

// Notifications mapping
function mapNotificationFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type || 'order',
    isRead: Boolean(row.is_read),
    link: row.link || null,
    createdAt: row.created_at
  };
}

// Addresses mapping
function mapAddressFromDb(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title || 'Home',
    label: row.title || 'Home',
    recipientName: row.recipient_name,
    phone: row.phone,
    locationId: row.location_id,
    streetAddress: row.street_address,
    address: row.street_address,
    isDefault: Boolean(row.is_default),
    createdAt: row.created_at
  };
}

// Relational Operations
export const db = {
  // USERS
  users: {
    getAll: async () => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            return data.map(mapUserFromDb);
          }
          if (error) console.warn('Supabase users.getAll error:', error.message);
        } catch (err) {
          console.warn('Supabase users.getAll exception:', err.message);
        }
      }
      return readDB().users;
    },
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .maybeSingle();
          if (!error && data) {
            return mapUserFromDb(data);
          }
        } catch (err) {
          console.warn('Supabase users.findById exception:', err.message);
        }
      }
      return readDB().users.find(u => u.id === id) || null;
    },
    findByEmail: async (email) => {
      if (!email) return null;
      const cleanEmail = email.toLowerCase().trim();
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .ilike('email', cleanEmail)
            .limit(1);
          if (!error && data && data.length > 0) {
            return mapUserFromDb(data[0]);
          }
        } catch (err) {
          console.warn('Supabase users.findByEmail exception:', err.message);
        }
      }
      return readDB().users.find(u => u.email && u.email.toLowerCase() === cleanEmail) || null;
    },
    create: async (userData) => {
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

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('users')
            .insert([mapUserToDb(newUser)])
            .select()
            .single();

          if (error) {
            console.error('Supabase user insert error:', error.message);
          } else if (data) {
            try {
              const local = readDB();
              local.users.push(newUser);
              writeDB(local);
            } catch (_) {}
            return mapUserFromDb(data);
          }
        } catch (err) {
          console.error('Supabase user create exception:', err.message);
        }
      }

      // Local JSON fallback
      const data = readDB();
      data.users.push(newUser);
      writeDB(data);
      return newUser;
    },
    update: async (id, updates) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const rowUpdates = mapUserToDb({ ...updates, updatedAt: new Date().toISOString() });
          const { data, error } = await supabase
            .from('users')
            .update(rowUpdates)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) {
            try {
              const local = readDB();
              const idx = local.users.findIndex(u => u.id === id);
              if (idx !== -1) {
                local.users[idx] = { ...local.users[idx], ...updates, updatedAt: new Date().toISOString() };
                writeDB(local);
              }
            } catch (_) {}
            return mapUserFromDb(data);
          }
        } catch (err) {
          console.warn('Supabase users.update exception:', err.message);
        }
      }

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
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('users').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase users.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.users = data.users.filter(u => u.id !== id);
      writeDB(data);
      return true;
    }
  },

  // CATEGORIES
  categories: {
    getAll: async (onlyActive = false) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('categories').select('*').order('display_order', { ascending: true });
          if (onlyActive) query = query.eq('is_active', true);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map(mapCategoryFromDb);
          }
        } catch (err) {
          console.warn('Supabase categories.getAll exception:', err.message);
        }
      }
      const cats = readDB().categories || [];
      return onlyActive ? cats.filter(c => c.isActive) : cats;
    },
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('categories').select('*').eq('id', id).maybeSingle();
          if (!error && data) return mapCategoryFromDb(data);
        } catch (err) {
          console.warn('Supabase categories.findById exception:', err.message);
        }
      }
      return readDB().categories.find(c => c.id === id) || null;
    },
    findBySlug: async (slug) => {
      if (!slug) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
          if (!error && data) return mapCategoryFromDb(data);
        } catch (err) {
          console.warn('Supabase categories.findBySlug exception:', err.message);
        }
      }
      return readDB().categories.find(c => c.slug === slug) || null;
    },
    create: async (catData) => {
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
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('categories').insert([mapCategoryToDb(newCat)]).select().single();
          if (!error && sbData) {
            try {
              data.categories.push(newCat);
              writeDB(data);
            } catch (_) {}
            return mapCategoryFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase categories.create exception:', err.message);
        }
      }
      data.categories.push(newCat);
      writeDB(data);
      return newCat;
    },
    update: async (id, updates) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('categories').update(mapCategoryToDb(updates)).eq('id', id).select().single();
          if (!error && sbData) {
            try {
              const local = readDB();
              const idx = local.categories.findIndex(c => c.id === id);
              if (idx !== -1) {
                local.categories[idx] = { ...local.categories[idx], ...updates };
                writeDB(local);
              }
            } catch (_) {}
            return mapCategoryFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase categories.update exception:', err.message);
        }
      }
      const data = readDB();
      const index = data.categories.findIndex(c => c.id === id);
      if (index === -1) return null;
      data.categories[index] = { ...data.categories[index], ...updates };
      writeDB(data);
      return data.categories[index];
    },
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('categories').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase categories.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.categories = data.categories.filter(c => c.id !== id);
      writeDB(data);
      return true;
    }
  },

  // PRODUCTS
  products: {
    getAll: async (filter = {}) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('products').select('*').order('created_at', { ascending: false });
          if (filter.onlyActive) query = query.eq('is_available', true);
          if (filter.categoryId) query = query.eq('category_id', filter.categoryId);
          if (filter.featuredOnly) query = query.eq('is_featured', true);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            let list = data.map(mapProductFromDb);
            if (filter.search) {
              const q = filter.search.toLowerCase();
              list = list.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
            }
            return list;
          }
        } catch (err) {
          console.warn('Supabase products.getAll exception:', err.message);
        }
      }
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
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
          if (!error && data) return mapProductFromDb(data);
        } catch (err) {
          console.warn('Supabase products.findById exception:', err.message);
        }
      }
      return readDB().products.find(p => p.id === id) || null;
    },
    findBySlug: async (slug) => {
      if (!slug) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
          if (!error && data) return mapProductFromDb(data);
        } catch (err) {
          console.warn('Supabase products.findBySlug exception:', err.message);
        }
      }
      return readDB().products.find(p => p.slug === slug) || null;
    },
    create: async (prodData) => {
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

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('products').insert([mapProductToDb(newProd)]).select().single();
          if (!error && sbData) {
            try {
              data.products.push(newProd);
              writeDB(data);
            } catch (_) {}
            return mapProductFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase products.create exception:', err.message);
        }
      }

      data.products.push(newProd);
      writeDB(data);
      return newProd;
    },
    update: async (id, updates) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const dbUpdates = mapProductToDb({ ...updates, updatedAt: new Date().toISOString() });
          const { data: sbData, error } = await supabase.from('products').update(dbUpdates).eq('id', id).select().single();
          if (!error && sbData) {
            try {
              const local = readDB();
              const idx = local.products.findIndex(p => p.id === id);
              if (idx !== -1) {
                local.products[idx] = { ...local.products[idx], ...updates, updatedAt: new Date().toISOString() };
                writeDB(local);
              }
            } catch (_) {}
            return mapProductFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase products.update exception:', err.message);
        }
      }
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
      data.products[index] = updated;
      writeDB(data);
      return updated;
    },
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('products').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase products.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.products = data.products.filter(p => p.id !== id);
      writeDB(data);
      return true;
    }
  },

  // ORDERS
  orders: {
    getAll: async (filter = {}) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('orders').select('*, order_items(*), order_status_history(*)').order('created_at', { ascending: false });
          if (filter.customerId) query = query.eq('customer_id', filter.customerId);
          if (filter.status) query = query.eq('order_status', filter.status);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map(mapOrderFromDb);
          }
        } catch (err) {
          console.warn('Supabase orders.getAll exception:', err.message);
        }
      }
      let ords = readDB().orders || [];
      if (filter.customerId) ords = ords.filter(o => o.customerId === filter.customerId);
      if (filter.status) ords = ords.filter(o => o.orderStatus === filter.status);
      return ords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('orders').select('*, order_items(*), order_status_history(*)').eq('id', id).maybeSingle();
          if (!error && data) return mapOrderFromDb(data);
        } catch (err) {
          console.warn('Supabase orders.findById exception:', err.message);
        }
      }
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
    create: async (orderPayload) => {
      const data = readDB();
      const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      const newOrder = {
        id: orderId,
        orderNumber: orderId,
        customerId: orderPayload.customerId,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        customerPhone: orderPayload.customerPhone,
        deliveryMethod: orderPayload.deliveryMethod,
        deliveryLocationId: orderPayload.deliveryLocationId || null,
        deliveryLocationName: orderPayload.deliveryLocationName || 'Farm Pickup',
        deliveryAddress: orderPayload.deliveryAddress || 'Farm Pickup Counter',
        deliveryFee: Number(orderPayload.deliveryFee) || 0,
        subtotal: Number(orderPayload.subtotal),
        totalAmount: Number(orderPayload.totalAmount),
        paymentStatus: orderPayload.paymentStatus || 'pending',
        paymentMethod: orderPayload.paymentMethod || 'test_mode',
        paymentReference: orderPayload.paymentReference || 'REF-' + Date.now(),
        orderStatus: 'Pending',
        status: 'Pending',
        customerNotes: orderPayload.customerNotes || '',
        adminNotes: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      data.orders.push(newOrder);

      const createdItems = (orderPayload.items || []).map((item, idx) => ({
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

      writeDB(data);

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('orders').insert([{
            id: newOrder.id,
            order_number: newOrder.orderNumber,
            customer_id: newOrder.customerId,
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail,
            customer_phone: newOrder.customerPhone,
            delivery_method: newOrder.deliveryMethod,
            delivery_location_id: newOrder.deliveryLocationId,
            delivery_location_name: newOrder.deliveryLocationName,
            delivery_address: newOrder.deliveryAddress,
            delivery_fee: newOrder.deliveryFee,
            subtotal: newOrder.subtotal,
            total_amount: newOrder.totalAmount,
            payment_status: newOrder.paymentStatus,
            payment_method: newOrder.paymentMethod,
            payment_reference: newOrder.paymentReference,
            order_status: newOrder.orderStatus,
            customer_notes: newOrder.customerNotes,
            admin_notes: newOrder.adminNotes,
            created_at: newOrder.createdAt,
            updated_at: newOrder.updatedAt
          }]);

          if (createdItems.length > 0) {
            await supabase.from('order_items').insert(createdItems.map(it => ({
              id: it.id,
              order_id: it.orderId,
              product_id: it.productId,
              product_name: it.productName,
              product_unit: it.productUnit,
              unit_price: it.unitPrice,
              quantity: it.quantity,
              subtotal: it.subtotal,
              product_image: it.productImage
            })));
          }

          await supabase.from('order_status_history').insert([{
            id: 'hist_' + Date.now(),
            order_id: orderId,
            previous_status: null,
            new_status: 'Pending',
            changed_by: orderPayload.customerName || 'Customer',
            note: 'Order successfully placed by customer.'
          }]);
        } catch (sbErr) {
          console.warn('Supabase order creation exception:', sbErr.message);
        }
      }

      return { ...newOrder, items: createdItems };
    },
    updateStatus: async (orderId, newStatus, changedBy = 'Admin', note = '') => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      order.orderStatus = newStatus;
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();

      data.orderStatusHistory.push({
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        orderId,
        previousStatus: order.orderStatus,
        newStatus,
        changedBy,
        note: note || `Order status updated to ${newStatus}.`,
        createdAt: new Date().toISOString()
      });

      writeDB(data);

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('orders').update({
            order_status: newStatus,
            updated_at: order.updatedAt
          }).eq('id', orderId);

          await supabase.from('order_status_history').insert([{
            id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            order_id: orderId,
            previous_status: order.orderStatus,
            new_status: newStatus,
            changed_by: changedBy,
            note: note || `Order status updated to ${newStatus}.`
          }]);
        } catch (err) {
          console.warn('Supabase orders.updateStatus exception:', err.message);
        }
      }

      return order;
    },
    updatePaymentStatus: async (orderId, paymentStatus, paymentReference = null) => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      order.paymentStatus = paymentStatus;
      if (paymentReference) order.paymentReference = paymentReference;
      order.updatedAt = new Date().toISOString();

      if (paymentStatus === 'successful' && order.orderStatus === 'Pending') {
        order.orderStatus = 'Confirmed';
      }

      writeDB(data);

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('orders').update({
            payment_status: paymentStatus,
            order_status: order.orderStatus,
            payment_reference: order.paymentReference,
            updated_at: order.updatedAt
          }).eq('id', orderId);
        } catch (err) {
          console.warn('Supabase orders.updatePaymentStatus exception:', err.message);
        }
      }

      return order;
    },
    cancelOrder: async (orderId, cancelledBy = 'Customer', reason = '') => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;

      order.orderStatus = 'Cancelled';
      order.status = 'Cancelled';
      order.updatedAt = new Date().toISOString();

      writeDB(data);

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('orders').update({
            order_status: 'Cancelled',
            updated_at: order.updatedAt
          }).eq('id', orderId);

          await supabase.from('order_status_history').insert([{
            id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            order_id: orderId,
            previous_status: order.orderStatus,
            new_status: 'Cancelled',
            changed_by: cancelledBy,
            note: reason || `Order cancelled by ${cancelledBy}.`
          }]);
        } catch (err) {
          console.warn('Supabase orders.cancelOrder exception:', err.message);
        }
      }

      return order;
    },
    addAdminNote: async (orderId, note) => {
      const data = readDB();
      const order = data.orders.find(o => o.id === orderId);
      if (!order) return null;
      order.adminNotes = note;
      order.updatedAt = new Date().toISOString();
      writeDB(data);

      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('orders').update({
            admin_notes: note,
            updated_at: order.updatedAt
          }).eq('id', orderId);
        } catch (err) {
          console.warn('Supabase orders.addAdminNote exception:', err.message);
        }
      }

      return order;
    }
  },

  // DELIVERY LOCATIONS & CHARGES
  deliveryLocations: {
    getAll: async (onlyActive = false) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('delivery_locations').select('*').order('created_at', { ascending: true });
          if (onlyActive) query = query.eq('is_active', true);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map(mapLocationFromDb);
          }
        } catch (err) {
          console.warn('Supabase deliveryLocations.getAll exception:', err.message);
        }
      }
      const locs = readDB().deliveryLocations || [];
      return onlyActive ? locs.filter(l => l.isActive) : locs;
    },
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('delivery_locations').select('*').eq('id', id).maybeSingle();
          if (!error && data) return mapLocationFromDb(data);
        } catch (err) {
          console.warn('Supabase deliveryLocations.findById exception:', err.message);
        }
      }
      return readDB().deliveryLocations.find(l => l.id === id) || null;
    },
    create: async (locData) => {
      const data = readDB();
      const newLoc = {
        id: locData.id || 'loc_' + Date.now(),
        name: locData.name,
        state: locData.state || 'Niger State',
        charge: Number(locData.charge) || 0,
        estimatedDeliveryTime: locData.estimatedDeliveryTime || 'Within 2 to 4 hours',
        isActive: locData.isActive !== false,
        createdAt: new Date().toISOString()
      };
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('delivery_locations').insert([mapLocationToDb(newLoc)]).select().single();
          if (!error && sbData) {
            try {
              data.deliveryLocations.push(newLoc);
              writeDB(data);
            } catch (_) {}
            return mapLocationFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase deliveryLocations.create exception:', err.message);
        }
      }
      data.deliveryLocations.push(newLoc);
      writeDB(data);
      return newLoc;
    },
    update: async (id, updates) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('delivery_locations').update(mapLocationToDb(updates)).eq('id', id).select().single();
          if (!error && sbData) {
            try {
              const local = readDB();
              const idx = local.deliveryLocations.findIndex(l => l.id === id);
              if (idx !== -1) {
                local.deliveryLocations[idx] = { ...local.deliveryLocations[idx], ...updates };
                writeDB(local);
              }
            } catch (_) {}
            return mapLocationFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase deliveryLocations.update exception:', err.message);
        }
      }
      const data = readDB();
      const index = data.deliveryLocations.findIndex(l => l.id === id);
      if (index === -1) return null;
      data.deliveryLocations[index] = { ...data.deliveryLocations[index], ...updates };
      writeDB(data);
      return data.deliveryLocations[index];
    },
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('delivery_locations').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase deliveryLocations.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.deliveryLocations = data.deliveryLocations.filter(l => l.id !== id);
      writeDB(data);
      return true;
    }
  },

  // TESTIMONIALS
  testimonials: {
    getAll: async (onlyActive = false) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
          if (onlyActive) query = query.eq('is_active', true);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map(mapTestimonialFromDb);
          }
        } catch (err) {
          console.warn('Supabase testimonials.getAll exception:', err.message);
        }
      }
      const tests = readDB().testimonials || [];
      return onlyActive ? tests.filter(t => t.isActive) : tests;
    },
    findById: async (id) => {
      if (!id) return null;
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('testimonials').select('*').eq('id', id).maybeSingle();
          if (!error && data) return mapTestimonialFromDb(data);
        } catch (err) {
          console.warn('Supabase testimonials.findById exception:', err.message);
        }
      }
      return readDB().testimonials.find(t => t.id === id) || null;
    },
    create: async (testData) => {
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
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('testimonials').insert([mapTestimonialToDb(newTest)]).select().single();
          if (!error && sbData) {
            try {
              data.testimonials.push(newTest);
              writeDB(data);
            } catch (_) {}
            return mapTestimonialFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase testimonials.create exception:', err.message);
        }
      }
      data.testimonials.push(newTest);
      writeDB(data);
      return newTest;
    },
    update: async (id, updates) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('testimonials').update(mapTestimonialToDb(updates)).eq('id', id).select().single();
          if (!error && sbData) {
            try {
              const local = readDB();
              const idx = local.testimonials.findIndex(t => t.id === id);
              if (idx !== -1) {
                local.testimonials[idx] = { ...local.testimonials[idx], ...updates };
                writeDB(local);
              }
            } catch (_) {}
            return mapTestimonialFromDb(sbData);
          }
        } catch (err) {
          console.warn('Supabase testimonials.update exception:', err.message);
        }
      }
      const data = readDB();
      const index = data.testimonials.findIndex(t => t.id === id);
      if (index === -1) return null;
      data.testimonials[index] = { ...data.testimonials[index], ...updates };
      writeDB(data);
      return data.testimonials[index];
    },
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('testimonials').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase testimonials.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.testimonials = data.testimonials.filter(t => t.id !== id);
      writeDB(data);
      return true;
    }
  },

  // NOTIFICATIONS
  notifications: {
    getByUserId: async (userId) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('notifications')
            .select('*')
            .or(`user_id.eq.${userId},user_id.eq.all`)
            .order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            return data.map(mapNotificationFromDb);
          }
        } catch (err) {
          console.warn('Supabase notifications.getByUserId exception:', err.message);
        }
      }
      const all = readDB().notifications || [];
      return all
        .filter(n => n.userId === userId || n.userId === 'all')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    markAsRead: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        } catch (err) {
          console.warn('Supabase notifications.markAsRead exception:', err.message);
        }
      }
      const data = readDB();
      const notif = data.notifications.find(n => n.id === id);
      if (notif) {
        notif.isRead = true;
        writeDB(data);
      }
      return notif;
    },
    markAllAsRead: async (userId) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
        } catch (err) {
          console.warn('Supabase notifications.markAllAsRead exception:', err.message);
        }
      }
      const data = readDB();
      data.notifications.forEach(n => {
        if (n.userId === userId || n.userId === 'all') n.isRead = true;
      });
      writeDB(data);
      return true;
    }
  },

  // WEBSITE CONTENT CMS
  content: {
    get: async () => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('website_content').select('data').eq('id', 'current').maybeSingle();
          if (!error && data?.data) return data.data;
        } catch (err) {
          console.warn('Supabase content.get exception:', err.message);
        }
      }
      return readDB().content || INITIAL_DATA.content;
    },
    update: async (newContent) => {
      const data = readDB();
      const merged = { ...data.content, ...newContent };
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('website_content').upsert({ id: 'current', data: merged, updated_at: new Date().toISOString() });
        } catch (err) {
          console.warn('Supabase content.update exception:', err.message);
        }
      }
      data.content = merged;
      writeDB(data);
      return merged;
    }
  },

  // BUSINESS SETTINGS
  settings: {
    get: async () => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('business_settings').select('data').eq('id', 'current').maybeSingle();
          if (!error && data?.data) {
            const s = data.data;
            return {
              ...s,
              businessName: s.businessName || s.farmName || 'Ragusma Farms NG®',
              farmName: s.farmName || s.businessName || 'Ragusma Farms NG®'
            };
          }
        } catch (err) {
          console.warn('Supabase settings.get exception:', err.message);
        }
      }
      const s = readDB().settings || INITIAL_DATA.settings;
      return {
        ...s,
        businessName: s.businessName || s.farmName || 'Ragusma Farms NG®',
        farmName: s.farmName || s.businessName || 'Ragusma Farms NG®'
      };
    },
    update: async (newSettings) => {
      const data = readDB();
      const merged = { ...data.settings, ...newSettings };
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('business_settings').upsert({ id: 'current', data: merged, updated_at: new Date().toISOString() });
        } catch (err) {
          console.warn('Supabase settings.update exception:', err.message);
        }
      }
      data.settings = merged;
      writeDB(data);
      return merged;
    }
  },

  // INVENTORY LOGS
  inventory: {
    getLogs: async (productId = null) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          let query = supabase.from('inventory_logs').select('*').order('created_at', { ascending: false });
          if (productId) query = query.eq('product_id', productId);
          const { data, error } = await query;
          if (!error && Array.isArray(data)) {
            return data.map(l => ({
              id: l.id,
              productId: l.product_id,
              changeAmount: l.change_amount,
              previousStock: l.previous_stock,
              newStock: l.new_stock,
              reason: l.reason,
              referenceId: l.reference_id,
              createdAt: l.created_at
            }));
          }
        } catch (err) {
          console.warn('Supabase inventory.getLogs exception:', err.message);
        }
      }
      const logs = readDB().inventoryLogs || [];
      if (productId) return logs.filter(l => l.productId === productId);
      return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    adjustStock: async (productId, amount, reason = 'adjustment', note = '', adminId = null) => {
      const prod = await db.products.findById(productId);
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
    getByUserId: async (userId) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
          if (!error && Array.isArray(data)) {
            return data.map(mapAddressFromDb);
          }
        } catch (err) {
          console.warn('Supabase addresses.getByUserId exception:', err.message);
        }
      }
      const addrs = readDB().addresses || [];
      return addrs.filter(a => a.userId === userId);
    },
    create: async (addrData) => {
      const newAddr = {
        id: 'addr_' + Date.now(),
        userId: addrData.userId,
        title: addrData.title || addrData.label || 'Home',
        recipientName: addrData.recipientName,
        phone: addrData.phone,
        locationId: addrData.locationId,
        streetAddress: addrData.streetAddress || addrData.address,
        isDefault: Boolean(addrData.isDefault),
        createdAt: new Date().toISOString()
      };
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          const { data: sbData, error } = await supabase.from('addresses').insert([{
            id: newAddr.id,
            user_id: newAddr.userId,
            title: newAddr.title,
            recipient_name: newAddr.recipientName,
            phone: newAddr.phone,
            location_id: newAddr.locationId,
            street_address: newAddr.streetAddress,
            is_default: newAddr.isDefault,
            created_at: newAddr.createdAt
          }]).select().single();
          if (!error && sbData) return mapAddressFromDb(sbData);
        } catch (err) {
          console.warn('Supabase addresses.create exception:', err.message);
        }
      }
      const data = readDB();
      if (newAddr.isDefault) {
        data.addresses.forEach(a => {
          if (a.userId === addrData.userId) a.isDefault = false;
        });
      }
      data.addresses.push(newAddr);
      writeDB(data);
      return newAddr;
    },
    delete: async (id) => {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        try {
          await supabase.from('addresses').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase addresses.delete exception:', err.message);
        }
      }
      const data = readDB();
      data.addresses = data.addresses.filter(a => a.id !== id);
      writeDB(data);
      return true;
    }
  }
};

