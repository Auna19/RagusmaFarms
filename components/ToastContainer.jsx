'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const TOAST_ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

const TOAST_STYLES = {
  success: {
    border: 'border-emerald-200',
    bg: 'bg-white/95',
    iconBg: 'bg-emerald-100 text-emerald-700',
    titleColor: 'text-emerald-950',
    textColor: 'text-emerald-800',
    progress: 'bg-emerald-500',
    glow: 'shadow-emerald-900/10'
  },
  error: {
    border: 'border-rose-200',
    bg: 'bg-white/95',
    iconBg: 'bg-rose-100 text-rose-700',
    titleColor: 'text-rose-950',
    textColor: 'text-rose-800',
    progress: 'bg-rose-500',
    glow: 'shadow-rose-900/10'
  },
  warning: {
    border: 'border-amber-200',
    bg: 'bg-white/95',
    iconBg: 'bg-amber-100 text-amber-800',
    titleColor: 'text-amber-950',
    textColor: 'text-amber-900',
    progress: 'bg-amber-500',
    glow: 'shadow-amber-900/10'
  },
  info: {
    border: 'border-forest-200',
    bg: 'bg-white/95',
    iconBg: 'bg-forest-100 text-forest-800',
    titleColor: 'text-forest-950',
    textColor: 'text-forest-800',
    progress: 'bg-forest-700',
    glow: 'shadow-forest-900/10'
  }
};

function ToastItem({ toast, onDismiss }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const duration = toast.duration || 4500;
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const IconComponent = TOAST_ICONS[toast.type] || Info;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 200);
  };

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      remainingRef.current -= Date.now() - startTimeRef.current;
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, Math.max(remainingRef.current, 500));
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused]);

  return (
    <div
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto relative w-full sm:w-[380px] max-w-full overflow-hidden rounded-2xl border ${style.border} ${style.bg} ${style.glow} shadow-xl backdrop-blur-md transition-all duration-200 ${
        isClosing
          ? 'opacity-0 translate-y-[-8px] scale-95'
          : 'animate-toast-in'
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Type Icon */}
        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${style.iconBg} shadow-sm`}>
          <IconComponent className="w-4 h-4 stroke-[2.5]" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          {toast.title && (
            <h4 className={`text-xs font-bold font-serif ${style.titleColor} leading-tight`}>
              {toast.title}
            </h4>
          )}
          <p className={`text-xs ${style.textColor} leading-relaxed mt-0.5 break-words font-medium`}>
            {toast.message}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 -mr-1 -mt-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Animated Progress Countdown Bar */}
      <div className="h-1 w-full bg-black/5 overflow-hidden">
        <div
          className={`h-full ${style.progress} ${isPaused ? '' : 'animate-toast-progress'}`}
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        />
      </div>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed top-5 right-5 z-[99999] pointer-events-none flex flex-col gap-2.5 max-w-[calc(100vw-2.5rem)] sm:max-w-md"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

