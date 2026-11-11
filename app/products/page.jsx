'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?includeOutOfStock=true'),
          fetch('/api/categories?onlyActive=true')
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.products) setProducts(prodData.products);
        if (catData.categories) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter & Sort logic
  const filteredProducts = products.filter(p => {
    if (selectedCategory !== 'all') {
      if (p.categoryId !== selectedCategory && p.categorySlug !== selectedCategory) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    if (onlyInStock) {
      if (!p.isAvailable || p.stock <= 0) return false;
    }
    return true;
  }).sort((a, b) => {
    const priceA = a.promotionalPrice && a.promotionalPrice < a.price ? a.promotionalPrice : a.price;
    const priceB = b.promotionalPrice && b.promotionalPrice < b.price ? b.promotionalPrice : b.price;

    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <>
      {/* Controls Bar */}
      <section className="bg-white border-b border-forest-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live chicken, catfish, rabbits..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm bg-cream-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting & Stock Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-gray-300"
                />
                In Stock Only
              </label>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-700" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-forest-200 text-xs sm:text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-gray-700"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-forest-50/70 text-gray-700 hover:bg-forest-100 hover:text-forest-900'
              }`}
            >
              All Items ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-forest-800 text-white shadow-sm font-semibold'
                    : 'bg-forest-50/70 text-gray-700 hover:bg-forest-100 hover:text-forest-900'
                }`}
              >
                {cat.name} ({cat.productCount ?? ''})
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Product List */}
      <section className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-white animate-pulse border border-forest-100 p-4" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-6 font-medium">
                Showing {filteredProducts.length} product{filteredProducts.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-forest-100 p-8 max-w-lg mx-auto">
              <AlertCircle className="w-12 h-12 text-forest-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
              <p className="text-xs text-gray-500 mt-1">
                We could not find products matching your current filters or search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setOnlyInStock(false);
                }}
                className="mt-4 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800 text-gold-300 font-bold uppercase tracking-wider text-xs mb-3 border border-forest-700">
            <Sparkles className="w-3.5 h-3.5" /> 100% Farm-Fresh Livestock & Produce
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Ragusma Farms Product Catalogue
          </h1>
          <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto mt-2">
            Explore healthy live poultry, dressed frozen chicken, breeding rabbits, catfish, and organic manure. Doorstep delivery or free farm collection.
          </p>
        </div>
      </section>

      <Suspense fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading catalogue...</p>
        </div>
      }>
        <ProductsContent />
      </Suspense>

      <Footer />
    </div>
  );
}
