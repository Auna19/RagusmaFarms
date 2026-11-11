'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Shield, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.redirectTo) {
        router.push(data.redirectTo);
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCustomer = () => {
    setEmail('customer@gmail.com');
    setPassword('CustomerPassword123!');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        
        {/* Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-forest-200 bg-forest-900 shadow">
            <Image src="/assets/logo.jpg" alt="Ragusma Farms Logo" fill className="object-cover" />
          </div>
          <span className="text-2xl font-serif font-bold text-forest-950">
            Ragusma<span className="text-forest-600 font-sans ml-1">Farms</span>
          </span>
        </Link>

        <h2 className="mt-4 text-2xl sm:text-3xl font-serif font-bold text-gray-900">
          Customer Account Login
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Sign in to track orders, manage cart, and order farm-fresh produce.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-forest-100">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/40"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-forest-700 hover:text-gold-600 transition underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" /> Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 bg-cream-50/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Log In to My Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">
              Quick Development Demo
            </span>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="w-full py-2 px-3 rounded-lg bg-forest-50 text-forest-800 border border-forest-200 text-xs font-semibold hover:bg-forest-100 transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
              Fill Sample Customer Credentials
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="font-bold text-forest-800 hover:underline">
              Create an Account
            </Link>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
            <Link
              href="/forgot-password"
              className="font-bold text-forest-700 hover:text-gold-600 transition inline-flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5" /> Reset Password
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-forest-800 transition"
            >
              <Shield className="w-3.5 h-3.5" /> Staff / Admin
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

