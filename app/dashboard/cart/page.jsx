'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  MapPin, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartCount 
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8 text-forest-700" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Explore our healthy livestock, fresh live catfish, rabbits, frozen chicken, and organic manure to fill your basket.
        </p>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow transition"
        >
          Browse Farm Catalogue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review your selected products and proceed to delivery selection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-forest-100">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Items</span>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Empty Cart
            </button>
          </div>

          <div className="divide-y divide-forest-50">
            {items.map((item) => (
              <div key={item.productId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-forest-50 shrink-0 border border-forest-100">
                    <Image
                      src={item.image || '/assets/live-chicken-pasture.webp'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{item.productName}</h3>
                    <p className="text-xs text-forest-700 font-semibold mt-0.5">
                      {formatNaira(item.unitPrice)} <span className="text-gray-400 font-normal">/ {item.productUnit}</span>
                    </p>
                    {item.maxStock && (
                      <span className="text-[10px] text-gray-400 block mt-0.5">Max available: {item.maxStock}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Quantity adjustment */}
                  <div className="flex items-center border border-forest-200 rounded-xl bg-cream-50 p-1">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-9 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.maxStock && item.quantity >= item.maxStock}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-gray-600 hover:bg-forest-100 disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <span className="font-extrabold text-forest-900 text-sm sm:text-base">
                      {formatNaira(item.subtotal || item.unitPrice * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary & Checkout Prompt */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-6 sticky top-24">
          <h3 className="font-serif font-bold text-lg text-gray-900 pb-3 border-b border-forest-100">
            Order Subtotal
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">{formatNaira(cartSubtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="text-emerald-700 font-semibold">Calculated at next step</span>
            </div>

            <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-100 space-y-1 text-xs text-forest-900">
              <span className="font-bold flex items-center gap-1.5 text-forest-800">
                <Truck className="w-3.5 h-3.5" /> Delivery Pricing Rules:
              </span>
              <p className="text-[11px] text-gray-600">
                • <strong>Tunga:</strong> FREE (₦0)<br/>
                • <strong>Bakungu, Bosu, Mokunkele, Shango:</strong> ₦1,000<br/>
                • <strong>Farm Gate Pickup:</strong> FREE (₦0)
              </p>
            </div>

            <div className="pt-3 border-t border-forest-100 flex items-baseline justify-between">
              <span className="font-bold text-gray-900 text-base">Estimated Total</span>
              <span className="font-extrabold text-2xl text-forest-900">
                {formatNaira(cartSubtotal)}*
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/checkout"
            className="w-full py-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            href="/dashboard/products"
            className="w-full block text-center py-2 text-xs font-semibold text-forest-700 hover:underline"
          >
            + Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

