'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle, 
  Instagram, 
  Facebook, 
  Twitter 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-forest-100 border-t border-forest-900">
      {/* Top Value Highlights */}
      <div className="border-b border-forest-900/60 bg-forest-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-forest-300">
                <Truck className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Free Tunga Delivery</h4>
                <p className="text-xs text-forest-300">Free delivery within Tunga or direct farm collection at ₦0.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-forest-300">
                <ShieldCheck className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">100% Quality Assured</h4>
                <p className="text-xs text-forest-300">Naturally reared poultry, fish & rabbits under veterinary oversight.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 rounded-xl bg-forest-900/40 border border-forest-800/40">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-forest-300">
                <CheckCircle className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Farm Heritage Since 2015</h4>
                <p className="text-xs text-forest-300">Two generations of trusted livestock & sustainable farming experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Company Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-forest-700 bg-white shadow">
                <Image 
                  src="/assets/logo.jpg" 
                  alt="Ragusma Farms Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div>
                <span className="text-2xl font-serif font-bold text-white tracking-tight">
                  Ragusma<span className="text-forest-400 font-sans ml-1">Farms</span>
                </span>
                <span className="block text-[10px] tracking-widest uppercase font-semibold text-gold-400">
                  Project: Green Economy
                </span>
              </div>
            </Link>

            <p className="text-sm text-forest-200/90 leading-relaxed">
              At Ragusma Farms, we are pleased to be a family-owned and operated agricultural enterprise dedicated to nourishing our community with healthy poultry, farm rabbits, fresh fish, and organic manure. 
            </p>
            <p className="text-xs text-forest-300 italic border-l-2 border-gold-500 pl-3">
              &quot;Access to Food is a right, not a privilege.&quot; — Hajiya Ramatu Mallam Madaki (Founder, 2015)
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://www.instagram.com/ragusmafarmsng/" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center text-forest-300 hover:text-white hover:bg-forest-800 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com/ragusmafarmsng" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center text-forest-300 hover:text-white hover:bg-forest-800 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/ragusmafarmsng" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center text-forest-300 hover:text-white hover:bg-forest-800 transition"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Quick Links</h5>
            <ul className="space-y-2 text-sm text-forest-200">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Our Farm</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Product Catalogue</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Our Services</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Farm Office</Link></li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Categories</h5>
            <ul className="space-y-2 text-sm text-forest-200">
              <li><Link href="/products?category=cat_live_chicken" className="hover:text-white transition">Live Chicken</Link></li>
              <li><Link href="/products?category=cat_frozen_chicken" className="hover:text-white transition">Dressed Frozen Chicken</Link></li>
              <li><Link href="/products?category=cat_rabbits" className="hover:text-white transition">Breeding Rabbits</Link></li>
              <li><Link href="/products?category=cat_fish" className="hover:text-white transition">Fresh Table Catfish</Link></li>
              <li><Link href="/products?category=cat_manure" className="hover:text-white transition">Organic Poultry Manure</Link></li>
              <li><Link href="/products?category=cat_consultation" className="hover:text-white transition">Farm Consultation</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Farm Contacts</h5>
            <ul className="space-y-3 text-sm text-forest-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>📍 Tunga goro, Behind FGC minna, Niger state.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:+2348135834368" className="hover:text-white transition">+234 813 583 4368</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:Ragusmaa@gmail.com" className="hover:text-white transition">Ragusmaa@gmail.com</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Mon–Sat: 7:00 AM – 6:30 PM<br/>Sun: 1:00 PM – 6:00 PM</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-forest-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-forest-400">
          <div>
            © {new Date().getFullYear()} Ragusma Farms NG®. All Rights Reserved. Co-managed by Madaki Brothers.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-forest-200 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-forest-200 transition">Terms & Conditions</Link>
            <Link href="/admin/login" className="text-forest-300 hover:text-gold-400 transition font-medium">
              Staff / Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

