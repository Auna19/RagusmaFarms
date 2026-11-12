# 🌾 Ragusma Farms NG® – Full-Stack Agricultural E-Commerce Web Application

> **"At the very heart of agriculture is the drive to feed the world."**  
> *"Access to Food is a right, not a privilege."* — **Hajiya Ramatu Mallama Madaki** *(Founder, 2015) & **Madaki Brothers** (Management since 2022)*

A modern, responsive, and full-stack agricultural e-commerce web platform engineered in pure **JavaScript (ES6+ / React JSX)** for **Ragusma Farms**, an agricultural and livestock business selling healthy farm-raised live & frozen chicken, farm rabbits, fresh catfish, organic manure, and agricultural consultation services.

---

## 📋 Table of Contents
1. [Brand Identity & Core Details](#-brand-identity--core-details)
2. [Key Application Capabilities](#-key-application-capabilities)
3. [Architecture & Technology Stack](#-architecture--technology-stack)
4. [Supabase Integration & Database Migration](#-supabase-integration--database-migration)
5. [Administrative Management Portal](#-administrative-management-portal)
6. [Customer Shopping & Checkout Experience](#-customer-shopping--checkout-experience)
7. [Default Test Credentials](#-default-test-credentials)
8. [Setup & Running Locally](#-setup--running-locally)
9. [Automated Test Verification Suites](#-automated-test-verification-suites)
10. [Pushing to GitHub](#-pushing-to-github)

---

## 🏷️ Brand Identity & Core Details

- **Official Brand Name**: Ragusma Farms NG®
- **Category**: Agriculture, Poultry, Livestock, Fisheries & Farm Products
- **Official Tagline**: *"At the very heart of agriculture is the drive to feed the world."*
- **Slogan**: *"Fresh From Our Farm, Quality You Can Trust"* / *"Project: GREEN ECONOMY"*
- **Guiding Ethos**: *"Whoever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift for him."*
- **Official Contact Phone & WhatsApp**: `+234 813 583 4368`
- **Official Email**: `Ragusmaa@gmail.com`
- **Official Instagram**: [https://www.instagram.com/ragusmafarmsng/](https://www.instagram.com/ragusmafarmsng/)
- **Farm Location**: 📍 Tunga goro, Behind FGC minna, Niger state.
- **Brand Colors**:
  - **Primary**: Deep Forest Green (`#0A3B1D`, `#0F5128`)
  - **Secondary**: Fresh Leaf Green (`#16A34A`, `#22C55E`)
  - **Accent**: Warm Golden Yellow (`#F59E0B`, `#D97706`)
  - **Background**: Soft Warm Cream (`#FAFBF8`)

---

## 🌟 Key Application Capabilities

### 1. Public Landing Page & Web Experience
- **Responsive Header & Nav**: Full brand logo (edge-to-edge `object-cover`), announcement bar highlighting free delivery in Tunga, live basket counter, customer and admin links.
- **Hero Section**: Authentic pasture photography (`/assets/live-chicken-pasture.webp`), call-to-actions, and official brand guarantee badge.
- **Meet the CEO Section**: Dedicated leadership profile featuring the CEO in the field (`Meet the CEO.webp`), biographical context on two generations of agricultural experience, official quotes, direct Instagram link (`@ragusmafarmsng`), and one-click WhatsApp inquiry.
- **About Us & Heritage**: History of the farm from founding by Hajiya Ramatu Mallama Madaki in 2015 to modern co-management by the Madaki brothers.
- **Dynamic Catalogue**: Filter by category (Live Chicken, Frozen Chicken, Rabbits, Catfish, Organic Manure, Consultation, Other Products), live search, promotional price badges, and Add to Basket.
- **Slide-out Cart Drawer**: Instant side-cart review on any page with quantity adjustments, stock limit protection, and subtotal calculation.
- **Delivery Matrix Table**: Transparent display of delivery zones (Free in Tunga, ₦1,000 flat in regional hubs, Free Farm Pickup).
- **Customer Testimonials**: Authentic feedback from restaurants, caterers, and farm partners.
- **Interactive Contact Desk**: Direct inquiry message form with status feedback, WhatsApp deep-link, and operational hours.

### 2. Customer Application (`/dashboard`)
- **Dashboard Overview**: Real-time spending metrics, active orders, and completed order count.
- **Product Store (`/dashboard/products`)**: Browse and filter products with instant stock availability pills.
- **Shopping Cart (`/dashboard/cart`)**: Manage basket items with real-time stock cap safeguards.
- **Checkout (`/dashboard/checkout`)**:
  - Selection between **Doorstep Delivery** and **Farm Gate Pickup**.
  - Strict backend-validated delivery pricing:
    - **Tunga**: FREE (₦0)
    - **Bakungu, Bosu, Mokunkele, Shango**: ₦1,000 flat rate
    - **Farm Gate Pickup**: Always FREE (₦0) with collection instructions
  - Payment modes: Demo Test Mode, Direct Bank Transfer, or Paystack gateway readiness.
- **Live Order Tracking (`/dashboard/orders/[id]`)**:
  - Visual status stepper: `Pending` → `Confirmed` → `Processing` → `Ready for Pickup / Out for Delivery` → `Delivered`.
  - Self-service order cancellation (with automatic inventory restock) for pending orders.
  - Printable receipt generator for record-keeping.
- **In-App Notifications (`/dashboard/notifications`)**: Alerts dispatched automatically upon order creation, status change, or cancellation.
- **Profile & Security (`/dashboard/profile`)**: Manage recipient names, courier contact phones, and password reset links.

### 3. Administrative Portal (`/admin/dashboard`)
- **Secured Authentication**: Strict role validation via HTTP-only JWT cookies.
- **Admin Profile & Password Manager (`/admin/profile`)**:
  - Edit administrator name, email, and courier phone numbers.
  - Securely change password with verification of current password, 8+ character strength rules, and bcrypt hashing.
- **Optimized Admin Sidebar**: Scrollable navigation menu that prevents overflow and keeps a high-visibility, sticky **Sign Out Admin** button accessible on all viewports.
- **Product Management (`/admin/products`)**: Add, edit, and archive products with multi-image persistent uploads (`/api/upload`) and custom technical specifications.
- **Category Management (`/admin/categories`)**: Create, update, or reorder categories.
- **Order Management (`/admin/orders`)**: Filter orders, advance status stages, add internal fulfillment notes, and verify payment.
- **Inventory & Stock Manager (`/admin/inventory`)**: Monitor low-stock alerts, perform manual restocks or mortality write-offs, and inspect chronological audit logs.
- **Delivery Zones (`/admin/delivery`)**: Adjust delivery fees and add new coverage areas without modifying code.
- **Content CMS (`/admin/content`)**: Dynamically edit Hero copy, About Us story, Mission, Vision, and Contact details.
- **Testimonials Manager (`/admin/testimonials`)**: Curate verified customer feedback.
- **Business Settings (`/admin/settings`)**: Manage bank transfer details, Paystack keys, and low-stock notification thresholds.

---

## 🏗️ Architecture & Technology Stack

- **Language**: Pure JavaScript strictly (**ES6+ / React JSX**) — No TypeScript files.
- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS with custom agricultural theme palette
- **Icons**: Lucide React
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing stored in secure HTTP-only cookies
- **Dual Persistence Architecture**:
  1. **Supabase PostgreSQL** via `@supabase/supabase-js` (Production database with complete relational schema and RLS policies).
  2. **Local Atomic JSON Database** (`data/database.json`) as a standalone, zero-setup fallback ensuring the platform works immediately out of the box.
- **File Storage**: Multi-image uploads saved to `/public/uploads/` with validation for `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`.

---

## ⚡ Supabase Integration & Database Migration

Ragusma Farms comes with complete support for Supabase PostgreSQL.

### Step 1: Run SQL Schema in Supabase
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Create or open your project.
3. Open the **SQL Editor** in the left sidebar.
4. Copy the entire contents of [`supabase/schema.sql`](file:///c:/Users/USER/Videos/DSN%20Automation/RagusmaFarms/supabase/schema.sql) and execute the query.
5. This creates all 12 tables, indexes, constraints, and Row Level Security (RLS) policies.

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project keys:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=ragusma_farms_super_secret_jwt_key_2026_minna

# Supabase Keys (From Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
```

### Step 3: Seed Supabase with Initial Data
Run the automated migration and seed script:
```bash
npm run seed:supabase
```
This migrates all initial categories, products, delivery locations, testimonials, content, and initial user accounts straight into your Supabase database!

---

## 🔑 Default Test Credentials

### Administrator Account
- **Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@ragusmafarms.com`
- **Password**: `AdminPassword2026!`
- *(A one-click "Fill Admin Credentials" button is provided on the login page for rapid evaluation)*

### Customer Account
- **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `customer@gmail.com`
- **Password**: `CustomerPassword123!`
- *(A one-click "Fill Sample Customer Credentials" button is provided on the login page)*

---

## 🏃 Setup & Running Locally

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🧪 Automated Test Verification Suites

The repository includes comprehensive verification suites:

### 1. Core Platform Logic Test
```bash
node scripts/test-app.js
```
*Validates 27 test cases covering category structure, delivery pricing rules (Tunga ₦0, Bakungu/Bosu/Mokunkele/Shango ₦1,000), authentication tokens, stock deduction, order status transitions, and in-app notifications.*

### 2. End-to-End Workflow Test
```bash
npm run test:workflow
# or
node scripts/test-full-workflow.js
```
*Validates 24 test cases covering new customer registration, product queries, order checkouts for Tunga and Shango, admin order advancement, inventory restock logging, and dynamic product creation.*

---

## 🚀 Pushing to GitHub

To push this repository to GitHub:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: complete Ragusma Farms agricultural e-commerce platform with Supabase support"

# 4. Add your GitHub remote repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 5. Push to main branch
git branch -M main
git push -u origin main
```

---

## 📄 License
© 2026 Ragusma Farms NG®. All Rights Reserved. Co-managed by Madaki Brothers.
📍 Tunga goro, Behind FGC minna, Niger state.
