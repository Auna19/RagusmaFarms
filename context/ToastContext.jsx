'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ToastContainer from '@/components/ToastContainer';

const ToastContext = createContext(null);

const FLASH_STORAGE_KEY = 'ragusma_flash_toast';

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', message, title, duration = 4500 }) => {
    if (!message) return;
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newToast = { id, type, message, title, duration };

    setToasts((prev) => {
      // Keep at most 4 toasts visible simultaneously to avoid screen clutter
      const trimmed = prev.length >= 4 ? prev.slice(prev.length - 3) : prev;
      return [...trimmed, newToast];
    });

    return id;
  }, []);

  // Flash toast survives page reloads or full window navigations via sessionStorage
  const flash = useCallback((type, message, title) => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(
          FLASH_STORAGE_KEY,
          JSON.stringify({ type, message, title, timestamp: Date.now() })
        );
      } catch (e) {
        console.error('Failed to store flash toast', e);
      }
    }
  }, []);

  // Check for any pending flash toasts on mount & storage events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkFlash = () => {
      try {
        const raw = sessionStorage.getItem(FLASH_STORAGE_KEY);
        if (raw) {
          sessionStorage.removeItem(FLASH_STORAGE_KEY);
          const data = JSON.parse(raw);
          // Only show if stored within the last 15 seconds
          if (Date.now() - (data.timestamp || 0) < 15000) {
            showToast({
              type: data.type || 'success',
              message: data.message,
              title: data.title
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse flash toast', e);
      }
    };

    checkFlash();
    window.addEventListener('storage', checkFlash);
    return () => window.removeEventListener('storage', checkFlash);
  }, [showToast]);

  const toast = {
    success: (message, title = 'Success') => showToast({ type: 'success', message, title }),
    error: (message, title = 'Error') => showToast({ type: 'error', message, title }),
    info: (message, title = 'Notice') => showToast({ type: 'info', message, title }),
    warning: (message, title = 'Attention') => showToast({ type: 'warning', message, title }),
    dismiss,
    flash
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

