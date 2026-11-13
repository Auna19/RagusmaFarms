'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear credentials whenever the admin login page mounts or is navigated to
  useEffect(() => {
    setEmail('');
    setPassword('');
    setError('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const submitEmail = email.trim();
    const submitPassword = password;

    try {
      const data = await login(submitEmail, submitPassword, 'admin');
      // Immediately clear credentials from memory
      setEmail('');
      setPassword('');

      toast.success('Admin authentication successful. Welcome back!', 'Access Granted');
      router.push(data.redirectTo || '/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Administrator login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-forest-700/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-forest-600 bg-forest-900 shadow">
            <Image src="/assets/logo.jpg" alt="Ragusma Farms Logo" fill className="object-contain p-1" />
          </div>
          <span className="text-2xl font-serif font-bold text-white">
            Ragusma<span className="text-forest-400 font-sans ml-1">Farms</span>
          </span>
        </Link>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-900 border border-forest-700 text-gold-400 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" /> Staff & Management Control Portal
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-white">
          Administrator Sign In
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <div className="bg-forest-900/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-forest-800">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
            {/* Hidden anti-autofill trap for modern browsers */}
            <input type="text" name="fake_admin_email" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
            <input type="password" name="fake_admin_pwd" style={{ display: 'none' }} tabIndex="-1" autoComplete="new-password" />

            <div>
              <label className="block text-xs font-semibold text-forest-200 mb-1">Administrative Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="admin_login_email"
                  autoComplete="off"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ragusmafarms.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest-700 bg-forest-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-forest-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-forest-200">Admin Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" /> Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-forest-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="admin_login_password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-forest-700 bg-forest-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder-forest-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-forest-400 hover:text-white focus:outline-none p-1 rounded"
                  tabIndex="-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-forest-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate Admin Session <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-forest-400">
            Not an administrator?{' '}
            <Link href="/login" className="font-semibold text-gold-400 hover:underline">
              Go to Customer Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

