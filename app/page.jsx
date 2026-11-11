import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import { db } from '@/lib/db';
import { formatNaira } from '@/lib/utils';
import { 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Award, 
  HeartHandshake, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  Layers,
  ChevronRight,
  Send
} from 'lucide-react';

export const revalidate = 0; // ensure fresh data from db

export default async function HomePage() {
  const content = await db.content.get();
  const settings = await db.settings.get();
  const categories = await db.categories.getAll(true);
  const featuredProducts = await db.products.getAll({ onlyActive: true });
  const deliveryLocations = await db.deliveryLocations.getAll(true);
  const testimonials = await db.testimonials.getAll(true);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative overflow-hidden bg-forest-900 text-white">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 rounded-full bg-forest-600/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 rounded-full bg-gold-600/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-700/80 text-forest-200 text-xs sm:text-sm font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                <span className="text-gold-300 font-bold">{content.hero.taglineBadge || "Project: GREEN ECONOMY"}</span>
                <span className="text-forest-400">•</span>
                <span>{content.hero.badge}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                {content.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-forest-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {content.hero.subheadline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition flex items-center justify-center gap-2 group"
                >
                  {content.hero.ctaPrimary}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/about"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-800/80 hover:bg-forest-800 text-white font-semibold text-base border border-forest-700 transition flex items-center justify-center gap-2"
                >
                  {content.hero.ctaSecondary}
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-forest-800/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-gold-400">100%</span>
                  <span className="text-xs text-forest-200">Organically Reared</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-gold-400">FREE</span>
                  <span className="text-xs text-forest-200">Delivery in Tunga</span>
                </div>
                <div>
                  <span className="block text-xl sm:text-2xl font-bold text-gold-400">2015</span>
                  <span className="text-xs text-forest-200">Est. Heritage</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Photo: Official live chicken in green pasture */}
                <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-700/50">
                  <Image
                    src={content.hero.heroImage || "/assets/live-chicken-pasture.webp"}
                    alt="Ragusma Farms Live Poultry & Pasture"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Floating Brand Badge */}
                  <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-forest-950 shadow-xl border border-white/50">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-forest-200 bg-forest-900 shrink-0">
                        <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">Official Brand Guarantee</span>
                        <h4 className="font-serif font-bold text-gray-900 text-sm">
                          Direct From Farm-Gate to Doorstep
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Badge */}
                <div className="absolute -top-4 -left-4 sm:-left-6 bg-gold-500 text-forest-950 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white">
                  <Sparkles className="w-6 h-6 text-forest-900" />
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider">Zero Chemical Feed</span>
                    <span className="text-sm font-extrabold">100% Farm Fresh</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          ABOUT SECTION: GET TO KNOW US
          ========================================================================= */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Collage using Authentic Assets */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-md border border-forest-100">
                  <Image 
                    src="/assets/about-heritage.webp" 
                    alt="Ragusma Farms Heritage" 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-md border border-forest-100 mt-6">
                  <Image 
                    src="/assets/meet-ceo.webp" 
                    alt="Ragusma Farms Co-Management & Crop Farm" 
                    fill 
                    className="object-cover" 
                  />
                </div>
              </div>

              {/* Quote Card */}
              <div className="mt-4 p-5 rounded-2xl bg-forest-900 text-white shadow-lg relative overflow-hidden">
                <p className="text-base sm:text-lg font-serif italic text-gold-300">
                  &quot;{content.about.quote}&quot;
                </p>
                <p className="text-xs text-forest-300 mt-2 font-medium">
                  {content.about.founderCaption}
                </p>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-forest-600" /> Get to Know Us
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 leading-tight">
                {content.about.title}
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                {content.about.paragraph1}
              </p>

              <p className="text-base text-gray-600 leading-relaxed">
                {content.about.paragraph2}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-100">
                  <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Two (2) Generations Experience</h4>
                    <p className="text-xs text-gray-500">Decades of combined knowledge in poultry, aquaculture & rabbitry.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-forest-50/70 border border-forest-100">
                  <CheckCircle2 className="w-5 h-5 text-forest-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Sustainable Green Economy</h4>
                    <p className="text-xs text-gray-500">Recycling livestock dung into organic manure for zero environmental waste.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-forest-700 font-semibold hover:text-forest-900 transition text-sm group"
                >
                  Read our full heritage story <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          MISSION & VISION SECTION
          ========================================================================= */}
      <section className="py-16 bg-forest-50/60 border-y border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Box */}
            <div className="p-8 rounded-3xl bg-white border border-forest-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center shadow">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">Our Mission</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {content.mission.statement}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-forest-100 flex items-center gap-2 text-xs font-semibold text-forest-700">
                <CheckCircle2 className="w-4 h-4 text-forest-600" /> Promoted by Madaki Brothers
              </div>
            </div>

            {/* Vision Box */}
            <div className="p-8 rounded-3xl bg-forest-900 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center shadow border border-forest-700">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">Our Vision</h3>
                <p className="text-base text-forest-100/90 leading-relaxed">
                  {content.vision.statement}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-forest-800 flex items-center gap-2 text-xs font-semibold text-gold-400">
                <Sparkles className="w-4 h-4" /> Sustainable Agriculture for Future Generations
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          MEET THE CEO SECTION
          ========================================================================= */}
      <section id="ceo" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-forest-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* CEO Photograph with Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative h-[480px] sm:h-[540px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-100 bg-forest-50">
                  <Image
                    src="/assets/meet-ceo.webp"
                    alt="Meet the CEO of Ragusma Farms"
                    fill
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent" />
                  
                  {/* Floating Caption on Photo */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold-600 block">
                      Agricultural Service
                    </span>
                    <h4 className="font-serif font-bold text-gray-900 text-base sm:text-lg">
                      Madaki • Chief Executive Officer
                    </h4>
                    <p className="text-xs text-forest-700 font-medium mt-0.5">
                      Ragusma Farms NG® • Co-Management Since 2022
                    </p>
                  </div>
                </div>

                {/* Floating Quote Tag */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-forest-800 text-white p-3.5 rounded-2xl shadow-xl border-2 border-white max-w-[210px]">
                  <Sparkles className="w-5 h-5 text-gold-400 mb-1" />
                  <p className="text-[11px] font-medium leading-snug text-forest-100 italic">
                    &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* CEO Story & Profile */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5 text-forest-700" /> Executive Leadership
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                Meet the CEO
              </h2>

              <p className="text-base sm:text-lg text-forest-800 font-serif italic border-l-4 border-gold-500 pl-4 py-1">
                &quot;At the very heart of agriculture is the drive to feed the world.&quot;
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                At Ragusma Farms, agriculture is not just an industry—it is a sacred responsibility and a noble service to humanity. Leading with humility, vision, and a deep reverence for the soil, our Chief Executive Officer embodies the hands-on spirit of true agricultural stewardship.
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Co-managing the family enterprise founded by <strong>Hajiya Ramatu Mallam Madaki in 2015</strong>, he and the Madaki brothers have championed modern, sustainable agribusiness practices. Whether inspecting pastures at sunrise, checking clean water aeration in our catfish ponds, or advising upcoming farmers, his dedication guarantees that every product leaving Ragusma Farms meets the highest standards of purity, nutrition, and health.
              </p>

              {/* CEO Guiding Principle Card */}
              <div className="p-5 rounded-2xl bg-forest-50/80 border border-forest-200/80 space-y-2">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                  The Founder&apos;s Guiding Ethos:
                </span>
                <p className="text-xs sm:text-sm text-forest-800 italic leading-relaxed">
                  &quot;Whoever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift for him.&quot;
                </p>
              </div>

              {/* Farm Coordinates & Social Action */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                  <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>📍 Tunga goro, Behind FGC minna, Niger state.</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href="https://www.instagram.com/ragusmafarmsng/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow hover:opacity-95 transition"
                  >
                    <span>Connect on Instagram</span>
                    <span className="text-pink-200 font-normal">@ragusmafarmsng</span>
                  </a>

                  <a
                    href="https://wa.me/2348135834368?text=Hello%20CEO%20Ragusma%20Farms,%20I%20would%20like%20to%20inquire%20about%20your%20farm%20products"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat With Farm Desk</span>
                  </a>

                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-forest-300 text-forest-900 hover:bg-forest-50 font-bold text-xs sm:text-sm transition"
                  >
                    <span>Shop Fresh Produce</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          OUR PRODUCTS (DYNAMIC DATABASE CATALOGUE)
          ========================================================================= */}
      <section id="products" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-forest-600" /> Farm-Fresh Store
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Featured Farm Products
              </h2>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Browse our farm-raised livestock, processed poultry, fresh catfish, and organic manure. Dynamic live pricing in Nigerian Naira.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm shadow transition"
            >
              View Full Catalogue <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-forest-800 text-white whitespace-nowrap shadow-sm"
            >
              All Products ({featuredProducts.length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-forest-50 text-gray-700 hover:text-forest-800 border border-forest-100 whitespace-nowrap transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-forest-100 p-8">
              <p className="text-gray-500">Products are currently being updated by farm management.</p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          OUR SERVICES
          ========================================================================= */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-forest-600" /> What We Do
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Our Professional Farm Services
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              From commercial poultry supply to agricultural consultation, Ragusma Farms delivers high standards across Niger State.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  01
                </div>
                <h3 className="text-xl font-bold text-gray-900">Live Chicken Sales</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Bulk and individual supply of healthy live broilers, noilers, cockerels, and point-of-lay pullets directly from our spacious pens.
                </p>
              </div>
              <Link href="/products?category=cat_live_chicken" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Order Live Birds <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  02
                </div>
                <h3 className="text-xl font-bold text-gray-900">Frozen Chicken Sales</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hygienically slaughtered, properly dressed, and flash frozen. Ready for instant cooking, restaurant catering, and celebrations.
                </p>
              </div>
              <Link href="/products?category=cat_frozen_chicken" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                View Dressed Chicken <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 3 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  03
                </div>
                <h3 className="text-xl font-bold text-gray-900">Farm Rabbit Sales</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Healthy adult breeding pairs and meat rabbits nurtured on organic vegetation and nutrient-rich feed.
                </p>
              </div>
              <Link href="/products?category=cat_rabbits" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Explore Rabbitry <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  04
                </div>
                <h3 className="text-xl font-bold text-gray-900">Fresh Fish & Catfish</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Freshly harvested table-size catfish from aerated freshwater ponds. Available live or prepped upon request for fish pepper soup.
                </p>
              </div>
              <Link href="/products?category=cat_fish" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Order Catfish <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 5 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  05
                </div>
                <h3 className="text-xl font-bold text-gray-900">Organic Manure & Dung</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cured, dry poultry and livestock manure packed in 50kg bags. High NPK natural fertilizer for vegetable, yam, and maize farms.
                </p>
              </div>
              <Link href="/products?category=cat_manure" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Order Manure Bags <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 6 */}
            <div className="p-7 rounded-3xl bg-forest-50/50 border border-forest-100 hover:shadow-lg transition flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg">
                  06
                </div>
                <h3 className="text-xl font-bold text-gray-900">Agricultural Consultation</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Professional livestock setup advisory, pen design, feed formulation, and farm business mentoring with the Madaki Brothers.
                </p>
              </div>
              <Link href="/products?category=cat_consultation" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1">
                Book Consultation <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY CHOOSE RAGUSMA FARMS
          ========================================================================= */}
      <section className="py-20 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold-400 font-bold uppercase tracking-widest text-xs">Our Commitment</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
              Why Choose Ragusma Farms?
            </h2>
            <p className="text-forest-200 text-sm mt-2">
              We stand apart through our deep agricultural roots, transparent pricing, and unwavering focus on food safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.whyChooseUs.map((item, idx) => (
              <div key={item.id || idx} className="p-6 rounded-2xl bg-forest-800/60 border border-forest-700/60 hover:bg-forest-800 transition">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold mb-4 border border-gold-400/30">
                  <CheckCircle2 className="w-5 h-5 text-gold-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          HOW IT WORKS (4 STEPS)
          ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-forest-700 font-bold uppercase tracking-widest text-xs">Simple & Seamless</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">
              How Ordering Works
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Get fresh farm products to your kitchen or farm in four straightforward steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-forest-100 shadow-sm text-center relative">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Browse Products</h3>
              <p className="text-xs text-gray-500">Explore live chicken, catfish, rabbits, frozen cuts, and manure with clear Naira prices.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-forest-100 shadow-sm text-center relative">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Add to Cart</h3>
              <p className="text-xs text-gray-500">Select desired quantities validated against real-time stock levels.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-forest-100 shadow-sm text-center relative">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-800 font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Delivery or Pickup</h3>
              <p className="text-xs text-gray-500">Enjoy FREE delivery in Tunga, flat ₦1,000 for regional towns, or free farm collection.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-forest-100 shadow-sm text-center relative">
              <div className="w-12 h-12 rounded-full bg-gold-400 text-forest-950 font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                4
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Confirm & Track</h3>
              <p className="text-xs text-gray-500">Receive in-app updates as your order moves from Pending to Delivered!</p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          DELIVERY INFORMATION SECTION (RULE REQUIREMENTS)
          ========================================================================= */}
      <section id="delivery" className="py-20 bg-white border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider">
                <Truck className="w-3.5 h-3.5 text-gold-700" /> Transparent Logistics
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Delivery & Farm Pickup Information
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                We believe getting healthy food should be affordable and stress-free. We provide direct doorstep dispatch across Minna municipalities and welcome customers to collect orders straight from our farm gate.
              </p>

              <div className="p-5 rounded-2xl bg-forest-50 border border-forest-200">
                <h4 className="font-bold text-forest-900 text-base mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-forest-700" /> Farm Gate Pickup (Always ₦0 FREE)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong>Location:</strong> 📍 Tunga goro, Behind FGC minna, Niger state.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {settings.pickupInstructions}
                </p>
              </div>

              <p className="text-xs text-gray-500 italic">
                * Note: For deliveries to communities not listed in the table, please contact our farm office at <a href="tel:+2348135834368" className="text-forest-700 font-semibold underline">+234 813 583 4368</a> for custom logistics confirmation.
              </p>
            </div>

            {/* Delivery Pricing Matrix Table */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-forest-200 shadow-xl overflow-hidden">
                <div className="bg-forest-900 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-xl">Official Delivery Pricing</h3>
                      <p className="text-xs text-forest-200 mt-0.5">Dynamically configured & backend-verified</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-gold-400 text-forest-950 font-bold text-xs">
                      Live Rates
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-forest-100">
                  {deliveryLocations.map((loc) => (
                    <div key={loc.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-forest-50/50 transition">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-base">{loc.name}</span>
                          {loc.charge === 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                              Free Delivery
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{loc.description || loc.estimatedDeliveryTime}</p>
                      </div>

                      <div className="text-right">
                        <span className={`text-base sm:text-lg font-extrabold ${loc.charge === 0 ? 'text-emerald-700' : 'text-forest-900'}`}>
                          {loc.charge === 0 ? 'FREE (₦0)' : formatNaira(loc.charge)}
                        </span>
                        <span className="block text-[10px] text-gray-400">Doorstep drop</span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 sm:p-5 flex items-center justify-between bg-gold-50/40">
                    <div>
                      <span className="font-bold text-gray-900 text-base">Farm Pickup</span>
                      <p className="text-xs text-gray-500">Collect directly at Ragusma Farms Main Gate</p>
                    </div>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-extrabold text-emerald-700">FREE (₦0)</span>
                      <span className="block text-[10px] text-gray-400">Zero surcharge</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-forest-100 text-center">
                  <Link
                    href="/products"
                    className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center justify-center gap-1.5"
                  >
                    Start Shopping & Select Your Delivery Zone <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS SECTION
          ========================================================================= */}
      <section className="py-20 bg-forest-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-forest-700 font-bold uppercase tracking-widest text-xs">Customer Stories</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Hear from local restaurateurs, crop farmers, and households who trust Ragusma Farms for their weekly supply.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="p-7 rounded-3xl bg-white border border-forest-100 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-gold-500">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    &quot;{test.content}&quot;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-forest-50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center text-sm shrink-0">
                    {test.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{test.name}</h4>
                    <p className="text-xs text-gray-500">{test.roleOrTitle} • {test.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT SECTION
          ========================================================================= */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
                <Phone className="w-3.5 h-3.5 text-forest-600" /> Get In Touch
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Contact Ragusma Farms
              </h2>

              <p className="text-base text-gray-600 leading-relaxed">
                Have questions regarding livestock orders, bulk frozen chicken supply, organic manure delivery, or agricultural consultation? Reach out directly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Phone & WhatsApp</h4>
                    <a href={`tel:${content.contact.phone}`} className="text-base font-bold text-forest-900 hover:underline">
                      {content.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Official Email</h4>
                    <a href={`mailto:${content.contact.email}`} className="text-base font-bold text-forest-900 hover:underline">
                      {content.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100">
                  <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-gray-500">Farm Location & Service Desk</h4>
                    <p className="text-sm font-bold text-gray-900">
                      📍 Tunga goro, Behind FGC minna, Niger state.
                    </p>
                    <p className="text-xs text-forest-700 italic mt-0.5">
                      &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7">
              <ContactForm 
                title="Send Us a Direct Message" 
                subtitle="Fill in your inquiry and our farm desk team will reply promptly."
              />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

