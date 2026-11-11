'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function GlobalCartDrawer() {
  const { isDrawerOpen, closeDrawer } = useCart();
  return <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />;
}
