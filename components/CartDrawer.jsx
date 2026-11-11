'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-forest-100 flex items-center justify-between bg-cream-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-800" />
              <h3 className="font-serif font-bold text-gray-900 text-lg">
                Your Farm Basket ({cartCount})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-forest-100/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-forest-50">
            {items.length > 0 ? (
              items.map((item) => (
                <div key={item.productId} className="py-4 flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-forest-50 border border-forest-100 shrink-0">
                    <Image
                      src={item.image || '/assets/live-chicken-pasture.webp'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                      {item.productName}
                    </h4>
                    <p className="text-xs font-semibold text-forest-800 mt-0.5">
                      {formatNaira(item.unitPrice)} <span className="text-gray-400 font-normal">/ {item.productUnit}</span>
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-forest-200 rounded-lg bg-cream-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100 text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.maxStock && item.quantity >= item.maxStock}
                          className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100 text-xs disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-gray-900">
                        {formatNaira(item.subtotal || item.unitPrice * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-forest-600 mx-auto opacity-40" />
                <h4 className="font-bold text-gray-800 text-sm">Your basket is empty</h4>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Add fresh live chicken, fresh catfish, or rabbits from our catalogue.
                </p>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="inline-block mt-2 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold"
                >
                  Explore Products
                </Link>
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-5 border-t border-forest-100 bg-cream-50/50 space-y-3">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-forest-100/60 text-forest-900 text-[11px] font-medium">
                <Truck className="w-4 h-4 text-forest-700 shrink-0" />
                <span>Free delivery in Tunga & free farm pickup!</span>
              </div>

              <div className="flex items-baseline justify-between text-sm">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="font-extrabold text-xl text-forest-900">
                  {formatNaira(cartSubtotal)}
                </span>
              </div>

              <Link
                href="/dashboard/checkout"
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>

              <div className="text-center">
                <Link
                  href="/dashboard/cart"
                  onClick={onClose}
                  className="text-xs font-semibold text-forest-700 hover:underline"
                >
                  View Full Cart Details
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

