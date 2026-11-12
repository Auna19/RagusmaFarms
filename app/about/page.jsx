import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { CheckCircle2, Award, Sparkles, HeartHandshake, Leaf, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function AboutPage() {
  const content = await db.content.get();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-gold-400 font-bold uppercase tracking-widest text-xs">Our Heritage & Roots</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mt-2">
            About Ragusma Farms
          </h1>
          <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Two generations of hands-on livestock, poultry, and crop farming experience, founded on the principle that nutritious food is a fundamental human right.
          </p>
        </div>
      </section>

      {/* Heritage Narrative */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
                Family Owned & Operated
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                {content.about.title}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {content.about.paragraph1}
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                {content.about.paragraph2}
              </p>

              <div className="p-6 rounded-2xl bg-forest-900 text-white shadow-lg border border-forest-800">
                <blockquote className="text-lg font-serif italic text-gold-300">
                  &quot;Access to Food is a right, not a privilege.&quot;
                </blockquote>
                <p className="text-xs text-forest-300 mt-2 font-medium">
                  — Hajiya Ramatu Mallama Madaki (Founder, 2015)
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-xl border-4 border-forest-100">
                <Image
                  src="/assets/about-heritage.webp"
                  alt="Ragusma Farms Story"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-forest-50 border border-forest-100">
                  <h4 className="font-bold text-gray-900 text-sm">Founded in 2015</h4>
                  <p className="text-xs text-gray-500 mt-1">Established by Hajiya Ramatu Mallama Madaki with a vision for organic poultry.</p>
                </div>
                <div className="p-5 rounded-2xl bg-forest-50 border border-forest-100">
                  <h4 className="font-bold text-gray-900 text-sm">Co-Managed Since 2022</h4>
                  <p className="text-xs text-gray-500 mt-1">Expanded modern agribusiness and logistics co-directed by the Madaki Brothers.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Leadership Section: Meet the CEO */}
      <section className="py-20 bg-cream-50 border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-5">
              <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-200">
                <Image
                  src="/assets/meet-ceo.webp"
                  alt="Meet Ragusma Farms CEO"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
                Leadership & Vision
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Guiding Agriculture Forward
              </h2>
              <p className="text-base text-forest-800 font-serif italic border-l-4 border-gold-500 pl-4 py-1">
                &quot;At the very heart of agriculture is the drive to feed the world.&quot;
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                At Ragusma Farms, agriculture is more than a commercial enterprise; it is a sacred stewardship of land and life. Guided by the wisdom that sowing seeds and nurturing livestock provides nourishing sustenance for people and creatures alike, our management is committed to regenerative farming.
              </p>

              <div className="p-6 rounded-2xl bg-white border border-forest-200 shadow-sm">
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  &quot;Whoever plants a tree or sows seeds, and then a bird, or a person or an animal eats from it, it is regarded as a charitable gift for him.&quot;
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-gray-800">
                <span>📍 Tunga goro, Behind FGC minna, Niger state.</span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow transition"
                >
                  Explore Our Fresh Products <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://www.instagram.com/ragusmafarmsng/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-forest-300 text-forest-900 hover:bg-forest-50 font-bold text-xs shadow-sm transition"
                >
                  Instagram (@ragusmafarmsng)
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 bg-white border-t border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-forest-50 border border-forest-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">Our Mission</h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {content.mission.statement}
                </p>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-forest-900 text-white flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold border border-forest-700">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-white">Our Vision</h3>
                <p className="text-base text-forest-100/90 leading-relaxed">
                  {content.vision.statement}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

