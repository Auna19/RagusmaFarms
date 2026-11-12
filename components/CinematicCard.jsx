'use client';

import React, { useState } from 'react';
import Image from 'next/image';

/**
 * CinematicCard Component
 * Delivers video-like depth & motion for static agricultural photography.
 * Features subtle Ken Burns zoom, light sweep reflections, and floating badges.
 */
export default function CinematicCard({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/5]',
  badge,
  badgePosition = 'bottom',
  overlayGradient = true,
  children,
  priority = false,
  sizes = '(max-width: 768px) 100vw, 500px',
  kenBurns = true,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-forest-100 bg-forest-900 light-sweep-container ${className}`}
    >
      {/* Background Image with optional Ken Burns movement */}
      <div
        className={`relative w-full h-full ${aspectRatio} transition-transform duration-700 ease-out ${
          kenBurns ? 'animate-ken-burns' : ''
        } ${isHovered ? 'scale-105' : ''}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-center"
          priority={priority}
          sizes={sizes}
        />
      </div>

      {/* Atmospheric Vignette & Contrast Overlay */}
      {overlayGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent pointer-events-none" />
      )}

      {/* Floating Badge (Top or Bottom) */}
      {badge && (
        <div
          className={`absolute z-20 ${
            badgePosition === 'top'
              ? 'top-4 left-4 right-4 sm:right-auto'
              : 'bottom-4 left-4 right-4'
          }`}
        >
          {badge}
        </div>
      )}

      {/* Optional Children Overlay */}
      {children && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}
