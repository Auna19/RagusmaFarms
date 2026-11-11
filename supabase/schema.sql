-- =============================================================================
-- RAGUSMA FARMS NG® – COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- =============================================================================
-- Agricultural & Livestock E-Commerce Platform
-- Farm Location: Tunga Goro, behind FGC Minna, Niger State
-- Official Tagline: "At the very heart of agriculture is the drive to feed the world."
-- =============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop any conflicting pre-existing placeholder tables to ensure correct column types
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.order_status_history CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.inventory_logs CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.delivery_locations CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.website_settings CASCADE;
DROP TABLE IF EXISTS public.activity_logs CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- -----------------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  reset_token TEXT,
  reset_token_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- -----------------------------------------------------------------------------
-- 2. PRODUCT CATEGORIES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  promotional_price NUMERIC(12, 2) CHECK (promotional_price IS NULL OR promotional_price >= 0),
  unit TEXT NOT NULL DEFAULT 'per bird',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

-- -----------------------------------------------------------------------------
-- 4. DELIVERY LOCATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_locations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Niger State',
  charge NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (charge >= 0),
  estimated_time TEXT DEFAULT 'Within 2 to 4 hours',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_delivery_locations_active ON public.delivery_locations(is_active);

-- -----------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id TEXT REFERENCES public.users(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('delivery', 'pickup')),
  delivery_location_id TEXT REFERENCES public.delivery_locations(id) ON DELETE SET NULL,
  delivery_location_name TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed', 'refunded')),
  payment_method TEXT NOT NULL DEFAULT 'test_mode' CHECK (payment_method IN ('paystack', 'bank_transfer', 'test_mode', 'cash_on_delivery')),
  payment_reference TEXT,
  order_status TEXT NOT NULL DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled')),
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- -----------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE (Snapshot of ordered products)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_unit TEXT NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(12, 2) NOT NULL,
  product_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- -----------------------------------------------------------------------------
-- 7. ORDER STATUS HISTORY (Timeline audit trail)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL DEFAULT 'System',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);

-- -----------------------------------------------------------------------------
-- 8. INVENTORY LOGS (Stock adjustment tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_logs (
  id TEXT PRIMARY KEY,
  product_id TEXT REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_inventory_logs_product ON public.inventory_logs(product_id);

-- -----------------------------------------------------------------------------
-- 9. CUSTOMER NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'order',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- -----------------------------------------------------------------------------
-- 10. CUSTOMER ADDRESSES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.addresses (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Home',
  recipient_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location_id TEXT REFERENCES public.delivery_locations(id) ON DELETE SET NULL,
  street_address TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);

-- -----------------------------------------------------------------------------
-- 11. TESTIMONIALS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  role_location TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  product_bought TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 12. WEBSITE CONTENT & SETTINGS (Single-row configuration tables)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_content (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.business_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- 1. Public Storefront Read Policies (Allow anyone to read products, categories, locations, testimonials)
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view active delivery locations" ON public.delivery_locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active testimonials" ON public.testimonials
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view website content" ON public.website_content
  FOR SELECT USING (true);

-- 2. Authenticated Customers can view their own orders & notifications
CREATE POLICY "Customers can view own orders" ON public.orders
  FOR SELECT TO authenticated
  USING ((select auth.uid()::text) = customer_id);

CREATE POLICY "Customers can view own order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_id = (select auth.uid()::text)
  ));

CREATE POLICY "Customers can view own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING ((select auth.uid()::text) = user_id OR user_id = 'all');

CREATE POLICY "Customers can manage own addresses" ON public.addresses
  FOR ALL TO authenticated
  USING ((select auth.uid()::text) = user_id)
  WITH CHECK ((select auth.uid()::text) = user_id);

-- 3. Service Role (Backend API) has full administrative access to all tables
-- Note: In Supabase, the `service_role` automatically bypasses RLS by default.

