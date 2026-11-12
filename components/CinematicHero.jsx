'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Play, Pause, ChevronRight } from 'lucide-react';

const HERO_SCENES = [
  {
    id: 'poultry',
    image: '/assets/live-chicken-pasture.webp',
    tag: 'Free-Range Pasture',
    title: 'Pure Farm-Fresh Poultry & Livestock',
    caption: 'Pasture-raised broilers, layers, and healthy rabbits reared without artificial additives.',
  },
  {
    id: 'sustainable',
    image: '/assets/sustainable-farming.webp',
    tag: 'Green Economy',
    title: 'Sustainable Agribusiness & Organic Manure',
    caption: 'Circular ecological farming recycling farm resources into high-yield organic fertilizer.',
  },
  {
    id: 'heritage',
    image: '/assets/about-heritage.webp',
    tag: 'Heritage Since 2015',
    title: 'Two Generations of Agricultural Dedication',
    caption: 'Family-founded stewardship rooted in Niger State, delivering wholesome nutrition to Nigeria.',
  },
  {
    id: 'harvest',
    image: '/assets/access-to-food.jpg',
    tag: 'Farm Gate to Table',
    title: 'Fresh Catfish & Table-Ready Delivery',
    caption: 'Aerated freshwater ponds and prompt doorstep delivery across Minna municipalities.',
  }
];

export default function CinematicHero({ content }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextScene = useCallback(() => {
    setCurrentScene((prev) => (prev + 1) % HERO_SCENES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextScene, 7500);
    return () => clearInterval(interval);
  }, [isPlaying, nextScene]);

  const activeScene = HERO_SCENES[currentScene];

  return (
    <section className="relative overflow-hidden bg-forest-950 text-white min-h-[640px] lg:min-h-[720px] flex items-center">
      
      {/* =====================================================================
          CINEMATIC VIDEO-LIKE BACKGROUND LAYERS (WITHOUT ACTUAL VIDEO FILES)
          Seamless Ken Burns slow zoom & pan across authentic farm imagery
          ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HERO_SCENES.map((scene, idx) => {
          const isActive = idx === currentScene;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-35 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div className={`relative w-full h-full ${isActive ? 'animate-ken-burns' : ''}`}>
                <Image
                  src={scene.image}
                  alt={scene.title}
                  fill
                  className="object-cover object-center"
                  priority={idx === 0}
                  sizes="100vw"
                />
              </div>
            </div>
          );
        })}

        {/* Ambient atmospheric lighting & sunbeam shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/50 z-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/60 z-20" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl animate-pulse-glow z-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold-500/15 blur-3xl animate-sunbeam z-20 pointer-events-none" />
        
        {/* Subtle agricultural dot-grid texture */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22C55E_1px,transparent_1px)] [background-size:24px_24px] z-20" />
      </div>

      {/* =====================================================================
          HERO FOREGROUND CONTENT CONTAINER
          ===================================================================== */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Left Column: Storytelling, Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-forest-900/90 border border-forest-700/80 text-forest-100 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-gold-300 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                {content.hero?.taglineBadge || 'PROJECT: GREEN ECONOMY'}
              </span>
              <span className="text-forest-400">•</span>
              <span className="text-forest-200 hidden sm:inline">{content.hero?.badge || 'Certified Natural Agribusiness'}</span>
              <span className="text-forest-200 sm:hidden">Farm Fresh</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.12]">
              {content.hero?.headline || 'Farm-Fresh Livestock & Organically Reared Produce'}
            </h1>

            {/* Subheadline Narrative */}
            <p className="text-base sm:text-lg text-forest-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {content.hero?.subheadline || 'Experience wholesome, nutrient-dense poultry, fresh catfish, healthy rabbits, and organic manure nurtured with uncompromising care in Minna, Niger State.'}
            </p>

            {/* Interactive Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-forest-950 font-extrabold text-base shadow-xl shadow-gold-500/20 hover:shadow-gold-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 group"
              >
                <span>{content.hero?.ctaPrimary || 'Order Farm Produce'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>

              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-forest-900/80 hover:bg-forest-800 text-white font-bold text-base border border-forest-700/80 backdrop-blur-md shadow-lg hover:border-gold-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span>{content.hero?.ctaSecondary || 'Our Heritage Story'}</span>
                <ChevronRight className="w-4 h-4 text-forest-300" />
              </Link>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-forest-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div className="p-2 sm:p-3 rounded-xl bg-forest-900/40 border border-forest-800/50">
                <span className="block text-xl sm:text-2xl font-serif font-extrabold text-gold-400">100%</span>
                <span className="text-[11px] sm:text-xs text-forest-200 font-medium">Organically Reared</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-forest-900/40 border border-forest-800/50">
                <span className="block text-xl sm:text-2xl font-serif font-extrabold text-gold-400">FREE</span>
                <span className="text-[11px] sm:text-xs text-forest-200 font-medium">Delivery in Tunga</span>
              </div>
              <div className="p-2 sm:p-3 rounded-xl bg-forest-900/40 border border-forest-800/50">
                <span className="block text-xl sm:text-2xl font-serif font-extrabold text-gold-400">2015</span>
                <span className="text-[11px] sm:text-xs text-forest-200 font-medium">Est. Heritage</span>
              </div>
            </div>

          </div>

          {/* Right Column: Multi-Layer Cinematic Photographic Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Photo Showcase Window */}
              <div className="relative h-[390px] sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-700/60 bg-forest-900 light-sweep-container group">
                
                {/* Cross-fading Scene Imagery with Ken Burns Animation */}
                {HERO_SCENES.map((scene, idx) => {
                  const isActive = idx === currentScene;
                  return (
                    <div
                      key={scene.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <div className={`relative w-full h-full ${isActive ? 'animate-ken-burns' : ''}`}>
                        <Image
                          src={scene.image}
                          alt={scene.title}
                          fill
                          className="object-cover object-center"
                          priority={idx === 0}
                          sizes="(max-width: 768px) 100vw, 500px"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent z-10" />

                {/* Scene Caption Overlay on Photo */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-950/80 backdrop-blur-md border border-forest-700 text-[10px] font-bold tracking-widest text-gold-300 uppercase shadow-lg">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    {activeScene.tag}
                  </span>
                </div>

                {/* Floating Bottom Card: Official Brand Guarantee */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-forest-950 shadow-2xl border border-white/60 z-20">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-forest-200 bg-forest-900 shrink-0 shadow">
                      <Image src="/assets/logo.jpg" alt="Ragusma Farms Logo" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-forest-800 uppercase tracking-wider">
                          Official Farm Guarantee
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                      </div>
                      <h4 className="font-serif font-bold text-gray-900 text-sm truncate">
                        {activeScene.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate">
                        {activeScene.caption}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Top-Left Floating Badge with Subtle Hover Float */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-gold-400 text-forest-950 p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-white z-30 animate-float-slow">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-forest-800 bg-forest-950 shrink-0 shadow-md">
                  <Image src="/assets/logo.jpg" alt="Ragusma Farms Logo" fill className="object-cover" />
                </div>
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-forest-900">
                    Zero Chemical Feed
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-forest-950">
                    100% Farm Fresh
                  </span>
                </div>
              </div>

              {/* Bottom Interactive Scene Selector & Play/Pause Controller */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  {HERO_SCENES.map((scene, idx) => (
                    <button
                      key={scene.id}
                      onClick={() => setCurrentScene(idx)}
                      aria-label={`Switch to scene ${idx + 1}: ${scene.title}`}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === currentScene
                          ? 'w-8 bg-gold-400'
                          : 'w-2 bg-forest-700 hover:bg-forest-500'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="inline-flex items-center gap-1.5 text-xs text-forest-300 hover:text-white transition px-2.5 py-1 rounded-lg bg-forest-900/60 border border-forest-800"
                  aria-label={isPlaying ? 'Pause automated scene transitions' : 'Play automated scene transitions'}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3 text-gold-400" />
                      <span className="text-[11px]">Pause Motion</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-gold-400" />
                      <span className="text-[11px]">Play Motion</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

