'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/context/ToastContext';
import { 
  Settings, 
  Save, 
  Check, 
  AlertCircle, 
  CreditCard, 
  MapPin, 
  Building2,
  ShieldCheck,
  Bell,
  UserCog
} from 'lucide-react';

export default function AdminSettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback('Business settings & payment configurations updated successfully!');
      toast.success('Farm settings and payment configurations updated successfully!', 'Settings Saved');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      toast.error(err.message || 'Failed to save settings', 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading business settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Business & Payment Gateway Settings
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure farm pickup locations, direct bank accounts, Paystack API credentials, and stock thresholds.
          </p>
        </div>
        <Link
          href="/admin/profile"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs shadow-sm transition self-start sm:self-auto shrink-0"
        >
          <UserCog className="w-4 h-4 text-gold-400" /> Admin Profile & Password
        </Link>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Business Identity & Pickup Location */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-forest-700" /> Farm Identity & Pickup Desk
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Registered Business Name</label>
              <input
                type="text"
                value={settings.farmName || ''}
                onChange={(e) => setSettings({ ...settings, farmName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency || '₦'}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Gate Pickup Address</label>
            <input
              type="text"
              value={settings.farmPickupAddress || ''}
              onChange={(e) => setSettings({ ...settings, farmPickupAddress: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Customer Pickup Instructions</label>
            <textarea
              rows={2}
              value={settings.pickupInstructions || ''}
              onChange={(e) => setSettings({ ...settings, pickupInstructions: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        {/* Bank Transfer Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-forest-700" /> Direct Bank Transfer Configuration
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-forest-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bankTransfer?.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, enabled: e.target.checked }
                })}
                className="w-4 h-4 rounded text-forest-700"
              />
              Enable Bank Transfer
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.bankTransfer?.bankName || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, bankName: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.bankTransfer?.accountNumber || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, accountNumber: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Account Name</label>
              <input
                type="text"
                value={settings.bankTransfer?.accountName || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  bankTransfer: { ...settings.bankTransfer, accountName: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Payment Instructions to Customers</label>
            <textarea
              rows={2}
              value={settings.bankTransfer?.instructions || ''}
              onChange={(e) => setSettings({
                ...settings,
                bankTransfer: { ...settings.bankTransfer, instructions: e.target.value }
              })}
              className="w-full p-2.5 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        {/* Paystack Payment Gateway */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" /> Paystack Gateway Integration
            </h3>
            <label className="flex items-center gap-2 text-xs font-semibold text-forest-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.paystack?.enabled}
                onChange={(e) => setSettings({
                  ...settings,
                  paystack: { ...settings.paystack, enabled: e.target.checked }
                })}
                className="w-4 h-4 rounded text-forest-700"
              />
              Enable Paystack
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Paystack Public Key</label>
              <input
                type="text"
                value={settings.paystack?.publicKey || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  paystack: { ...settings.paystack, publicKey: e.target.value }
                })}
                placeholder="pk_test_..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Paystack Secret Key</label>
              <input
                type="password"
                value={settings.paystack?.secretKey || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  paystack: { ...settings.paystack, secretKey: e.target.value }
                })}
                placeholder="sk_test_..."
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.paystack?.testMode}
                onChange={(e) => setSettings({
                  ...settings,
                  paystack: { ...settings.paystack, testMode: e.target.checked }
                })}
                className="w-4 h-4 rounded text-forest-700"
              />
              Run in Test Mode (Development simulation)
            </label>
          </div>
        </div>

        {/* Inventory Alert Threshold */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-forest-700" /> Stock Alert Threshold
          </h3>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Low-Stock Alert Level (Units)</label>
            <input
              type="number"
              min="1"
              value={settings.lowStockThreshold || 10}
              onChange={(e) => setSettings({
                ...settings,
                lowStockThreshold: Number(e.target.value)
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
            />
            <span className="text-[10px] text-gray-400 block mt-1">Triggers low stock banners on the admin dashboard.</span>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold-400" />
            {saving ? 'Saving...' : 'Save All Business Settings'}
          </button>
        </div>

      </form>
    </div>
  );
}

