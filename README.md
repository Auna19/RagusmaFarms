# 🌾 Ragusma Farms NG® – Full-Stack Agricultural E-Commerce Web Application

> **"At the very heart of agriculture is the drive to feed the world."**  
> *"Access to Food is a right, not a privilege."* — **Hajiya Ramatu Mallama Madaki** *(Founder, 2015) & **Madaki Brothers** (Management since 2022)*

A modern, responsive, and full-stack agricultural e-commerce web platform engineered in pure **JavaScript (ES6+ / React JSX)** for **Ragusma Farms**, an agricultural and livestock enterprise based in Minna, Niger State, Nigeria. The platform supplies farm-raised live & frozen chicken, meat and breeding rabbits, fresh catfish, organic manure, and professional agricultural consultation.

Live Production URL: **[https://ragusma-farms.vercel.app](https://ragusma-farms.vercel.app)**

---

## 📋 Table of Contents
1. [Brand Identity & Core Details](#-brand-identity--core-details)
2. [Key Application Capabilities](#-key-application-capabilities)
3. [Modern Scroll & Visual Experience](#-modern-scroll--visual-experience)
4. [Email Dispatch & Direct Message Routing](#-email-dispatch--direct-message-routing)
5. [Architecture & Technology Stack](#-architecture--technology-stack)
6. [Supabase Cloud Database & Storage Integration](#-supabase-cloud-database--storage-integration)
7. [Administrative Management Portal](#-administrative-management-portal)
8. [Customer Shopping & Checkout Experience](#-customer-shopping--checkout-experience)
9. [Official Credentials](#-official-credentials)
10. [Setup & Running Locally](#-setup--running-locally)
11. [Automated Verification Suites](#-automated-verification-suites)
12. [Git & Deployment Instructions](#-git--deployment-instructions)

---

## 🏷️ Brand Identity & Core Details

- **Official Brand Name**: Ragusma Farms NG®
- **Category**: Agriculture, Poultry, Livestock, Fisheries & Farm Products
- **Founder**: Hajiya Ramatu Mallama Madaki (Founded 2015)
- **Executive Management**: Madaki Brothers (since 2022)
- **Official Tagline**: *"At the very heart of agriculture is the drive to feed the world."*
- **Slogan**: *"Fresh From Our Farm, Quality You Can Trust"* / *"Project: GREEN ECONOMY"*
- **Guiding Ethos**: *"Whoever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift for him."*
- **Official Contact Phone & WhatsApp**: `+234 813 583 4368`
- **Official Communications Email**: `ragusmaa@gmail.com`
- **Official Instagram**: [https://www.instagram.com/ragusmafarmsng/](https://www.instagram.com/ragusmafarmsng/)
- **Farm Headquarters**: 📍 Tunga Goro, Behind FGC Minna, Niger State, Nigeria.
- **Brand Colors**:
  - **Primary**: Deep Forest Green (`#0A3B1D`, `#0E2A1B`)
  - **Secondary**: Fresh Leaf Green (`#16A34A`, `#68D391`)
  - **Accent**: Warm Agricultural Gold (`#D4AF37`, `#F59E0B`)
  - **Background**: Soft Warm Cream (`#FAFBF8`, `#F7F5F0`)

---

## 🌟 Key Application Capabilities

### 1. Public Landing Page & Web Experience
- **Cinematic Visual Experience**: Interactive hero section featuring the official brand seal, headline typography, and dynamic badge guarantees ("100% Farm Fresh", "ZERO Chemical Feed").
- **About Us & Heritage**: Visual timeline honoring founder Hajiya Ramatu Mallama Madaki and the farm's evolution across Niger State.
- **Meet the CEO Section**: Profiles farm leadership with authentic on-site photography, operational vision, and direct social links.
- **Dynamic Catalogue**: Filter live chicken batches, frozen cuts, catfish, rabbit breeding pairs, manure truckloads, and training services.
- **Slide-out Cart Drawer**: Instant side-cart review on any page with real-time subtotal calculation and stock safeguards.
- **Live Delivery Zones**: Dynamic delivery rates populated directly from the administrative database (Free in Tunga, flat rates for surrounding Minna hubs, or Free Farm Pickup).
- **Customer Testimonials**: Verified customer feedback with star ratings and authentic reviewer locations.
- **Direct Message Farm Desk**: "Send Us a Direct Message" form with auto-routing to `ragusmaa@gmail.com` and admin notifications.

### 2. Customer Application (`/dashboard`)
- **Dashboard Overview**: Real-time spending metrics, active orders, and completed order count.
- **Product Store (`/dashboard/products`)**: Browse and filter products with instant stock availability pills.
- **Shopping Cart (`/dashboard/cart`)**: Manage basket items with real-time stock cap safeguards.
- **Checkout (`/dashboard/checkout`)**:
  - Selection between **Doorstep Delivery** and **Farm Gate Pickup**.
  - Live zone calculations reflecting admin settings.
  - Payment options: Paystack gateway readiness, Direct Bank Transfer, or Test Mode.
- **Live Order Tracking (`/dashboard/orders/[id]`)**:
  - Status stepper: `Pending` → `Confirmed` → `Processing` → `Ready for Pickup / Out for Delivery` → `Delivered`.
  - Self-service order cancellation with automatic inventory restock.
  - Printable receipt generator for accounting.
- **Profile & Security (`/dashboard/profile`)**: Manage delivery addresses, phone numbers, and account security.

### 3. Administrative Portal (`/admin/dashboard`)
- **Secured Authentication**: HTTP-only JWT cookies with role enforcement (`admin`).
- **Product Management (`/admin/products`)**: Add, edit, or archive products with persistent image uploads to Supabase Cloud Storage.
- **Category Management (`/admin/categories`)**: Create, reorder, or update catalogue categories.
- **Order Management (`/admin/orders`)**: Filter orders, advance status stages, add internal fulfillment notes, and verify bank transfers.
- **Inventory & Stock Manager (`/admin/inventory`)**: Monitor low-stock alerts, record restocks or mortality write-offs, and inspect chronological audit logs.
- **Delivery Management (`/admin/delivery`)**: Adjust delivery fees and add coverage areas with instant reflection on checkout and landing page.
- **Content CMS (`/admin/content`)**: Dynamically edit Hero copy, About Us story, Mission, Vision, and Contact details.
- **Business Settings (`/admin/settings`)**: Configure bank transfer details, delivery policies, and operational hours.

---

## 🎨 Modern Scroll & Visual Experience

- **Section-by-Section Transitions**: Replaces static long scrolling with smooth, scroll-triggered reveals, layered depth, and progressive visibility.
- **Cinematic Dynamic Imagery**: Motion effects without video overhead — subtle Ken Burns zooms, gentle background pans, and responsive image parallax.
- **High Core Web Vitals**: Lightweight CSS transforms and hardware-accelerated transitions that maintain fast Largest Contentful Paint (LCP) and zero Cumulative Layout Shift (CLS).
- **Reduced Motion Support**: Respects `prefers-reduced-motion` media queries for accessible browsing across all mobile and desktop devices.

---

## ✉️ Email Dispatch & Direct Message Routing

1. **Official Farm SMTP Engine**:
   - Outbound emails (Password Reset, Order Confirmations, Inquiry Forwarding) are delivered via Gmail SMTP authenticated as **`ragusmaa@gmail.com`**.
   - Enforces IPv4 DNS resolution (`family: 4`) in Nodemailer for instantaneous sub-2-second delivery.
2. **Executive Retina Email Templates**:
   - Features the official **240×240 circular brand seal medallion** with gold outer ring (`#d4af37`) and transparent corners, hosted on Supabase Global CDN.
   - Compatible across Gmail (Web, iOS, Android), Apple Mail, Microsoft Outlook, and Yahoo without broken image icons or attachment cards.
3. **Website Direct Inquiries**:
   - Messages sent from the website contact forms dispatch directly to **`ragusmaa@gmail.com`** via `POST /api/contact`.
   - Email includes customer contact details, inquiry type, formatted message body, and 1-click action buttons (**Call**, **WhatsApp**, **Reply Email**).
   - Automatically logs an in-app notification in the admin dashboard.

---

## 🔔 Platform-Wide Toast Notifications

Comprehensive feedback toasts are integrated across all user and administrative actions:
- **Authentication**: Successful account creation, sign-in welcome, password reset requests, password updates, and secure sign-out.
- **Shopping & Orders**: Adding items to cart, updating quantities, order placement, and order cancellations.
- **Administrative Activities**: Creating/editing products, uploading images, updating delivery zones, saving site content, and modifying business settings.
- **Contact Desk**: Dispatch confirmations upon sending inquiries to the farm desk.

---

## 🏗️ Architecture & Technology Stack

- **Language**: Pure JavaScript strictly (**ES6+ / React JSX**) — No TypeScript.
- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS with custom agricultural theme palette
- **Icons**: Lucide React
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs` password hashing stored in secure HTTP-only cookies
- **Dual Persistence Architecture**:
  1. **Supabase PostgreSQL** via `@supabase/supabase-js` (Production database with complete relational schema and RLS policies).
  2. **Local Atomic JSON Database** (`data/database.json`) as a standalone, zero-setup local fallback.
- **Cloud Storage**: Product photos and brand assets are persisted in Supabase Cloud Storage (`ragusma-uploads`).

---

## ⚡ Supabase Cloud Database & Storage Integration

### Step 1: Run SQL Schema in Supabase
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the **SQL Editor** in the left sidebar.
3. Copy the entire contents of [`supabase/schema.sql`](file:///c:/Users/USER/Videos/DSN%20Automation/RagusmaFarms/supabase/schema.sql) and execute the query.
4. This creates all 12 tables, indexes, constraints, and Row Level Security (RLS) policies.

### Step 2: Configure Environment Variables
Create or update `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://ragusma-farms.vercel.app
JWT_SECRET=ragusma_farms_super_secret_jwt_key_2026_minna

# Supabase Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key

# Official Farm Gmail SMTP Configuration
GMAIL_USER=ragusmaa@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=ragusmaa@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=Ragusma Farms <ragusmaa@gmail.com>
```

### Step 3: Seed Supabase with Initial Data
Run the automated seed script:
```bash
npm run seed:supabase
```

---

## 🔑 Official Credentials

### Administrator Portal
- **Login URL**: [https://ragusma-farms.vercel.app/admin/login](https://ragusma-farms.vercel.app/admin/login)
- **Email**: `admin@ragusmafarms.com`
- **Password**: `AdminPassword2026!`
- **Account**: Alhaji Madaki (Farm Executive)

> [!NOTE]
> For security, the one-click quick credential filler has been permanently removed from the admin login page for production launch. Input credentials are automatically cleared upon logout to prevent browser credential leakage.

### Sample Customer Account
- **Login URL**: [https://ragusma-farms.vercel.app/login](https://ragusma-farms.vercel.app/login)
- **Email**: `customer@gmail.com`
- **Password**: `CustomerPassword123!`

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

## 🧪 Automated Verification Suites

The repository includes comprehensive verification suites:

### 1. Core Platform Logic Test
```bash
node scripts/test-app.js
```
*Validates 27 test cases covering category structure, delivery pricing rules (Tunga ₦0, Bakungu/Bosu/Mokunkele/Shango ₦1,000), authentication tokens, stock deduction, order status transitions, and in-app notifications.*

### 2. End-to-End Workflow Test
```bash
npm run test:workflow
```
*Validates 24 test cases covering new customer registration, product queries, checkout flows, admin order advancement, inventory restock logging, and dynamic product creation.*

---

## 🚀 Git & Deployment Instructions

To push updates to GitHub and trigger automatic Vercel production deployment:

```bash
# 1. Stage modified files
git add .

# 2. Commit changes
git commit -m "docs: update comprehensive README with production architecture and credentials"

# 3. Push to main branch
git push origin main
```

---

## 📄 License & Ownership
© 2026 Ragusma Farms NG®. All Rights Reserved.  
Founded by Hajiya Ramatu Mallama Madaki & Co-managed by Madaki Brothers.  
📍 Tunga Goro, Behind FGC Minna, Niger State, Nigeria.
