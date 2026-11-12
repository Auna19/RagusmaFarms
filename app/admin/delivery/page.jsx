'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { formatNaira } from '@/lib/utils';
import { 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  AlertCircle, 
  Save, 
  X,
  MapPin,
  ShieldCheck
} from 'lucide-react';

export default function AdminDeliveryPage() {
  const toast = useToast();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    charge: '0',
    description: '',
    estimatedDeliveryTime: 'Same-day (2–4 hours)',
    isActive: true
  });
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadLocations = async () => {
    try {
      const res = await fetch('/api/delivery-locations?all=true');
      const data = await res.json();
      if (data.locations) setLocations(data.locations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const openCreate = () => {
    setEditingLoc(null);
    setFormData({
      name: '',
      charge: '1000',
      description: '',
      estimatedDeliveryTime: 'Same-day (3–5 hours)',
      isActive: true
    });
    setError('');
    setModalOpen(true);
  };

  const openEdit = (loc) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      charge: loc.charge.toString(),
      description: loc.description || '',
      estimatedDeliveryTime: loc.estimatedDeliveryTime || '',
      isActive: loc.isActive
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingLoc ? `/api/delivery-locations/${editingLoc.id}` : '/api/delivery-locations';
      const method = editingLoc ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          charge: Number(formData.charge)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setModalOpen(false);
      setFeedback(`Delivery location "${formData.name}" saved successfully!`);
      toast.success(`Delivery location "${formData.name}" saved successfully!`, 'Zone Saved');
      loadLocations();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed');
      toast.error(err.message || 'Operation failed', 'Error');
    }
  };

  const handleDelete = async (loc) => {
    if (loc.name.toLowerCase() === 'tunga') {
      toast.warning('Tunga is the default free delivery location and cannot be deleted.', 'Action Blocked');
      return;
    }

    if (!confirm(`Are you sure you want to delete delivery zone "${loc.name}"?`)) return;

    try {
      const res = await fetch(`/api/delivery-locations/${loc.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback(`Location "${loc.name}" deleted.`);
      toast.success(`Delivery zone "${loc.name}" removed successfully.`, 'Zone Deleted');
      loadLocations();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to delete location', 'Error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Delivery Management & Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure logistics fees and service zones. All fees are strictly validated and enforced on the backend.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" /> Add Delivery Location
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Delivery Rules Note Card */}
      <div className="p-5 rounded-2xl bg-forest-50 border border-forest-200 text-xs space-y-2">
        <h4 className="font-bold text-forest-900 flex items-center gap-2 text-sm">
          <ShieldCheck className="w-4 h-4 text-forest-700" /> Official Business Delivery Pricing Rules:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          <div className="p-3 bg-white rounded-xl border border-forest-100">
            <span className="font-bold text-gray-900 block">1. Tunga Zone</span>
            <span className="text-emerald-700 font-extrabold">Always FREE (₦0)</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-forest-100">
            <span className="font-bold text-gray-900 block">2. Bakungu, Bosu, Mokunkele, Shango</span>
            <span className="text-forest-900 font-extrabold">Standard ₦1,000 each</span>
          </div>
          <div className="p-3 bg-white rounded-xl border border-forest-100">
            <span className="font-bold text-gray-900 block">3. Farm Gate Pickup</span>
            <span className="text-emerald-700 font-extrabold">Always FREE (₦0)</span>
          </div>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading delivery zones...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4">Location Name</th>
                  <th className="py-3.5 px-4">Delivery Fee</th>
                  <th className="py-3.5 px-4">Estimated Delivery Time</th>
                  <th className="py-3.5 px-4">Description / Notes</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {loc.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`font-extrabold text-sm ${loc.charge === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                        {loc.charge === 0 ? 'FREE (₦0)' : formatNaira(loc.charge)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      {loc.estimatedDeliveryTime || 'Same-day'}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 max-w-xs truncate">
                      {loc.description || '—'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        loc.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {loc.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(loc)}
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-forest-50 hover:text-forest-800 transition"
                          title="Edit Location & Charge"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {loc.name.toLowerCase() !== 'tunga' && (
                          <button
                            onClick={() => handleDelete(loc)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingLoc ? `Edit ${editingLoc.name} Delivery Charge` : 'Add New Delivery Zone'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Community Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Maitumbi"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Charge in ₦ (Set 0 for Free) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.charge}
                  onChange={(e) => setFormData({ ...formData, charge: e.target.value })}
                  placeholder="1000"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Estimated Delivery Time</label>
                <input
                  type="text"
                  value={formData.estimatedDeliveryTime}
                  onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: e.target.value })}
                  placeholder="e.g. Same-day (2–4 hours)"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Zone Coverage</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Residential and commercial delivery to Maitumbi axis"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-forest-700"
                  />
                  Active & Selectable during customer checkout
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {editingLoc ? 'Save Charge Settings' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

