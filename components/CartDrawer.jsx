'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Dark Opaque Backdrop */}
      <div 
        className="fixed inset-0 bg-forest-950/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 z-[101]">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l-2 border-forest-200">
          
          {/* Header - Solid Deep Forest Green */}
          <div className="p-4 sm:p-5 bg-forest-900 text-white border-b border-forest-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-800 border border-forest-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base sm:text-lg leading-tight">
                  Your Farm Basket
                </h3>
                <span className="text-[11px] text-forest-300 font-medium">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-forest-300 hover:text-white hover:bg-forest-800 transition"
              aria-label="Close Basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Promotion Banner */}
          <div className="bg-gold-500/15 border-b border-gold-400/30 px-4 py-2.5 flex items-center gap-2 text-forest-950 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-gold-600 shrink-0" />
            <span>Free delivery in Tunga & free farm pickup!</span>
          </div>

          {/* Cart Items List with Soft Cream Background */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-cream-50/60">
            {items.length > 0 ? (
              items.map((item) => (
                <div 
                  key={item.productId} 
                  className="p-3.5 rounded-2xl bg-white border border-forest-200/90 shadow-sm flex items-center gap-3.5 hover:border-forest-300 transition"
                >
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-forest-50 border border-forest-100 shrink-0 shadow-inner">
                    <Image
                      src={item.image || '/assets/live-chicken-pasture.webp'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs font-semibold text-forest-800 mt-0.5">
                      {formatNaira(item.unitPrice)}{' '}
                      <span className="text-gray-400 font-normal">/ {item.productUnit}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-forest-300 rounded-lg bg-cream-50 p-0.5 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700 hover:bg-forest-100 text-xs font-bold"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.maxStock && item.quantity >= item.maxStock}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700 hover:bg-forest-100 text-xs font-bold disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-bold text-xs sm:text-sm text-forest-950">
                        {formatNaira(item.subtotal || item.unitPrice * item.quantity)}
                      </span>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-inner">
                  <ShoppingBag className="w-8 h-8 text-forest-700 opacity-60" />
                </div>
                <h4 className="font-serif font-bold text-gray-900 text-base">Your basket is empty</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Add fresh live chicken, fresh catfish, or farm rabbits from our catalogue to fill your basket.
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block mt-2 px-5 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold shadow-md transition"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-forest-100 bg-white space-y-3 shadow-lg">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Subtotal</span>
                <span className="font-extrabold text-2xl text-forest-950 font-serif">
                  {formatNaira(cartSubtotal)}
                </span>
              </div>

              <Link
                href="/dashboard/checkout"
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-forest-300 hover:bg-forest-50 text-forest-900 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>View Full Cart Page & Delivery Details</span>
                <ExternalLink className="w-3.5 h-3.5 text-forest-600" />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
