'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Save, 
  AlertCircle, 
  Check, 
  ImageIcon,
  Sparkles
} from 'lucide-react';

export default function CreateProductPage() {
  const router = useRouter();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    promotionalPrice: '',
    unit: 'per bird',
    stock: '50',
    isAvailable: true,
    isFeatured: false,
  });

  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([
    { key: 'Health Status', value: 'Fully Vaccinated & Vet-Inspected' },
    { key: 'Feeding', value: '100% Organic Grains & Forage' }
  ]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCats() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
          if (data.categories.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data.categories[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCats();
  }, []);

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

      if (!res.ok) throw new Error(data.error || 'Failed to upload images');

      if (data.urls) {
        setImages(prev => [...prev, ...data.urls]);
        toast.success('Product image(s) uploaded successfully!', 'Upload Complete');
      }
    } catch (err) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

    if (!formData.name || !formData.categoryId || !formData.price) {
      setError('Product name, category, and price are required.');
      return;
    }

    setSaving(true);

    try {
      // Build specifications object
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

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create product');

      toast.success(`Product "${formData.name}" added to catalogue successfully!`, 'Product Created');
      router.push('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-forest-800 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
        </Link>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Add New Farm Product
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Fill in product details, upload genuine farm photographs, and configure stock.
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
                placeholder="e.g. Pasture Broiler Live Chicken"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Category *</label>
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
              placeholder="Detailed description of the product, rearing methods, weight range, packaging details..."
              className="w-full p-4 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing & Stock Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
            Pricing, Stock & Measurement Unit
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Regular Price in ₦ *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="6500"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Optional Promotional Price in ₦</label>
              <input
                type="number"
                min="0"
                value={formData.promotionalPrice}
                onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                placeholder="6200"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Available Stock / Quantity *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="100"
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
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none font-medium"
              >
                <option value="per bird">per bird (Live / Dressed)</option>
                <option value="per pair">per pair (Rabbits / Breeding)</option>
                <option value="per kg">per kg (Catfish / Meat)</option>
                <option value="per 50kg bag">per 50kg bag (Organic Manure)</option>
                <option value="per pack">per pack (Frozen Whole Bird)</option>
                <option value="per basket">per basket</option>
                <option value="per session">per session (Consultation)</option>
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
                ★ Mark as Featured Product
              </label>
            </div>
          </div>
        </div>

        {/* Multi-Image Upload Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">
                Product Photographs & Media
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Upload multiple high-resolution photos of the livestock or farm produce. Images are saved persistently.
              </p>
            </div>
            <label className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Uploading...' : 'Upload Photos'}</span>
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

          {/* Image Previews */}
          {images.length > 0 ? (
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
          ) : (
            <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center space-y-2">
              <ImageIcon className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500 font-medium">No photos uploaded yet.</p>
              <p className="text-[11px] text-gray-400">Click &quot;Upload Photos&quot; above to select images from your device.</p>
            </div>
          )}
        </div>

        {/* Specifications Key-Value Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">
                Product Specifications
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Add attributes like weight, age, immunization, or breed.
              </p>
            </div>
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
                  placeholder="Attribute (e.g. Weight)"
                  className="w-1/3 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  placeholder="Value (e.g. 2.8kg - 3.2kg)"
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
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
            {saving ? 'Creating Product...' : 'Save & Publish Product'}
          </button>
        </div>

      </form>
    </div>
  );
}

