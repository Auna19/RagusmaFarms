import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />
      <main className="flex-1 py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Terms & Conditions</h1>
        <p className="text-xs text-gray-500 mb-8">Official Ragusma Farms Terms of Service</p>

        <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to the official web application of <strong>Ragusma Farms NG®</strong>. By browsing products or placing orders on this platform, you agree to the following terms and guidelines.
          </p>

          <h3 className="font-bold text-base text-gray-900">1. Fresh Livestock & Produce Quality</h3>
          <p>
            All live broilers, noilers, cockerels, rabbits, and catfish are inspected by qualified farm health personnel prior to dispatch or customer collection. Dressed frozen poultry is cleanly slaughtered and blast frozen according to food safety protocols.
          </p>

          <h3 className="font-bold text-base text-gray-900">2. Delivery Pricing & Farm Pickup</h3>
          <p>
            Doorstep delivery within <strong>Tunga</strong> is free of charge (₦0). Deliveries to <strong>Bakungu, Bosu, Mokunkele, and Shango</strong> incur a flat delivery fee of <strong>₦1,000</strong>. Farm gate pickup is completely free (₦0). For deliveries to other municipal locations, customers are advised to contact the farm office before ordering.
          </p>

          <h3 className="font-bold text-base text-gray-900">3. Cancellations & Order Modifications</h3>
          <p>
            Customers may cancel an order directly from their dashboard while the order status is <em>Pending</em> or <em>Confirmed</em>. Once an order is marked <em>Processing</em>, <em>Out for Delivery</em>, or <em>Ready for Pickup</em>, cancellation is subject to farm approval due to the perishable nature of agricultural livestock.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

