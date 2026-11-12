'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Ultra-performant, hardware-accelerated scroll-triggered animation container.
 * Uses native IntersectionObserver without external animation libraries.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  threshold = 0.12,
  className = '',
  as: Component = 'div',
  once = true,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // If user prefers reduced motion, show immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(currentElement);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // triggers slightly before scrolling past
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [threshold, once]);

  // Compute transform state based on animation type
  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';

    switch (animation) {
      case 'fade-up':
        return 'translate3d(0, 36px, 0)';
      case 'fade-down':
        return 'translate3d(0, -36px, 0)';
      case 'fade-left':
        return 'translate3d(40px, 0, 0)';
      case 'fade-right':
        return 'translate3d(-40px, 0, 0)';
      case 'zoom-in':
        return 'translate3d(0, 24px, 0) scale(0.93)';
      case 'fade':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const style = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transitionProperty: 'opacity, transform',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? 'auto' : 'opacity, transform',
  };

  return (
    <Component
      ref={elementRef}
      style={style}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
}

