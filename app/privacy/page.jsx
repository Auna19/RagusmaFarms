import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: November 2026</p>

        <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            At <strong>Ragusma Farms NG®</strong>, we respect your privacy and are committed to protecting the personal information you share with us while purchasing farm-fresh livestock, poultry, fish, rabbits, and organic agricultural products.
          </p>

          <h3 className="font-bold text-base text-gray-900">1. Information We Collect</h3>
          <p>
            When you register, place orders, or request farm delivery, we collect your full name, phone number, email address, and delivery location. This information is strictly used for order fulfillment, dispatch communication, and customer support.
          </p>

          <h3 className="font-bold text-base text-gray-900">2. Payment Security</h3>
          <p>
            We do not store debit or credit card details on our servers. All online payment transactions are processed securely through trusted, licensed payment processors (such as Paystack).
          </p>

          <h3 className="font-bold text-base text-gray-900">3. Contact Us</h3>
          <p>
            For inquiries regarding our privacy practices, contact our farm office at <strong>Ragusmaa@gmail.com</strong> or call <strong>+234 813 583 4368</strong>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

