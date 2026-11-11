'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, Filter } from 'lucide-react';

export default function CustomerProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?includeOutOfStock=true'),
          fetch('/api/categories?onlyActive=true')
        ]);
        const pData = await prodRes.json();
        const cData = await catRes.json();
        if (pData.products) setProducts(pData.products);
        if (cData.categories) setCategories(cData.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = products.filter(p => {
    if (selectedCat !== 'all' && p.categoryId !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Order Farm Products
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Select items to add to your order. Stock is reserved upon order confirmation.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search live chicken, catfish..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCat('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
            selectedCat === 'all'
              ? 'bg-forest-800 text-white shadow-sm'
              : 'bg-white text-gray-600 border border-forest-100 hover:bg-forest-50'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition ${
              selectedCat === c.id
                ? 'bg-forest-800 text-white shadow-sm font-semibold'
                : 'bg-white text-gray-600 border border-forest-100 hover:bg-forest-50'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-2xl bg-white animate-pulse border border-forest-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

