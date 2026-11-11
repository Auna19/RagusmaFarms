'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  User, 
  Shield, 
  LogOut, 
  ChevronDown, 
  PhoneCall, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount, isDrawerOpen, openDrawer, closeDrawer } = useCart();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Our Products', href: '/products' },
    { name: 'Our Services', href: '/services' },
    { name: 'Delivery', href: '/#delivery' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-sm transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-forest-900 text-forest-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-300 font-semibold px-2 py-0.5 rounded-full border border-gold-400/30">
              <Sparkles className="w-3 h-3 text-gold-400" /> Free Delivery in Tunga
            </span>
            <span className="hidden md:inline text-forest-200">
              Fresh farm-raised poultry, healthy rabbits & live catfish direct to your doorstep!
            </span>
          </div>
          <div className="flex items-center gap-4 text-forest-200">
            <a href="tel:+2348135834368" className="flex items-center gap-1 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-forest-300" /> +234 813 583 4368
            </a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-forest-300">
              <MapPin className="w-3 h-3" /> Minna, Niger State
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-forest-200 shadow-sm bg-forest-900 group-hover:scale-105 transition-transform duration-200">
              <Image 
                src="/assets/logo.jpg" 
                alt="Ragusma Farms Official Logo" 
                fill 
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-serif font-bold text-forest-900 tracking-tight group-hover:text-forest-700 transition">
                Ragusma<span className="text-forest-600 font-sans ml-1">Farms</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-600">
                Quality You Can Trust
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-forest-800 bg-forest-50 font-semibold'
                    : 'text-gray-700 hover:text-forest-800 hover:bg-forest-50/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={openDrawer}
              className="relative p-2.5 rounded-full text-forest-900 hover:bg-forest-50 transition border border-transparent hover:border-forest-200"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-forest-950 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth State Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-lg bg-forest-50 border border-forest-200 text-forest-900 text-sm font-medium hover:bg-forest-100 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold">
                    {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[120px] truncate">{user.fullName.split(' ')[0]}</span>
                  {user.role === 'admin' && (
                    <span className="bg-forest-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Admin</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-forest-700" />
                </button>

                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-forest-100 py-2 z-50"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>

                    {user.role === 'admin' ? (
                      <>
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-forest-800 font-medium hover:bg-forest-50"
                        >
                          <Shield className="w-4 h-4 text-forest-700" /> Admin Dashboard
                        </Link>
                        <Link
                          href="/admin/products"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-forest-50"
                        >
                          Manage Products
                        </Link>
                        <Link
                          href="/admin/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-forest-50"
                        >
                          Manage Orders
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-forest-800 font-medium hover:bg-forest-50"
                        >
                          <User className="w-4 h-4 text-forest-700" /> My Customer Portal
                        </Link>
                        <Link
                          href="/dashboard/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-forest-50"
                        >
                          My Orders & Tracking
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-forest-50"
                        >
                          Profile & Addresses
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 mt-2 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-medium text-forest-800 hover:text-forest-950 hover:bg-forest-50 rounded-lg transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 rounded-lg shadow-sm hover:shadow transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Shop Now CTA Button */}
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gold-500 hover:bg-gold-600 text-forest-950 shadow-sm transition"
            >
              Shop Now
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-forest-800 hover:bg-forest-50 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-forest-100 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  isActive(link.href)
                    ? 'text-forest-800 bg-forest-50 font-semibold'
                    : 'text-gray-700 hover:bg-forest-50/70 hover:text-forest-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-semibold text-forest-900 bg-forest-50/80 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-forest-700" />
                Shopping Basket
              </span>
              <span className="bg-gold-500 text-forest-950 text-xs font-bold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="border-t border-gray-100 pt-3">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-forest-800 text-white font-medium"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium border border-forest-200 text-forest-800 rounded-lg"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-semibold bg-forest-800 text-white rounded-lg shadow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

