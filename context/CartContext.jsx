'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ragusma_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('ragusma_cart', JSON.stringify(items));
      } catch (e) {
        console.error('Failed to save cart to storage', e);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product, quantity = 1) => {
    const qty = parseInt(quantity, 10) || 1;
    let added = false;
    let message = '';

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.productId === product.id);
      const activePrice = product.promotionalPrice && product.promotionalPrice < product.price
        ? product.promotionalPrice
        : product.price;

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + qty;

        if (newQty > product.stock) {
          message = `Cannot add more. Maximum available stock for ${product.name} is ${product.stock} ${product.unit}.`;
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: activePrice,
          subtotal: activePrice * newQty
        };
        added = true;
        message = `Updated ${product.name} quantity in cart!`;
        return updated;
      } else {
        if (qty > product.stock) {
          message = `Cannot add ${qty}. Only ${product.stock} ${product.unit} available in stock.`;
          return prevItems;
        }

        added = true;
        message = `Added ${product.name} to your cart!`;
        return [
          ...prevItems,
          {
            productId: product.id,
            productName: product.name,
            productUnit: product.unit,
            unitPrice: activePrice,
            quantity: qty,
            subtotal: activePrice * qty,
            image: product.images?.[0] || '/assets/live-chicken-pasture.webp',
            maxStock: product.stock
          }
        ];
      }
    });

    if (added) {
      setIsDrawerOpen(true);
    }

    return { success: added, message };
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.productId === productId) {
          const clampedQty = item.maxStock ? Math.min(qty, item.maxStock) : qty;
          return {
            ...item,
            quantity: clampedQty,
            subtotal: item.unitPrice * clampedQty
          };
        }
        return item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(i => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = items.reduce((sum, item) => sum + (item.subtotal || item.unitPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      cartSubtotal,
      isInitialized,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

