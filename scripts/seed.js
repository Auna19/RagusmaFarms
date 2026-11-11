import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'database.json');

async function seed() {
  console.log("Seeding Ragusma Farms database...");

  const adminPasswordHash = await bcrypt.hash('AdminPassword2026!', 10);
  const customerPasswordHash = await bcrypt.hash('CustomerPassword123!', 10);

  const users = [
    {
      id: 'usr_admin_001',
      fullName: 'Alhaji Madaki (Farm Executive)',
      email: 'admin@ragusmafarms.com',
      phone: '+234 813 583 4368',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'usr_cust_001',
      fullName: 'Ibrahim Sani',
      email: 'customer@gmail.com',
      phone: '+234 802 345 6789',
      passwordHash: customerPasswordHash,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const categories = [
    {
      id: 'cat_live_chicken',
      name: 'Live Chicken',
      slug: 'live-chicken',
      description: 'Healthy, vigorous, farm-raised live broilers, layers, and cockerels nurtured on nutritious feed.',
      image: '/assets/live-chicken-pasture.webp',
      isActive: true,
      displayOrder: 1,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cat_frozen_chicken',
      name: 'Frozen Chicken',
      slug: 'frozen-chicken',
      description: 'Hygienically slaughtered, properly dressed, and flash-frozen chicken ready for family cooking and catering.',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cat_rabbits',
      name: 'Rabbits',
      slug: 'rabbits',
      description: 'Breeding pairs and meat rabbits raised in clean, well-ventilated rabbitries with organic greens and concentrates.',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cat_fish',
      name: 'Fish',
      slug: 'fish',
      description: 'Fresh live catfish harvested directly from our freshwater earthen and concrete ponds.',
      image: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cat_manure',
      name: 'Animal Dung & Organic Manure',
      slug: 'organic-manure',
      description: 'Rich, sun-dried, cured organic poultry and livestock dung for high-yield soil fertility and vegetable farming.',
      image: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      displayOrder: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 'cat_consultation',
      name: 'Farm Consultation',
      slug: 'farm-consultation',
      description: 'One-on-one professional agricultural advisory, livestock pen design, disease prevention, and farm management setup.',
      image: '/assets/meet-ceo.webp',
      isActive: true,
      displayOrder: 6,
      createdAt: new Date().toISOString()
    }
  ];

  const products = [
    {
      id: 'prod_live_broiler',
      name: 'Heavyweight Farm Broiler (Live Chicken)',
      slug: 'heavyweight-farm-broiler-live',
      categoryId: 'cat_live_chicken',
      description: 'Naturally grown, plump, and healthy broiler chickens raised in open-air conditions. Weighs between 2.5kg and 3.2kg. Ideal for Sunday family stew, celebrations, and bulk culinary needs.',
      price: 6500,
      promotionalPrice: 6200,
      unit: 'per bird',
      stock: 120,
      isAvailable: true,
      isFeatured: true,
      images: [
        '/assets/live-chicken-pasture.webp',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80',
        '/assets/brand-sheet.webp'
      ],
      specifications: {
        "Average Weight": "2.6kg – 3.2kg",
        "Feeding": "100% Quality Grain & Natural Forage",
        "Health Status": "Vaccinated, Disease-free, Vet-inspected",
        "Age": "8–9 Weeks Mature",
        "Origin": "Ragusma Farms, Minna"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_cockerel_noiler',
      name: 'Premium Local-Cross Cockerel / Noiler',
      slug: 'premium-cockerel-noiler-live',
      categoryId: 'cat_live_chicken',
      description: 'Hardy, muscular, organic noiler chickens with rich, flavorful meat that holds up wonderfully in traditional Nigerian soups and pepper soup.',
      price: 5800,
      promotionalPrice: null,
      unit: 'per bird',
      stock: 75,
      isAvailable: true,
      isFeatured: false,
      images: [
        '/assets/live-chicken-pasture.webp',
        'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        "Average Weight": "2.0kg – 2.5kg",
        "Meat Texture": "Firm & Highly Flavorful",
        "Health Status": "Fully Immunized",
        "Usage": "Pepper soup, Jollof, Braised meat"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_dressed_frozen_chicken',
      name: 'Whole Dressed & Cleaned Frozen Chicken',
      slug: 'whole-dressed-frozen-chicken',
      categoryId: 'cat_frozen_chicken',
      description: 'Slaughtered strictly according to hygienic standards, meticulously de-feathered, gutted, cleaned, vacuum sealed, and blast frozen to preserve freshness and nutrients.',
      price: 7200,
      promotionalPrice: 6900,
      unit: 'per pack (whole bird)',
      stock: 90,
      isAvailable: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        "Net Weight": "2.2kg – 2.5kg dressed",
        "Packaging": "Vacuum sealed food-grade polythene",
        "Storage": "Keep frozen at -18°C or below",
        "Preparation": "Ready to marinate and cook"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_breeding_rabbit_pair',
      name: 'Healthy Farm Rabbits (Breeding Pair)',
      slug: 'healthy-farm-rabbits-breeding-pair',
      categoryId: 'cat_rabbits',
      description: 'Active, healthy breeding pair (1 Buck + 1 Doe) of New Zealand White & Chinchilla crossbreeds. High reproductive yield, fast growth, and docile temperament.',
      price: 14000,
      promotionalPrice: 13500,
      unit: 'per pair (1 buck + 1 doe)',
      stock: 24,
      isAvailable: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518796745738-41048802f99a?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        "Age": "5–6 Months (Breeding Age)",
        "Breed": "New Zealand White / Chinchilla Hybrid",
        "Health": "Dewormed, Ear Canker Free",
        "Diet": "Elephant Grass, Sweet Potato Leaves, Commercial Pellets"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_table_size_catfish',
      name: 'Fresh Table-Size Live Catfish',
      slug: 'fresh-table-size-live-catfish',
      categoryId: 'cat_fish',
      description: 'Sweet, freshwater catfish harvested right upon order from our clean spring-fed ponds. Succulent texture, ideal for point-and-kill pepper soup, oven grilling, or smoking.',
      price: 3800,
      promotionalPrice: null,
      unit: 'per kg (approx. 1-2 fish)',
      stock: 180,
      isAvailable: true,
      isFeatured: true,
      images: [
        'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1534482421-64566f976cfa?auto=format&fit=crop&w=800&q=80'
      ],
      specifications: {
        "Size Range": "1.0kg – 1.8kg per piece",
        "Water Type": "Fresh Aerated Borehole Ponds",
        "State": "Harvested Live at pickup or prepped upon request",
        "Taste": "Zero mud smell, firm white flesh"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_cured_poultry_manure',
      name: 'Cured Organic Poultry Manure (50kg Bag)',
      slug: 'cured-organic-poultry-manure-50kg',
      categoryId: 'cat_manure',
      description: 'Aged, well-aerated, dry organic poultry manure rich in natural Nitrogen, Phosphorus, and Potassium (NPK). Dramatically enriches soil structure and boosts vegetable & crop yields.',
      price: 2500,
      promotionalPrice: null,
      unit: 'per 50kg bag',
      stock: 250,
      isAvailable: true,
      isFeatured: false,
      images: [
        'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=800&q=80',
        '/assets/sustainable-farming.webp'
      ],
      specifications: {
        "Package Size": "50kg Woven Polypropylene Bag",
        "Moisture Content": "Low (< 18%)",
        "Treatment": "Composted & Odor-Reduced",
        "Recommended For": "Maize, Yam, Vegetables, Citrus, Fruit Orchards"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'prod_farm_consultation',
      name: 'Agricultural & Livestock Farm Consultation',
      slug: 'agricultural-livestock-farm-consultation',
      categoryId: 'cat_consultation',
      description: 'Comprehensive 1-on-1 advisory session with Ragusma Farms experienced agricultural directors. Covers poultry pen layout, biosecurity protocols, feed formulation, disease management, and agribusiness economics.',
      price: 25000,
      promotionalPrice: 20000,
      unit: 'per session (physical or virtual)',
      stock: 50,
      isAvailable: true,
      isFeatured: true,
      images: [
        '/assets/meet-ceo.webp',
        '/assets/about-heritage.webp'
      ],
      specifications: {
        "Duration": "2 Hours Intensive Consultation",
        "Format": "On-farm walk-through or live video consultation",
        "Includes": "Custom advisory checklist and 1-month follow-up support",
        "Lead Consultant": "Madaki Brothers & Agricultural Experts"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const deliveryLocations = [
    {
      id: 'loc_tunga',
      name: 'Tunga',
      charge: 0,
      isActive: true,
      isFreeDefault: true,
      description: 'Free doorstep delivery within Tunga municipal zone.',
      estimatedDeliveryTime: 'Within 2–4 hours'
    },
    {
      id: 'loc_bakungu',
      name: 'Bakungu',
      charge: 1000,
      isActive: true,
      isFreeDefault: false,
      description: 'Flat rate delivery to Bakungu community.',
      estimatedDeliveryTime: 'Same day (3–5 hours)'
    },
    {
      id: 'loc_bosu',
      name: 'Bosu',
      charge: 1000,
      isActive: true,
      isFreeDefault: false,
      description: 'Flat rate delivery to Bosu residential & commercial area.',
      estimatedDeliveryTime: 'Same day (3–5 hours)'
    },
    {
      id: 'loc_mokunkele',
      name: 'Mokunkele',
      charge: 1000,
      isActive: true,
      isFreeDefault: false,
      description: 'Flat rate delivery to Mokunkele corridor.',
      estimatedDeliveryTime: 'Same day (3–5 hours)'
    },
    {
      id: 'loc_shango',
      name: 'Shango',
      charge: 1000,
      isActive: true,
      isFreeDefault: false,
      description: 'Flat rate delivery to Shango district.',
      estimatedDeliveryTime: 'Same day (3–5 hours)'
    }
  ];

  const testimonials = [
    {
      id: 'test_001',
      name: 'Hajiya Fatima Aliyu',
      roleOrTitle: 'Restaurateur, Tunga Kitchens',
      content: 'We order broilers and catfish weekly from Ragusma Farms. The chickens are huge, completely healthy, and the free delivery to our restaurant in Tunga is always on time!',
      rating: 5,
      location: 'Tunga, Minna',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'test_002',
      name: 'Engr. Daniel Okon',
      roleOrTitle: 'Commercial Crop Farmer',
      content: 'The dried organic poultry manure from Ragusma Farms doubled our maize and pepper harvest this season. Zero chemical burn and truly organic soil enrichment. Highly recommended!',
      rating: 5,
      location: 'Bosu Area',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'test_003',
      name: 'Aisha Mohammed',
      roleOrTitle: 'Household Caterer',
      content: 'Their frozen dressed chicken is so clean, with zero feather residues, nicely packaged, and sweet when cooked. Ordering on the website was quick and seamless.',
      rating: 5,
      location: 'Mokunkele',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isFeatured: true,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ];

  // Initial Seed Order to showcase real order tracking and stats
  const sampleOrderId = 'ORD-849201';
  const sampleOrder = {
    id: sampleOrderId,
    orderNumber: sampleOrderId,
    customerId: 'usr_cust_001',
    customerName: 'Ibrahim Sani',
    customerEmail: 'customer@gmail.com',
    customerPhone: '+234 802 345 6789',
    deliveryMethod: 'delivery',
    deliveryLocationId: 'loc_tunga',
    deliveryLocationName: 'Tunga',
    deliveryAddress: 'No 14 Ahmadu Bello Way, Near Central Mosque, Tunga, Minna',
    deliveryFee: 0,
    subtotal: 13000,
    totalAmount: 13000,
    paymentStatus: 'successful',
    paymentMethod: 'test_mode',
    paymentReference: 'TEST-PAY-849201',
    orderStatus: 'Processing',
    customerNotes: 'Please ensure birds are well dressed and packaged in insulated bags.',
    adminNotes: 'Assigned to delivery courier batch #3.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  };

  const sampleOrderItems = [
    {
      id: 'item_ORD-849201_1',
      orderId: sampleOrderId,
      productId: 'prod_live_broiler',
      productName: 'Heavyweight Farm Broiler (Live Chicken)',
      productUnit: 'per bird',
      unitPrice: 6500,
      quantity: 2,
      subtotal: 13000,
      productImage: '/assets/live-chicken-pasture.webp'
    }
  ];

  const sampleHistory = [
    {
      id: 'hist_sample_1',
      orderId: sampleOrderId,
      previousStatus: null,
      newStatus: 'Pending',
      changedBy: 'Ibrahim Sani',
      note: 'Order placed by customer.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'hist_sample_2',
      orderId: sampleOrderId,
      previousStatus: 'Pending',
      newStatus: 'Confirmed',
      changedBy: 'Payment Gateway',
      note: 'Payment verified successfully.',
      createdAt: new Date(Date.now() - 3600000 * 3.5).toISOString()
    },
    {
      id: 'hist_sample_3',
      orderId: sampleOrderId,
      previousStatus: 'Confirmed',
      newStatus: 'Processing',
      changedBy: 'Alhaji Madaki',
      note: 'Birds selected from pen A3 and being prepared for dispatch.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  const sampleNotifications = [
    {
      id: 'notif_welcome_cust',
      userId: 'usr_cust_001',
      title: 'Welcome to Ragusma Farms!',
      message: 'Thank you for registering. Fresh farm-raised poultry, fish, and produce are ready for your family.',
      type: 'system',
      isRead: true,
      link: '/dashboard',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'notif_sample_order',
      userId: 'usr_cust_001',
      title: 'Order Processing (ORD-849201)',
      message: 'Your order is currently being processed by our farm dispatch team.',
      type: 'status',
      isRead: false,
      link: '/dashboard/orders/ORD-849201',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  const dbData = {
    users,
    categories,
    products,
    orders: [sampleOrder],
    orderItems: sampleOrderItems,
    orderStatusHistory: sampleHistory,
    deliveryLocations,
    inventoryLogs: [
      {
        id: 'inv_init_1',
        productId: 'prod_live_broiler',
        changeAmount: 122,
        previousStock: 0,
        newStock: 122,
        reason: 'initial_stock',
        referenceId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 'inv_init_2',
        productId: 'prod_live_broiler',
        changeAmount: -2,
        previousStock: 122,
        newStock: 120,
        reason: 'order_deduction',
        referenceId: sampleOrderId,
        createdAt: new Date().toISOString()
      }
    ],
    notifications: sampleNotifications,
    testimonials,
    addresses: [
      {
        id: 'addr_001',
        userId: 'usr_cust_001',
        label: 'Home (Tunga)',
        recipientName: 'Ibrahim Sani',
        phone: '+234 802 345 6789',
        locationId: 'loc_tunga',
        address: 'No 14 Ahmadu Bello Way, Near Central Mosque, Tunga, Minna',
        isDefault: true,
        createdAt: new Date().toISOString()
      }
    ],
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

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), 'utf-8');
  console.log("Database successfully seeded with Ragusma Farms data!");
}

seed().catch(console.error);

