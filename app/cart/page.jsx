'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export default function PublicCartPage() {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartCount 
  } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-forest-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gold-600 uppercase tracking-wider mb-1">
              <ShoppingBag className="w-4 h-4 text-forest-700" />
              <span>Checkout Preparation</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
              Your Farm Shopping Basket
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Review your fresh poultry, fish, rabbits, or organic manure before finalizing delivery details.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest-800 hover:text-forest-950 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Basket State */
          <div className="max-w-2xl mx-auto py-20 text-center space-y-5">
            <div className="w-24 h-24 rounded-3xl bg-forest-100 text-forest-800 flex items-center justify-center mx-auto shadow-inner border border-forest-200">
              <ShoppingBag className="w-12 h-12 text-forest-700 opacity-60" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              Your shopping cart is empty
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Explore our healthy live broilers, whole dressed chicken, breeding rabbits, live catfish, and organic fertilizer. Fresh from our farm to your home!
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-lg hover:shadow-xl transition"
              >
                Explore Farm Catalogue <ArrowRight className="w-4 h-4 text-gold-400" />
              </Link>
            </div>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
            
            {/* Left Items Column (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-forest-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-800">
                  Cart Items ({cartCount})
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Empty Cart
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-forest-100">
                {items.map((item) => (
                  <div key={item.productId} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-forest-50 border border-forest-200 shrink-0 shadow-sm">
                        <Image
                          src={item.image || '/assets/live-chicken-pasture.webp'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-gray-900 text-base sm:text-lg truncate">
                          {item.productName}
                        </h4>
                        <p className="text-xs font-semibold text-forest-800 mt-0.5">
                          {formatNaira(item.unitPrice)}{' '}
                          <span className="text-gray-400 font-normal">/ {item.productUnit}</span>
                        </p>
                        {item.maxStock && (
                          <span className="inline-block mt-1 text-[11px] text-gray-500">
                            Available in stock: <span className="font-bold text-forest-900">{item.maxStock}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-forest-300 rounded-xl bg-cream-50 p-1 shadow-inner">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-forest-100 text-sm font-bold shadow-sm"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.maxStock && item.quantity >= item.maxStock}
                          className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-700 hover:bg-forest-100 text-sm font-bold shadow-sm disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[100px]">
                        <span className="block text-xs text-gray-400">Total</span>
                        <span className="font-extrabold text-base sm:text-lg text-forest-950 font-serif">
                          {formatNaira(item.subtotal || item.unitPrice * item.quantity)}
                        </span>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-gray-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition"
                        title="Remove product from cart"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Free Tunga Delivery Reminder */}
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200/80 flex items-center gap-3">
                <Truck className="w-5 h-5 text-forest-700 shrink-0" />
                <div className="text-xs text-forest-900">
                  <span className="font-bold">Free Local Delivery in Tunga:</span> We provide free doorstep delivery within Tunga and free collection at the farm gate. Regional delivery is a flat ₦1,000.
                </div>
              </div>

            </div>

            {/* Right Summary Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl border border-forest-200/90 shadow-md p-6 sm:p-8 space-y-6">
                <h3 className="font-serif font-bold text-xl text-gray-900 pb-3 border-b border-gray-100">
                  Order Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-bold text-gray-900">{formatNaira(cartSubtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Service</span>
                    <span className="font-semibold text-emerald-700">Calculated at Checkout</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                    <div>
                      <span className="block font-bold text-base text-gray-900">Estimated Total</span>
                      <span className="text-[11px] text-gray-400">Exclusive of optional regional delivery fee</span>
                    </div>
                    <span className="font-extrabold text-2xl text-forest-900 font-serif">
                      {formatNaira(cartSubtotal)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    href="/dashboard/checkout"
                    className="w-full py-4 px-6 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 group text-center"
                  >
                    <span>Proceed to Delivery & Checkout</span>
                    <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition" />
                  </Link>

                  <Link
                    href="/products"
                    className="w-full py-3 px-6 rounded-2xl border border-forest-300 hover:bg-forest-50 text-forest-900 font-semibold text-xs transition flex items-center justify-center text-center"
                  >
                    Add More Products
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>100% Organically Reared & Inspected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>Free Delivery in Tunga & Farm Pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
                    <span>Live Order Tracking & Printable Receipts</span>
                  </div>
                </div>

              </div>

              {/* Need Assistance Card */}
              <div className="p-5 rounded-2xl bg-forest-900 text-white shadow-md space-y-2">
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Farm Desk Support</span>
                <p className="text-xs text-forest-200">
                  Have special bulk orders or culinary specifications? Speak directly with our farm desk team.
                </p>
                <a
                  href="tel:+2348135834368"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-gold-300 transition pt-1"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-gold-400" /> +234 813 583 4368
                </a>
              </div>

            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

