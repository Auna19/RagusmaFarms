'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  ArrowRight, 
  Eye, 
  Truck, 
  MapPin, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error('Failed to load customer orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => ['Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery'].includes(o.orderStatus)).length;
  const completedOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalSpending = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-forest-900 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-forest-700/30 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-gold-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Customer Account Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold">
            Welcome back, {user?.fullName || 'Customer'}!
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
            Order fresh live chicken, dressed birds, healthy rabbits, live catfish, and organic manure. Remember: delivery is completely FREE within Tunga!
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <Link
              href="/dashboard/products"
              className="px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-forest-950 font-bold text-xs sm:text-sm shadow transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" /> Start New Order
            </Link>
            <Link
              href="/dashboard/cart"
              className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs sm:text-sm border border-forest-700 transition"
            >
              View Shopping Cart
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{totalOrders}</span>
          <span className="block text-[11px] text-gray-400 mt-1">Lifetime orders placed</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active / Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{pendingOrders}</span>
          <span className="block text-[11px] text-gray-400 mt-1">Processing & dispatch</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{completedOrders}</span>
          <span className="block text-[11px] text-gray-400 mt-1">Successfully delivered</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-forest-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Spent</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-forest-900">{formatNaira(totalSpending)}</span>
          <span className="block text-[11px] text-gray-400 mt-1">Nigerian Naira</span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-gray-900">
              Recent Orders & Live Tracking
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Track your orders from pen preparation to your door</p>
          </div>

          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group"
          >
            All Orders <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-forest-50 overflow-x-auto">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-gray-400">• {formatDate(order.createdAt)}</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {order.deliveryMethod === 'delivery' ? (
                      <span className="inline-flex items-center gap-1 text-forest-800">
                        <Truck className="w-3 h-3" /> Delivery to {order.deliveryLocationName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800">
                        <MapPin className="w-3 h-3" /> Farm Gate Pickup
                      </span>
                    )}
                    {' '}| {order.itemsCount || order.items?.length || 1} item(s)
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="block font-extrabold text-forest-900 text-sm sm:text-base">
                      {formatNaira(order.totalAmount)}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize">{order.paymentStatus}</span>
                  </div>

                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="p-2 rounded-xl border border-forest-200 text-forest-800 hover:bg-forest-50 text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" /> Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 bg-cream-50/50 rounded-2xl border border-dashed border-forest-200">
            <AlertCircle className="w-8 h-8 text-forest-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-800">You haven&apos;t placed any orders yet.</p>
            <p className="text-xs text-gray-500 mt-1">Browse our catalogue of fresh chicken, catfish, rabbits, and manure!</p>
            <Link
              href="/dashboard/products"
              className="inline-block mt-4 px-5 py-2.5 bg-forest-800 text-white rounded-xl text-xs font-bold shadow"
            >
              Browse Catalogue
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}

