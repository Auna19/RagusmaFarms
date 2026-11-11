'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatNaira } from '@/lib/utils';
import { ShoppingCart, Check, Eye, AlertCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [feedback, setFeedback] = useState('');

  const isSale = product.promotionalPrice && product.promotionalPrice < product.price;
  const activePrice = isSale ? product.promotionalPrice : product.price;
  const isOutOfStock = !product.isAvailable || product.stock <= 0;
  const isLowStock = !isOutOfStock && product.stock <= 10;

  const handleAdd = (e) => {
    e.preventDefault();
    if (isOutOfStock) return;

    const res = addToCart(product, 1);
    if (res.success) {
      setJustAdded(true);
      setFeedback('Added to cart!');
      setTimeout(() => {
        setJustAdded(false);
        setFeedback('');
      }, 1800);
    } else {
      setFeedback(res.message);
      setTimeout(() => setFeedback(''), 2500);
    }
  };

  const primaryImage = product.images?.[0] || '/assets/live-chicken-pasture.webp';

  return (
    <div className="group bg-white rounded-2xl border border-forest-100/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {isSale && (
          <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
            Save {formatNaira(product.price - product.promotionalPrice)}
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-forest-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            ★ Featured
          </span>
        )}
      </div>

      {/* Stock Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        {isOutOfStock ? (
          <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} Left
          </span>
        ) : (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm">
            In Stock
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.slug || product.id}`} className="relative h-52 sm:h-56 w-full overflow-hidden bg-forest-50/50 block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-600 block mb-1">
            {product.unit}
          </span>
          <Link href={`/products/${product.slug || product.id}`}>
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-forest-700 transition line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-4 pt-3 border-t border-forest-50">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold text-forest-900">
                  {formatNaira(activePrice)}
                </span>
                {isSale && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatNaira(product.price)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-gray-500">Unit: {product.unit}</span>
            </div>
          </div>

          {feedback && (
            <p className={`text-[11px] font-medium mb-2 text-center flex items-center justify-center gap-1 ${
              justAdded ? 'text-forest-700' : 'text-amber-700'
            }`}>
              {justAdded ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              {feedback}
            </p>
          )}

          <div className="grid grid-cols-5 gap-2">
            <Link
              href={`/products/${product.slug || product.id}`}
              className="col-span-2 py-2 px-2.5 rounded-xl border border-forest-200 text-forest-800 hover:bg-forest-50 text-xs font-semibold flex items-center justify-center gap-1 transition"
            >
              <Eye className="w-3.5 h-3.5" /> Details
            </Link>

            <button
              onClick={handleAdd}
              disabled={isOutOfStock}
              className={`col-span-3 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition ${
                isOutOfStock
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : justAdded
                  ? 'bg-forest-600 text-white'
                  : 'bg-forest-800 hover:bg-forest-900 text-white'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-gold-400" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

