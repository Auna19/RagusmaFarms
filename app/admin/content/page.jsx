'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { 
  FileText, 
  Save, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Award, 
  Phone, 
  MapPin, 
  Mail,
  Plus,
  Trash2
} from 'lucide-react';

export default function AdminContentPage() {
  const toast = useToast();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const loadContent = async () => {
    try {
      const res = await fetch('/api/content');
      const data = await res.json();
      if (data.content) setContent(data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback('');
    setError('');

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback('Website content updated successfully! Public landing page updated.');
      toast.success('Landing page and website content saved successfully!', 'Content Published');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update website content');
      toast.error(err.message || 'Failed to update website content', 'Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading website content editor...</div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Landing Page & Content Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Customize headline copy, mission, vision, about us story, and business contact coordinates dynamically.
        </p>
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
        
        {/* Hero Section Copy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500" /> Hero Section Headlines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Badge / Tagline</label>
              <input
                type="text"
                value={content.hero.badge || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, badge: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Project Badge</label>
              <input
                type="text"
                value={content.hero.taglineBadge || ''}
                onChange={(e) => setContent({
                  ...content,
                  hero: { ...content.hero, taglineBadge: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Main Headline</label>
            <input
              type="text"
              value={content.hero.headline || ''}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, headline: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Subheadline Supporting Paragraph</label>
            <textarea
              rows={3}
              value={content.hero.subheadline || ''}
              onChange={(e) => setContent({
                ...content,
                hero: { ...content.hero, subheadline: e.target.value }
              })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        {/* About Us Narrative */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-forest-700" /> About Ragusma Farms Story & Founder
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Section Title</label>
            <input
              type="text"
              value={content.about.title || ''}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, title: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 1 (Family Roots)</label>
            <textarea
              rows={3}
              value={content.about.paragraph1 || ''}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, paragraph1: e.target.value }
              })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Paragraph 2 (Founding & Management)</label>
            <textarea
              rows={3}
              value={content.about.paragraph2 || ''}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, paragraph2: e.target.value }
              })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Official Quote</label>
            <input
              type="text"
              value={content.about.quote || ''}
              onChange={(e) => setContent({
                ...content,
                about: { ...content.about, quote: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs italic"
            />
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Award className="w-4 h-4 text-forest-700" /> Mission & Vision Statements
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Mission Statement</label>
            <textarea
              rows={3}
              value={content.mission.statement || ''}
              onChange={(e) => setContent({
                ...content,
                mission: { statement: e.target.value }
              })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Vision Statement</label>
            <textarea
              rows={3}
              value={content.vision.statement || ''}
              onChange={(e) => setContent({
                ...content,
                vision: { statement: e.target.value }
              })}
              className="w-full p-3 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
            <Phone className="w-4 h-4 text-forest-700" /> Farm Contact Details & Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone Number</label>
              <input
                type="text"
                value={content.contact.phone || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, phone: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email Address</label>
              <input
                type="email"
                value={content.contact.email || ''}
                onChange={(e) => setContent({
                  ...content,
                  contact: { ...content.contact, email: e.target.value }
                })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Farm Agro-Estate Address</label>
            <input
              type="text"
              value={content.contact.farmAddress || ''}
              onChange={(e) => setContent({
                ...content,
                contact: { ...content.contact, farmAddress: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours</label>
            <input
              type="text"
              value={content.contact.workingHours || ''}
              onChange={(e) => setContent({
                ...content,
                contact: { ...content.contact, workingHours: e.target.value }
              })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gold-400" />
            {saving ? 'Publishing Updates...' : 'Publish Content Updates'}
          </button>
        </div>

      </form>
    </div>
  );
}

