'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  ClipboardList, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Dashboard Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Farm Catalogue', href: '/dashboard/products', icon: ShoppingBag },
    { name: 'Shopping Cart', href: '/dashboard/cart', icon: ShoppingCart, badge: cartCount },
    { name: 'My Orders & Tracking', href: '/dashboard/orders', icon: ClipboardList },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
    { name: 'Profile & Addresses', href: '/dashboard/profile', icon: User },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-forest-100">
      <div className="space-y-6">
        {/* Brand Header */}
        <Link href="/" className="flex items-center gap-3 px-2">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-forest-200 bg-forest-900 shadow">
            <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <span className="font-serif font-bold text-forest-900 text-lg leading-tight block">
              Ragusma<span className="text-forest-600 font-sans ml-0.5">Farms</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gold-600">
              Customer Portal
            </span>
          </div>
        </Link>

        {/* User Card */}
        {user && (
          <div className="p-3.5 rounded-2xl bg-forest-50/70 border border-forest-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-gray-900 truncate">{user.fullName}</h4>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  active
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-gray-600 hover:text-forest-900 hover:bg-forest-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : 'text-forest-700'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    active ? 'bg-gold-500 text-forest-950' : 'bg-gold-500 text-forest-950'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 border-t border-forest-100 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-forest-800 hover:bg-forest-50 rounded-lg transition"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Back to Main Website
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-forest-100 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-forest-200 bg-forest-900">
            <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-serif font-bold text-forest-900 text-base">
            Ragusma Farms
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/cart" className="relative p-2 text-forest-900">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-forest-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-700 hover:bg-forest-50"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full shadow-2xl">
            {navContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

