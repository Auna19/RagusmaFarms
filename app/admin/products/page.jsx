'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatNaira } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Star, 
  AlertCircle,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products?includeOutOfStock=true'),
        fetch('/api/categories')
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.products) setProducts(pData.products);
      if (cData.categories) setCategories(cData.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback(`Product "${name}" deleted successfully.`);
      loadData();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !product.isAvailable })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !product.isFeatured })
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Product Catalogue Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add new products, upload farm photographs, manage prices, and control active status.
          </p>
        </div>

        <Link
          href="/admin/products/create"
          className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" /> Add New Product
        </Link>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-forest-600 focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading product catalogue...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (₦)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((prod) => {
                  const category = categories.find(c => c.id === prod.categoryId);
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-forest-50 shrink-0 border border-gray-200">
                            <Image
                              src={prod.images?.[0] || '/assets/live-chicken-pasture.webp'}
                              alt={prod.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{prod.name}</span>
                            <span className="text-[10px] text-gray-400">Unit: {prod.unit}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-gray-700">
                        {category ? category.name : 'Uncategorized'}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">
                          {formatNaira(prod.price)}
                        </div>
                        {prod.promotionalPrice && (
                          <span className="text-[10px] text-amber-600 font-semibold block">
                            Sale: {formatNaira(prod.promotionalPrice)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`font-bold ${prod.stock <= 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                          {prod.stock}
                        </span>
                        <span className="text-[10px] text-gray-400 block">{prod.unit}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFeatured(prod)}
                          className={`p-1.5 rounded-lg border transition ${
                            prod.isFeatured
                              ? 'bg-amber-100 border-amber-300 text-amber-700'
                              : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-600'
                          }`}
                          title="Toggle Featured Choice"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(prod)}
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] border transition ${
                            prod.isAvailable && prod.stock > 0
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {prod.isAvailable && prod.stock > 0 ? 'Active' : 'Unavailable'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${prod.id}/edit`}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-800 transition"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try changing your search query or add a new product.</p>
          </div>
        )}
      </div>

    </div>
  );
}

