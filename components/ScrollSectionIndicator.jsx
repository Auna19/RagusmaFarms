'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const SECTIONS = [
  { id: 'hero', label: 'Welcome' },
  { id: 'about', label: 'Heritage' },
  { id: 'mission', label: 'Mission' },
  { id: 'ceo', label: 'Leadership' },
  { id: 'products', label: 'Products' },
  { id: 'services', label: 'Services' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'delivery', label: 'Logistics' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollSectionIndicator() {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate scroll progress percentage
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = totalHeight > 0 ? Math.min(100, Math.round((currentScroll / totalHeight) * 100)) : 0;
          setScrollProgress(progress);
          setShowScrollTop(currentScroll > 600);

          // Find current active section
          const scrollPosition = currentScroll + window.innerHeight * 0.35;
          for (let i = SECTIONS.length - 1; i >= 0; i--) {
            const section = document.getElementById(SECTIONS[i].id);
            if (section) {
              const top = section.offsetTop;
              if (scrollPosition >= top) {
                setActiveSection(SECTIONS[i].id);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Page section navigation"
      className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-3 p-2.5 rounded-full bg-forest-950/70 backdrop-blur-md border border-forest-700/60 shadow-2xl transition-opacity duration-300"
    >
      {/* Scroll percentage mini badge */}
      <div 
        className="w-7 h-7 rounded-full bg-forest-900 border border-forest-700/80 flex items-center justify-center text-[9px] font-extrabold text-gold-400 select-none shadow"
        title={`${scrollProgress}% of page viewed`}
      >
        {scrollProgress}%
      </div>

      <div className="w-px h-3 bg-forest-800" />

      {/* Dots navigation */}
      <nav className="flex flex-col gap-2.5 items-center">
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="group relative flex items-center justify-center p-1 focus:outline-none"
              aria-label={`Jump to ${sec.label} section`}
            >
              {/* Tooltip on hover */}
              <span className="pointer-events-none absolute right-full mr-3.5 px-2.5 py-1 rounded-lg bg-forest-900/95 border border-forest-700 text-white text-[11px] font-semibold tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl backdrop-blur-sm">
                {sec.label}
              </span>

              {/* Dot Indicator */}
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3 h-3 bg-gold-400 ring-4 ring-gold-400/25 shadow-lg shadow-gold-500/50'
                    : 'w-2 h-2 bg-forest-600/70 group-hover:bg-forest-300 group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Back to top button */}
      {showScrollTop && (
        <>
          <div className="w-px h-3 bg-forest-800" />
          <button
            onClick={scrollToTop}
            className="w-7 h-7 rounded-full bg-forest-800 hover:bg-forest-700 text-gold-400 flex items-center justify-center transition shadow hover:scale-110 active:scale-95"
            aria-label="Scroll back to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </aside>
  );
}
