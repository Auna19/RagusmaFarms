import React from 'react';

/**
 * SectionDivider Component
 * Provides seamless organic curved & blended transitions between sections.
 */
export default function SectionDivider({
  from = 'forest', // 'forest', 'white', 'cream'
  to = 'white',   // 'forest', 'white', 'cream'
  inverted = false,
  className = '',
}) {
  const getFill = (type) => {
    switch (type) {
      case 'forest':
        return '#052210'; // forest-950
      case 'forest-900':
        return '#0A3B1D';
      case 'cream':
        return '#FAFBF8';
      case 'white':
      default:
        return '#FFFFFF';
    }
  };

  const fillColor = getFill(to);

  return (
    <div
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${
        inverted ? 'rotate-180 -mt-1' : '-mb-1'
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 block"
      >
        <path
          d="M0 48L60 41.3C120 34.7 240 21.3 360 16C480 10.7 600 13.3 720 18.7C840 24 960 32 1080 34.7C1200 37.3 1320 34.7 1380 33.3L1440 32V48H1380C1320 48 1200 48 1080 48C960 48 840 48 720 48C600 48 480 48 360 48C240 48 120 48 60 48H0Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}

