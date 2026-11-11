import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local if present
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('================================================================');
  console.log('⚡ SUPABASE CREDENTIALS NEEDED TO SEED REMOTE DATABASE');
  console.log('================================================================\n');
  console.log('Please provide your Supabase project credentials in .env.local:');
  console.log('');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-publishable-key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key');
  console.log('');
  console.log('1. Run the SQL schema in your Supabase Dashboard SQL Editor:');
  console.log('   supabase/schema.sql');
  console.log('2. Add your keys to .env.local');
  console.log('3. Run: npm run seed:supabase\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSupabase() {
  console.log('================================================================');
  console.log('🌾 SEEDING RAGUSMA FARMS DATA TO SUPABASE POSTGRESQL');
  console.log('================================================================\n');

  const dbPath = path.join(process.cwd(), 'data', 'database.json');
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  // 1. Categories
  console.log('1. Seeding categories...');
  const categories = data.categories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image: c.image || '',
    is_active: c.isActive !== false,
    display_order: c.displayOrder || 0
  }));
  const { error: catErr } = await supabase.from('categories').upsert(categories);
  if (catErr) console.error('  ✗ Error seeding categories:', catErr.message);
  else console.log(`  ✓ Inserted/Updated ${categories.length} categories.`);

  // 2. Delivery Locations
  console.log('2. Seeding delivery locations...');
  const locations = data.deliveryLocations.map(l => ({
    id: l.id,
    name: l.name,
    state: l.state || 'Niger State',
    charge: l.charge,
    estimated_time: l.estimatedTime || 'Within 2 to 4 hours',
    is_active: l.isActive !== false
  }));
  const { error: locErr } = await supabase.from('delivery_locations').upsert(locations);
  if (locErr) console.error('  ✗ Error seeding delivery locations:', locErr.message);
  else console.log(`  ✓ Inserted/Updated ${locations.length} delivery locations.`);

  // 3. Products
  console.log('3. Seeding products...');
  const products = data.products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category_id: p.categoryId,
    description: p.description,
    price: p.price,
    promotional_price: p.promotionalPrice || null,
    unit: p.unit,
    stock: p.stock,
    is_available: p.isAvailable !== false,
    is_featured: Boolean(p.isFeatured),
    images: p.images || [],
    specifications: p.specifications || {}
  }));
  const { error: prodErr } = await supabase.from('products').upsert(products);
  if (prodErr) console.error('  ✗ Error seeding products:', prodErr.message);
  else console.log(`  ✓ Inserted/Updated ${products.length} products.`);

  // 4. Users (Admin and sample customer)
  console.log('4. Seeding users...');
  const users = data.users.map(u => ({
    id: u.id,
    full_name: u.fullName,
    email: u.email,
    phone: u.phone || '',
    password_hash: u.passwordHash,
    role: u.role || 'customer',
    is_active: u.isActive !== false
  }));
  const { error: userErr } = await supabase.from('users').upsert(users);
  if (userErr) console.error('  ✗ Error seeding users:', userErr.message);
  else console.log(`  ✓ Inserted/Updated ${users.length} initial accounts.`);

  // 5. Testimonials
  console.log('5. Seeding testimonials...');
  const testimonials = data.testimonials.map(t => ({
    id: t.id,
    customer_name: t.name,
    role_location: t.roleOrTitle || t.role || t.location || 'Verified Customer',
    rating: t.rating || 5,
    comment: t.comment || t.content || 'Top quality agricultural produce and reliable delivery!',
    product_bought: t.product || 'Farm Products',
    is_active: t.isActive !== false
  }));
  const { error: testErr } = await supabase.from('testimonials').upsert(testimonials);
  if (testErr) console.error('  ✗ Error seeding testimonials:', testErr.message);
  else console.log(`  ✓ Inserted/Updated ${testimonials.length} customer testimonials.`);

  // 6. Website Content & Business Settings
  console.log('6. Seeding website content & settings...');
  if (data.content) {
    await supabase.from('website_content').upsert({ id: 'current', data: data.content });
  }
  if (data.settings) {
    await supabase.from('business_settings').upsert({ id: 'current', data: data.settings });
  }
  console.log('  ✓ Website content & farm settings synchronized.');

  console.log('\n================================================================');
  console.log('🎉 SUPABASE DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('================================================================\n');
}

seedSupabase().catch(err => {
  console.error('Fatal seeding error:', err);
});

