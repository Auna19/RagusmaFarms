import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Layers, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: "Live Chicken Supply",
      categoryLink: "/products?category=cat_live_chicken",
      description: "We rear and supply vigorous, pasture-raised broilers, cockerels, layers, and noiler chickens. Available for individual households, religious celebrations, weddings, and commercial slaughterhouses.",
      points: [
        "Vigorously active and healthy birds with regular vet inspection",
        "Average weights between 2.5kg to 3.5kg",
        "Bulk wholesale pricing for commercial caterers and hotels"
      ]
    },
    {
      title: "Clean Dressed Frozen Chicken",
      categoryLink: "/products?category=cat_frozen_chicken",
      description: "Slaughtered strictly according to food safety and hygiene protocols, de-feathered, eviscerated, vacuum packaged, and blast frozen. Convenient and ready for family stews and culinary seasoning.",
      points: [
        "Zero artificial hormones or water injections",
        "Sanitarily vacuum-sealed food-grade packaging",
        "Insulated cold-chain delivery options across Minna"
      ]
    },
    {
      title: "Farm Rabbits & Breeding Stock",
      categoryLink: "/products?category=cat_rabbits",
      description: "High-fecundity breeding pairs (New Zealand White, Chinchilla crosses) and meat rabbits. Our rabbits are raised in clean, well-aerated wire pens fed on organic forage and mineral pellets.",
      points: [
        "Healthy breeding bucks and does (5–6 months mature)",
        "Dewormed, ear-canker-free with breeding guidance",
        "Lean, tender, cholesterol-free rabbit meat upon request"
      ]
    },
    {
      title: "Fresh Harvest Catfish",
      categoryLink: "/products?category=cat_fish",
      description: "Direct harvesting from our aerated freshwater borehole ponds. Table-size catfish with sweet, firm white flesh and zero muddy odor.",
      points: [
        "Point-and-kill live harvesting at pickup",
        "Option to have fish cleaned, gutted, and spiced for barbecue",
        "Smoked oven-dried catfish with extended shelf life"
      ]
    },
    {
      title: "Organic Poultry & Animal Dung Manure",
      categoryLink: "/products?category=cat_manure",
      description: "Cured, dry poultry dung and composted livestock waste packaged in sturdy 50kg bags. A powerhouse of natural nitrogen, phosphorus, and potassium that regenerates tired soil.",
      points: [
        "Sun-dried and aged to eliminate root burn",
        "High organic matter content boosting soil water retention",
        "Bulk truckload supply available for commercial farm estates"
      ]
    },
    {
      title: "Agricultural & Livestock Consultation",
      categoryLink: "/products?category=cat_consultation",
      description: "1-on-1 personalized agricultural consultancy with Ragusma Farms' executive directors. We assist aspiring and established farm owners in site selection, biosecurity setup, pen blueprints, feed compounding, and farm automation.",
      points: [
        "On-farm physical assessments and virtual strategy sessions",
        "Detailed equipment, feeding, and medication schedules",
        "Biosecurity protocols to protect poultry against viral outbreaks"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-gold-400 font-bold uppercase tracking-widest text-xs">Agro-Allied Solutions</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold mt-2">
            Our Farm Products & Services
          </h1>
          <p className="text-forest-200 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Providing high-quality agricultural products and comprehensive agribusiness services backed by two generations of farming experience.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-cream-50 border border-forest-100 flex flex-col justify-between hover:shadow-xl transition">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-forest-800 text-gold-400 flex items-center justify-center font-bold text-lg shadow">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{srv.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{srv.description}</p>
                  
                  <ul className="space-y-2 pt-2 border-t border-forest-100">
                    {srv.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-forest-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-forest-200/60 flex items-center justify-between">
                  <Link
                    href={srv.categoryLink}
                    className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group"
                  >
                    View in Store <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>

                  <a
                    href="tel:+2348135834368"
                    className="text-xs font-semibold text-gray-500 hover:text-forest-700 flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Inquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

