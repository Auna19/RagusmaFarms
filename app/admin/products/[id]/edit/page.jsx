'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Save, 
  AlertCircle, 
  ImageIcon
} from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    promotionalPrice: '',
    unit: 'per bird',
    stock: '',
    isAvailable: true,
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [cRes, pRes] = await Promise.all([
          fetch('/api/categories'),
          fetch(`/api/products/${id}`)
        ]);
        const cData = await cRes.json();
        const pData = await pRes.json();

        if (cData.categories) setCategories(cData.categories);
        if (pData.product) {
          const p = pData.product;
          setFormData({
            name: p.name,
            categoryId: p.categoryId,
            description: p.description || '',
            price: p.price.toString(),
            promotionalPrice: p.promotionalPrice ? p.promotionalPrice.toString() : '',
            unit: p.unit || 'per bird',
            stock: p.stock.toString(),
            isAvailable: p.isAvailable,
            isFeatured: Boolean(p.isFeatured),
          });
          setImages(p.images || []);

          if (p.specifications && typeof p.specifications === 'object') {
            const specs = Object.entries(p.specifications).map(([key, value]) => ({ key, value }));
            setSpecifications(specs);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    const uploadFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadFormData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.urls) {
        setImages(prev => [...prev, ...data.urls]);
      }
    } catch (err) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const specObj = {};
      specifications.forEach(s => {
        if (s.key && s.value) specObj[s.key] = s.value;
      });

      const payload = {
        ...formData,
        price: Number(formData.price),
        promotionalPrice: formData.promotionalPrice ? Number(formData.promotionalPrice) : null,
        stock: Number(formData.stock) || 0,
        images: images.length > 0 ? images : ['/assets/live-chicken-pasture.webp'],
        specifications: specObj
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to update product');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading product configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-forest-800 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Edit Product: {formData.name}
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Update prices, stock levels, photographs, and availability. Changes update the public store instantly.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Main Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-4 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
            Pricing, Stock & Availability
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price in ₦ *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Promotional Price in ₦</label>
              <input
                type="number"
                min="0"
                value={formData.promotionalPrice}
                onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Level *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Unit of Measurement</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              >
                <option value="per bird">per bird</option>
                <option value="per pair">per pair</option>
                <option value="per kg">per kg</option>
                <option value="per 50kg bag">per 50kg bag</option>
                <option value="per pack">per pack</option>
                <option value="per basket">per basket</option>
                <option value="per session">per session</option>
                <option value="per item">per item</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-forest-700"
                />
                Active & Available for Sale
              </label>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-amber-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600"
                />
                ★ Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Images Upload Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">
                Product Photographs
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Manage multiple pictures for this item.</p>
            </div>
            <label className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Add More Photos'}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                <Image src={img} alt={`Product ${idx}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-full hover:bg-rose-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 right-1 bg-forest-900/90 text-white text-[9px] text-center font-bold py-0.5 rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900">Specifications</h3>
            <button
              type="button"
              onClick={handleAddSpec}
              className="text-xs font-bold text-forest-700 hover:text-forest-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Attribute
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  className="w-1/3 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  className="p-2 text-gray-400 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold-400" />
            {saving ? 'Updating Product...' : 'Save Product Updates'}
          </button>
        </div>

      </form>
    </div>
  );
}

