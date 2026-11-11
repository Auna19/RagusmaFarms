'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ClipboardList, 
  Users, 
  Boxes, 
  Truck, 
  FileText, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink,
  Shield,
  Menu,
  X,
  UserCog
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Dashboard Overview', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Product Management', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders Management', href: '/admin/orders', icon: ClipboardList },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Delivery Settings', href: '/admin/delivery', icon: Truck },
    { name: 'Website Content', href: '/admin/content', icon: FileText },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    { name: 'Business Settings', href: '/admin/settings', icon: Settings },
    { name: 'My Profile & Security', href: '/admin/profile', icon: UserCog },
  ];

  const isActive = (href) => {
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-forest-950 text-white border-r border-forest-900 overflow-hidden">
      {/* Top Header & Admin Profile Badge */}
      <div className="p-4 pb-3 space-y-3 shrink-0 border-b border-forest-900/80">
        <Link href="/admin/dashboard" className="flex items-center gap-3 px-1">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-forest-700 bg-forest-900 shadow">
            <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <div>
            <span className="font-serif font-bold text-white text-lg leading-tight block">
              Ragusma<span className="text-forest-400 font-sans ml-0.5">Admin</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-bold text-gold-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Management Portal
            </span>
          </div>
        </Link>

        {/* Clickable Admin Profile Card */}
        <Link 
          href="/admin/profile" 
          onClick={() => setMobileOpen(false)}
          className="flex items-center justify-between p-2.5 rounded-xl bg-forest-900/90 border border-forest-800 hover:border-gold-500/50 hover:bg-forest-900 transition group"
          title="Click to view & edit your profile or change password"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center font-bold text-xs shrink-0 shadow">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate group-hover:text-gold-300 transition">{user?.fullName || 'Administrator'}</h4>
              <p className="text-[10px] text-forest-300 truncate">{user?.email || 'admin@ragusmafarms.com'}</p>
            </div>
          </div>
          <span className="text-[10px] text-gold-400 font-semibold px-1.5 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 shrink-0">Edit</span>
        </Link>
      </div>

      {/* Middle Scrollable Menu */}
      <div className="flex-1 overflow-y-auto p-4 py-3 space-y-1">
        <span className="text-[10px] uppercase font-bold text-forest-400 px-3 tracking-wider block mb-2">Management</span>
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                active
                  ? 'bg-gold-500 text-forest-950 font-bold shadow-md'
                  : 'text-forest-200 hover:text-white hover:bg-forest-900/70'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-forest-950' : 'text-gold-400'}`} />
              <span className="truncate">{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Sticky Bottom Actions & High-Visibility Logout */}
      <div className="p-4 pt-3 border-t border-forest-900 shrink-0 bg-forest-950 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-forest-300 hover:text-white hover:bg-forest-900 rounded-xl transition"
        >
          <ExternalLink className="w-3.5 h-3.5" /> View Public Farm Website
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 rounded-xl shadow-md transition"
        >
          <LogOut className="w-4 h-4" /> Sign Out Admin
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
      <div className="lg:hidden bg-forest-950 text-white border-b border-forest-900 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-forest-700 bg-forest-900">
            <Image src="/assets/logo.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <span className="font-serif font-bold text-white text-base">
            Ragusma Admin
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-white hover:bg-forest-900"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-forest-950 h-full shadow-2xl flex flex-col overflow-hidden">
            {navContent}
          </div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}

