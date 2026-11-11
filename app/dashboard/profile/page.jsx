'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, CheckCircle2, AlertCircle, Save, Lock, KeyRound } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback('');
    setError('');
    setSaving(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback('Profile details updated successfully!');
      refreshUser();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Account Profile & Contact Settings
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Manage your contact credentials and default delivery phone numbers.
        </p>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-forest-100 flex items-center gap-2">
          <User className="w-4 h-4 text-forest-700" /> Personal Details
        </h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-cream-50/40 focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Courier Contact)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-cream-50/40 focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Registered)</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            <span className="text-[10px] text-gray-400 block mt-1">To change your email address, contact customer support.</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-gold-400" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-forest-100">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-forest-700" />
            <h3 className="font-serif font-bold text-base text-gray-900">Security & Password</h3>
          </div>
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-forest-700 hover:text-gold-600 underline inline-flex items-center gap-1"
          >
            <KeyRound className="w-3.5 h-3.5" /> Reset via Email
          </Link>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          Need to change or update your login password? You can initiate a secure password reset to your registered email anytime.
        </p>
        <div>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-forest-300 hover:bg-forest-50 text-forest-900 font-semibold text-xs transition"
          >
            <KeyRound className="w-4 h-4 text-gold-600" /> Change / Reset Password
          </Link>
        </div>
      </div>
    </div>
  );
}

