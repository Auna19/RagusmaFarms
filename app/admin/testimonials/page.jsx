'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Check, X, Star, AlertCircle } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    roleOrTitle: '',
    content: '',
    rating: 5,
    location: 'Minna, Niger State',
    isFeatured: true
  });
  const [feedback, setFeedback] = useState('');

  const loadTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials?all=true');
      const data = await res.json();
      if (data.testimonials) setTestimonials(data.testimonials);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      roleOrTitle: 'Verified Customer',
      content: '',
      rating: 5,
      location: 'Minna, Niger State',
      isFeatured: true
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      roleOrTitle: item.roleOrTitle || '',
      content: item.content,
      rating: item.rating || 5,
      location: item.location || '',
      isFeatured: Boolean(item.isFeatured)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem ? `/api/testimonials/${editingItem.id}` : '/api/testimonials';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setModalOpen(false);
      setFeedback(`Testimonial ${editingItem ? 'updated' : 'added'} successfully!`);
      loadTestimonials();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Delete feedback from "${item.name}"?`)) return;

    try {
      const res = await fetch(`/api/testimonials/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback('Testimonial removed');
        loadTestimonials();
        setTimeout(() => setFeedback(''), 3000);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Customer Testimonials
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage authentic customer feedback displayed on the public landing page.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" /> Add Testimonial
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-500 text-xs">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                {item.isFeatured && (
                  <span className="bg-forest-100 text-forest-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                &quot;{item.content}&quot;
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900 text-xs">{item.name}</h4>
                <p className="text-[10px] text-gray-400">{item.roleOrTitle} • {item.location}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-forest-50 hover:text-forest-800"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-gray-900">
                {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Hajiya Fatima Aliyu"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role / Customer Description</label>
                <input
                  type="text"
                  value={formData.roleOrTitle}
                  onChange={(e) => setFormData({ ...formData, roleOrTitle: e.target.value })}
                  placeholder="e.g. Restaurateur, Tunga Kitchens"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Tunga, Minna"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Rating (1 to 5)</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Content *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write customer review..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-forest-800 text-white font-bold text-xs rounded-xl shadow"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

