import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ContactForm from '@/components/ContactForm';
import CinematicHero from '@/components/CinematicHero';
import ScrollReveal from '@/components/ScrollReveal';
import ScrollSectionIndicator from '@/components/ScrollSectionIndicator';
import CinematicCard from '@/components/CinematicCard';
import SectionDivider from '@/components/SectionDivider';
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
  Send,
  Clock,
  Check
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
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950 relative selection:bg-gold-400 selection:text-forest-950">
      <Navbar />

      {/* Floating Vertical Section Navigation HUD (Desktop) */}
      <ScrollSectionIndicator />

      {/* =========================================================================
          1. HERO SECTION (DYNAMIC CINEMATIC SHOWCASE)
          ========================================================================= */}
      <div id="hero">
        <CinematicHero content={content} />
      </div>

      <SectionDivider from="forest" to="white" />

      {/* =========================================================================
          2. ABOUT SECTION: OUR HERITAGE & CIRCULAR ECONOMY
          ========================================================================= */}
      <section id="about" className="py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-forest-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-gold-100/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Composition: Multi-layered Cinematic Photo Showcase */}
            <div className="lg:col-span-5 relative order-2 lg:order-1">
              <ScrollReveal animation="fade-right" duration={850}>
                <div className="space-y-4">
                  
                  {/* Staggered Dual-Photo Cinematic Display */}
                  <div className="grid grid-cols-2 gap-4 items-start">
                    
                    {/* Heritage Photo Card with Ken Burns Pan */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-forest-100 bg-forest-900 aspect-[4/5] light-sweep-container group">
                      <div className="relative w-full h-full animate-ken-burns">
                        <Image
                          src="/assets/about-heritage.webp"
                          alt="Ragusma Farms Heritage"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 260px"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-950/85 backdrop-blur-md border border-forest-700 text-[9px] sm:text-[10px] font-bold tracking-widest text-gold-300 uppercase shadow-lg">
                          <Sparkles className="w-3 h-3 text-gold-400 shrink-0" />
                          Heritage Since 2015
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 z-20">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-forest-200 block">
                          Heritage Roots
                        </span>
                        <p className="text-xs font-bold text-white leading-tight">
                          Natural Agro-Pastures
                        </p>
                      </div>
                    </div>

                    {/* Sustainable Farming Card with Ken Burns Alt Pan */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-forest-100 bg-forest-900 aspect-[4/5] mt-6 light-sweep-container group">
                      <div className="relative w-full h-full animate-ken-burns-alt">
                        <Image
                          src="/assets/sustainable-farming.webp"
                          alt="Sustainable Farming at Ragusma"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 50vw, 260px"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 right-3 z-20">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-950/85 backdrop-blur-md border border-forest-700 text-[9px] sm:text-[10px] font-bold tracking-widest text-emerald-300 uppercase shadow-lg">
                          <Leaf className="w-3 h-3 text-emerald-400 shrink-0" />
                          Green Economy
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 z-20">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gold-400 block">
                          Ecosystem
                        </span>
                        <p className="text-xs font-bold text-white leading-tight">
                          Organic Soil Enrichment
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Prominent Founder Tribute Card (Fully Visible, High-Contrast & Beautiful) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white shadow-xl border border-forest-200/90 flex items-center gap-3.5 sm:gap-4 relative overflow-hidden">
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-forest-200 bg-forest-900 shrink-0 shadow-md">
                      <Image src="/assets/logo.jpg" alt="Ragusma Farms Logo" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-600 bg-gold-50 px-2 py-0.5 rounded-md border border-gold-200">
                          Founder Legacy • Est. 2015
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base leading-snug">
                        Founded by Hajiya Ramatu Mallama Madaki
                      </h4>
                      <p className="text-xs text-forest-700 font-medium mt-0.5">
                        Championed across generations in Minna, Niger State
                      </p>
                    </div>
                  </div>

                  {/* Founder Quote Card with Glow */}
                  <div className="p-5 rounded-2xl bg-forest-900 text-white shadow-xl relative overflow-hidden border border-forest-800">
                    <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-gold-500/10 blur-xl pointer-events-none" />
                    <p className="text-sm sm:text-base font-serif italic text-gold-300 leading-relaxed">
                      &quot;{content.about?.quote || 'Our land is our heritage, and every animal reared under our care reflects a promise of wholesomeness and trust.'}&quot;
                    </p>
                    <p className="text-xs text-forest-300 mt-2 font-medium">
                      {content.about?.founderCaption || '— The Madaki Family Heritage'}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <ScrollReveal animation="fade-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-forest-700" /> Get to Know Us
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={100}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                  {content.about?.title || 'Two Generations of Agricultural Excellence & Wholesome Nutrition'}
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={150}>
                <p className="text-base text-gray-600 leading-relaxed">
                  {content.about?.paragraph1 || 'Founded in 2015 by Hajiya Ramatu Mallama Madaki, Ragusma Farms has evolved from humble beginnings into a benchmark of sustainable, organic agriculture in Niger State. What started as a focused family poultry operation has expanded into a comprehensive agribusiness combining free-range poultry, advanced aquaculture, healthy rabbitry, and commercial organic manure production.'}
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={200}>
                <p className="text-base text-gray-600 leading-relaxed">
                  {content.about?.paragraph2 || 'Today, co-managed by the Madaki brothers, our operations continue to pioneer the Project Green Economy initiative. By returning nutrient-rich livestock dung into organic manure for local crop farmers, we close the ecological loop and ensure zero environmental waste while providing Niger State households with clean, fresh food.'}
                </p>
              </ScrollReveal>

              {/* Feature Highlights Grid */}
              <ScrollReveal animation="fade-up" delay={250}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-forest-50/70 border border-forest-100 hover:border-forest-300 transition-colors shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0 shadow">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Two Generations of Heritage</h4>
                      <p className="text-xs text-gray-600 mt-0.5">Decades of combined knowledge in poultry, aquaculture & rabbitry.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-forest-50/70 border border-forest-100 hover:border-forest-300 transition-colors shadow-sm">
                    <div className="w-8 h-8 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0 shadow">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">Sustainable Green Economy</h4>
                      <p className="text-xs text-gray-600 mt-0.5">Recycling livestock resources into organic manure for zero environmental waste.</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={300}>
                <div className="pt-2">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all group"
                  >
                    <span>Read Our Complete Heritage Story</span>
                    <ChevronRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          3. MISSION & VISION SECTION: OUR CORE PILLARS
          ========================================================================= */}
      <section id="mission" className="py-20 lg:py-24 bg-forest-50/70 border-y border-forest-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-forest-700 font-bold uppercase tracking-widest text-xs">Our Core Purpose</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">
                Guiding Principles & Vision
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Built on ethical agriculture, community empowerment, and environmental responsibility.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            
            {/* Mission Box */}
            <ScrollReveal animation="fade-right" delay={100}>
              <div className="h-full p-8 sm:p-10 rounded-3xl bg-white border border-forest-200/90 shadow-md relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-forest-100/50 rounded-full blur-2xl group-hover:bg-forest-200/60 transition-colors pointer-events-none" />
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                    Our Mission
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed font-normal">
                    {content.mission?.statement || 'To deliver superior quality, organically reared farm produce and livestock while promoting sustainable, green agribusiness practices that enrich our community and protect the environment.'}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-forest-100 flex items-center gap-2.5 text-xs font-bold text-forest-800 relative z-10">
                  <CheckCircle2 className="w-4 h-4 text-forest-600" /> 
                  <span>Promoted by Madaki Brothers • Ethical Stewardship</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Vision Box */}
            <ScrollReveal animation="fade-left" delay={150}>
              <div className="h-full p-8 sm:p-10 rounded-3xl bg-forest-900 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-forest-800 hover:shadow-forest-900/40 hover:shadow-2xl transition-all duration-300 group">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
                
                <div className="space-y-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center shadow-lg border border-forest-700 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                    Our Vision
                  </h3>
                  <p className="text-base text-forest-100/90 leading-relaxed font-normal">
                    {content.vision?.statement || 'To become Niger State’s most trusted household name in farm-fresh agricultural supply, setting the national standard for food purity, prompt logistics, and circular agro-ecological farming.'}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-forest-800 flex items-center gap-2.5 text-xs font-bold text-gold-400 relative z-10">
                  <Sparkles className="w-4 h-4 text-gold-400" /> 
                  <span>Sustainable Agriculture for Future Generations</span>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* =========================================================================
          4. MEET THE CEO SECTION (EXECUTIVE LEADERSHIP & VISION)
          ========================================================================= */}
      <section id="ceo" className="py-24 bg-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-forest-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* CEO Photograph with Cinematic Ken Burns & Floating Badges */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal animation="fade-right" duration={800}>
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  
                  {/* Photo Window */}
                  <div className="relative h-[480px] sm:h-[540px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-100 bg-forest-900 light-sweep-container group">
                    <div className="relative w-full h-full animate-ken-burns">
                      <Image
                        src="/assets/meet-ceo.webp"
                        alt="Meet the CEO of Ragusma Farms"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 500px"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-transparent to-transparent pointer-events-none" />
                    
                    {/* Floating Caption on Photo */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/60 z-20">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-gold-600 block">
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

                  {/* Floating Quote Tag (Top Right) */}
                  <div className="absolute -top-4 -right-2 sm:-right-4 bg-forest-800 text-white p-4 rounded-2xl shadow-2xl border-2 border-white max-w-[220px] z-30 animate-float-slow">
                    <Sparkles className="w-5 h-5 text-gold-400 mb-1" />
                    <p className="text-[11px] font-medium leading-snug text-forest-100 italic">
                      &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            </div>

            {/* CEO Profile Story */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal animation="fade-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Leaf className="w-3.5 h-3.5 text-forest-700" /> Executive Leadership
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={100}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                  Meet the CEO
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={150}>
                <p className="text-base sm:text-lg text-forest-800 font-serif italic border-l-4 border-gold-500 pl-4 py-1.5 bg-forest-50/50 rounded-r-xl">
                  &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={200}>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  At Ragusma Farms, agriculture is not just an industry—it is a sacred responsibility and a noble service to humanity. Leading with humility, vision, and a deep reverence for the soil, our Chief Executive Officer embodies the hands-on spirit of true agricultural stewardship.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={250}>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Co-managing the family enterprise founded by <strong>Hajiya Ramatu Mallama Madaki in 2015</strong>, he and the Madaki brothers have championed modern, sustainable agribusiness practices. Whether inspecting pastures at sunrise, checking clean water aeration in our catfish ponds, or advising upcoming farmers, his dedication guarantees that every product leaving Ragusma Farms meets the highest standards of purity, nutrition, and health.
                </p>
              </ScrollReveal>

              {/* Guiding Ethos Card */}
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="p-5 rounded-2xl bg-forest-50/80 border border-forest-200/80 space-y-2">
                  <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                    The Founder&apos;s Guiding Ethos:
                  </span>
                  <p className="text-xs sm:text-sm text-forest-800 italic leading-relaxed">
                    &quot;Whoever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift for him.&quot;
                  </p>
                </div>
              </ScrollReveal>

              {/* Coordinates & Direct Social Actions */}
              <ScrollReveal animation="fade-up" delay={350}>
                <div className="pt-2 space-y-4">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-gray-800">
                    <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>📍 Tunga goro, Behind FGC minna, Niger state.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="https://www.instagram.com/ragusmafarmsng/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:opacity-95 transition-all hover:-translate-y-0.5"
                    >
                      <span>Connect on Instagram</span>
                      <span className="text-pink-200 font-normal">@ragusmafarmsng</span>
                    </a>

                    <a
                      href="https://wa.me/2348135834368?text=Hello%20CEO%20Ragusma%20Farms,%20I%20would%20like%20to%20inquire%20about%20your%20farm%20products"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat With Farm Desk</span>
                    </a>

                    <Link
                      href="/products"
                      className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-forest-300 text-forest-900 hover:bg-forest-50 font-bold text-xs sm:text-sm transition-all hover:-translate-y-0.5"
                    >
                      <span>Shop Fresh Produce</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </div>
      </section>

      <SectionDivider from="white" to="cream" />

      {/* =========================================================================
          5. OUR PRODUCTS (DYNAMIC DATABASE CATALOGUE)
          ========================================================================= */}
      <section id="products" className="py-20 lg:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          </ScrollReveal>

          {/* Category Filter Pills */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
              <Link
                href="/products"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-forest-800 text-white whitespace-nowrap shadow-sm hover:bg-forest-900 transition"
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
          </ScrollReveal>

          {/* Product Grid with Staggered Entrance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product, idx) => (
              <ScrollReveal key={product.id} animation="fade-up" delay={idx * 60}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-forest-100 p-8 shadow-sm">
              <p className="text-gray-500">Products are currently being updated by farm management.</p>
            </div>
          )}
        </div>
      </section>

      <SectionDivider from="cream" to="white" />

      {/* =========================================================================
          6. OUR PROFESSIONAL SERVICES (WHAT WE DO)
          ========================================================================= */}
      <section id="services" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-forest-600" /> What We Do
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Our Professional Farm Services
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                From commercial poultry supply to agricultural consultation, Ragusma Farms delivers high standards across Niger State.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Service 1 */}
            <ScrollReveal animation="fade-up" delay={50}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    01
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Live Chicken Sales
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Bulk and individual supply of healthy live broilers, noilers, cockerels, and point-of-lay pullets directly from our spacious pens.
                  </p>
                </div>
                <Link href="/products?category=cat_live_chicken" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Order Live Birds</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Service 2 */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    02
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Frozen Chicken Sales
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Hygienically slaughtered, properly dressed, and flash frozen. Ready for instant cooking, restaurant catering, and celebrations.
                  </p>
                </div>
                <Link href="/products?category=cat_frozen_chicken" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>View Dressed Chicken</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Service 3 */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    03
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Farm Rabbit Sales
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Healthy adult breeding pairs and meat rabbits nurtured on organic vegetation and nutrient-rich feed.
                  </p>
                </div>
                <Link href="/products?category=cat_rabbits" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Explore Rabbitry</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Service 4 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    04
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Fresh Fish & Catfish
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Freshly harvested table-size catfish from aerated freshwater ponds. Available live or prepped upon request for fish pepper soup.
                  </p>
                </div>
                <Link href="/products?category=cat_fish" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Order Catfish</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Service 5 */}
            <ScrollReveal animation="fade-up" delay={250}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    05
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Organic Manure & Dung
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Cured, dry poultry and livestock manure packed in 50kg bags. High NPK natural fertilizer for vegetable, yam, and maize farms.
                  </p>
                </div>
                <Link href="/products?category=cat_manure" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Order Manure Bags</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

            {/* Service 6 */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="h-full p-8 rounded-3xl bg-forest-50/50 border border-forest-100 hover:border-forest-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-serif font-extrabold text-lg shadow group-hover:scale-110 transition-transform">
                    06
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-forest-800 transition-colors">
                    Agricultural Consultation
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Professional livestock setup advisory, pen design, feed formulation, and farm business mentoring with the Madaki Brothers.
                  </p>
                </div>
                <Link href="/products?category=cat_consultation" className="mt-6 text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Book Consultation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* =========================================================================
          7. WHY CHOOSE RAGUSMA FARMS (COMMITMENT TO QUALITY)
          ========================================================================= */}
      <section id="why-us" className="py-20 lg:py-28 bg-forest-900 text-white relative overflow-hidden">
        {/* Subtle decorative agricultural dot grid */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-forest-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gold-600/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-gold-400 font-bold uppercase tracking-widest text-xs">Our Commitment</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-2">
                Why Choose Ragusma Farms?
              </h2>
              <p className="text-forest-200 text-sm mt-2">
                We stand apart through our deep agricultural roots, transparent pricing, and unwavering focus on food safety.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.whyChooseUs?.map((item, idx) => (
              <ScrollReveal key={item.id || idx} animation="fade-up" delay={idx * 75}>
                <div className="h-full p-7 rounded-3xl bg-forest-800/60 border border-forest-700/60 hover:bg-forest-800 hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold mb-5 border border-gold-400/30 group-hover:scale-110 group-hover:bg-gold-500/30 transition-transform">
                    <CheckCircle2 className="w-6 h-6 text-gold-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. HOW IT WORKS: THE 4-STEP FARM-TO-TABLE JOURNEY
          ========================================================================= */}
      <section id="how-it-works" className="py-20 lg:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-forest-700 font-bold uppercase tracking-widest text-xs">Simple & Seamless</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">
                How Ordering Works
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Get fresh farm products to your kitchen or farm in four straightforward steps.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <ScrollReveal animation="fade-up" delay={50}>
              <div className="h-full p-7 rounded-3xl bg-white border border-forest-100 shadow-md text-center relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 font-serif font-extrabold flex items-center justify-center mx-auto mb-5 text-lg shadow-sm">
                  01
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Browse Products</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Explore live chicken, catfish, rabbits, frozen cuts, and manure with clear Naira prices.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal animation="fade-up" delay={120}>
              <div className="h-full p-7 rounded-3xl bg-white border border-forest-100 shadow-md text-center relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 font-serif font-extrabold flex items-center justify-center mx-auto mb-5 text-lg shadow-sm">
                  02
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Add to Cart</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Select desired quantities validated against real-time stock levels with instant cart calculation.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal animation="fade-up" delay={190}>
              <div className="h-full p-7 rounded-3xl bg-white border border-forest-100 shadow-md text-center relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 font-serif font-extrabold flex items-center justify-center mx-auto mb-5 text-lg shadow-sm">
                  03
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Delivery or Pickup</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Enjoy FREE delivery in Tunga, flat ₦1,000 for regional towns, or ₦0 free collection at our farm gate.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 4 */}
            <ScrollReveal animation="fade-up" delay={260}>
              <div className="h-full p-7 rounded-3xl bg-white border-2 border-gold-400 shadow-xl text-center relative hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 text-forest-950 font-serif font-extrabold flex items-center justify-center mx-auto mb-5 text-lg shadow-md">
                  04
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">Confirm & Track</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Receive live updates as your order moves from Pending to Dispatched and Delivered to your door!
                </p>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* =========================================================================
          9. DELIVERY & PICKUP LOGISTICS MATRIX
          ========================================================================= */}
      <section id="delivery" className="py-20 lg:py-24 bg-white border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal animation="fade-right">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-100 text-gold-900 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Truck className="w-3.5 h-3.5 text-gold-700" /> Transparent Logistics
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={100}>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  Delivery & Farm Pickup Information
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={150}>
                <p className="text-base text-gray-600 leading-relaxed">
                  We believe getting wholesome food should be affordable, transparent, and completely stress-free. We provide direct doorstep dispatch across Minna municipalities and welcome customers to collect orders straight from our farm gate.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={200}>
                <div className="p-6 rounded-3xl bg-forest-50 border border-forest-200/90 shadow-sm space-y-3">
                  <h4 className="font-bold text-forest-900 text-base flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-forest-700 shrink-0" />
                    <span>Farm Gate Pickup (Always ₦0 FREE)</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <strong>Location:</strong> 📍 Tunga goro, Behind FGC minna, Niger state.
                  </p>
                  <p className="text-xs text-gray-500">
                    {settings.pickupInstructions || 'Pickup hours: 8:00 AM – 6:00 PM Monday through Saturday. Please bring your Order ID.'}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={250}>
                <p className="text-xs text-gray-500 italic">
                  * Note: For deliveries to communities not listed in the table, please contact our farm office at <a href="tel:+2348135834368" className="text-forest-700 font-semibold underline">+234 813 583 4368</a> for custom logistics confirmation.
                </p>
              </ScrollReveal>
            </div>

            {/* Delivery Pricing Matrix Table */}
            <div className="lg:col-span-6">
              <ScrollReveal animation="fade-left" delay={150}>
                <div className="bg-white rounded-3xl border border-forest-200 shadow-2xl overflow-hidden">
                  <div className="bg-forest-900 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif font-bold text-xl">Official Delivery Pricing</h3>
                        <p className="text-xs text-forest-200 mt-0.5">Dynamically configured & backend-verified</p>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-gold-400 text-forest-950 font-extrabold text-xs shadow">
                        Live Rates
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-forest-100 max-h-[380px] overflow-y-auto">
                    {deliveryLocations.map((loc) => (
                      <div key={loc.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-forest-50/60 transition-colors">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">{loc.name}</span>
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

                    <div className="p-4 sm:p-5 flex items-center justify-between bg-gold-50/50">
                      <div>
                        <span className="font-bold text-gray-900 text-sm sm:text-base">Farm Pickup</span>
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
                      className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Start Shopping & Select Your Delivery Zone</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gold-600" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          10. TESTIMONIALS SECTION (CUSTOMER EXPERIENCES)
          ========================================================================= */}
      <section id="testimonials" className="py-20 lg:py-24 bg-forest-50/60 border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-forest-700 font-bold uppercase tracking-widest text-xs">Customer Stories</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mt-2">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Hear from local restaurateurs, crop farmers, and households who trust Ragusma Farms for their weekly supply.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <ScrollReveal key={test.id} animation="fade-up" delay={idx * 100}>
                <div className="h-full p-8 rounded-3xl bg-white border border-forest-100 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center gap-1 text-gold-500 text-base">
                      {Array.from({ length: test.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic leading-relaxed font-normal">
                      &quot;{test.content}&quot;
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-forest-50 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-forest-800 text-gold-400 font-serif font-bold flex items-center justify-center text-base shrink-0 shadow">
                      {test.name ? test.name[0] : 'C'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{test.name}</h4>
                      <p className="text-xs text-gray-500">{test.roleOrTitle} • {test.location}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. CONTACT SECTION: FARM DESK & DIRECT MESSAGING
          ========================================================================= */}
      <section id="contact" className="py-20 lg:py-28 bg-white border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            <div className="lg:col-span-5 space-y-6">
              <ScrollReveal animation="fade-right">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider shadow-sm">
                  <Phone className="w-3.5 h-3.5 text-forest-600" /> Get In Touch
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={100}>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  Contact Ragusma Farms
                </h2>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={150}>
                <p className="text-base text-gray-600 leading-relaxed">
                  Have questions regarding livestock orders, bulk frozen chicken supply, organic manure delivery, or agricultural consultation? Reach out directly to our farm desk.
                </p>
              </ScrollReveal>

              <div className="space-y-4">
                <ScrollReveal animation="fade-right" delay={200}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100 hover:border-forest-300 transition-colors shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0 shadow">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone & WhatsApp</h4>
                      <a href={`tel:${content.contact?.phone || '+234 813 583 4368'}`} className="text-base font-bold text-forest-900 hover:underline">
                        {content.contact?.phone || '+234 813 583 4368'}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-right" delay={250}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100 hover:border-forest-300 transition-colors shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0 shadow">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Official Email</h4>
                      <a href={`mailto:${content.contact?.email || 'info@ragusmafarms.com'}`} className="text-base font-bold text-forest-900 hover:underline">
                        {content.contact?.email || 'info@ragusmafarms.com'}
                      </a>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-right" delay={300}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-forest-50/60 border border-forest-100 hover:border-forest-300 transition-colors shadow-sm">
                    <div className="w-11 h-11 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center shrink-0 shadow">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Farm Location & Service Desk</h4>
                      <p className="text-sm font-bold text-gray-900">
                        📍 Tunga goro, Behind FGC minna, Niger state.
                      </p>
                      <p className="text-xs text-forest-700 italic mt-0.5">
                        &quot;At the very heart of agriculture is the drive to feed the world.&quot;
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7">
              <ScrollReveal animation="fade-left" delay={150}>
                <ContactForm 
                  title="Send Us a Direct Message" 
                  subtitle="Fill in your inquiry and our farm desk team will reply promptly."
                />
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
