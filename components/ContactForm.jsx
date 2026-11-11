'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

export default function ContactForm({ title = "Send Us a Direct Message", subtitle = "Fill in your inquiry and our farm desk team will reply promptly." }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    inquiryType: 'live-chicken',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-cream-50 border border-forest-200/80 shadow-md">
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-6">{subtitle}</p>

      {submitted ? (
        <div className="p-6 rounded-2xl bg-forest-50 border border-forest-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-forest-800 text-white mx-auto flex items-center justify-center shadow">
            <CheckCircle2 className="w-6 h-6 text-gold-400" />
          </div>
          <h4 className="text-lg font-serif font-bold text-forest-900">Message Received!</h4>
          <p className="text-sm text-forest-700 max-w-md mx-auto">
            Thank you, <span className="font-semibold">{formData.fullName}</span>. Your message has been routed to our farm desk at Tunga Goro, Minna. We will contact you at <span className="font-semibold">{formData.phone}</span> shortly.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setFormData({ fullName: '', phone: '', email: '', inquiryType: 'live-chicken', message: '' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-forest-800 bg-white border border-forest-300 rounded-xl hover:bg-forest-100 transition"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name *</label>
              <input 
                type="text" 
                name="fullName"
                required 
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Ibrahim Sani" 
                className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
              <input 
                type="tel" 
                name="phone"
                required 
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 0802 345 6789" 
                className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address (Optional)</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. yourname@example.com" 
              className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Product or Inquiry Type</label>
            <select 
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
            >
              <option value="live-chicken">Live Chickens Order</option>
              <option value="frozen-chicken">Dressed / Frozen Chicken</option>
              <option value="rabbits">Breeding or Meat Rabbits</option>
              <option value="fish">Fresh Catfish Order</option>
              <option value="manure">Organic Manure & Dungs</option>
              <option value="consultation">Farm Consultation / Training</option>
              <option value="general">General Inquiries / Delivery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Your Message or Order Details *</label>
            <textarea 
              name="message"
              required 
              rows={4} 
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you need, desired quantities, delivery area in Minna, or consultation questions..." 
              className="w-full px-4 py-3 rounded-xl border border-forest-200 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold shadow-md transition flex items-center justify-center gap-2 text-sm disabled:opacity-70"
          >
            {loading ? (
              <span>Sending Inquiry...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-gold-400" /> Send Message to Farm Desk
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

