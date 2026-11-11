'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Truck, 
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.stats) setStats(data.stats);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading business analytics & farm metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
            Operations Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
            Administrative Farm Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Real-time sales, order processing, and livestock inventory oversight.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/create"
            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-gold-400" /> Add New Product
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold text-xs sm:text-sm shadow-sm transition"
          >
            Process Orders
          </Link>
        </div>
      </div>

      {/* Low Stock Alert if any */}
      {stats?.lowStockCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Low Stock Alert ({stats.lowStockCount} items need attention)</h4>
              <p className="text-xs text-amber-800">
                Products: {stats.lowStockProducts.map(p => `${p.name} (${p.stock} ${p.unit})`).join(', ')}
              </p>
            </div>
          </div>
          <Link
            href="/admin/inventory"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition shrink-0"
          >
            Adjust Stock
          </Link>
        </div>
      )}

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Sales */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block">
            {formatNaira(stats?.totalSales || 0)}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Verified Revenue
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Orders</span>
            <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block">
            {stats?.totalOrders || 0}
          </span>
          <span className="text-[11px] text-gray-500">
            {stats?.pendingOrders || 0} pending • {stats?.completedOrders || 0} delivered
          </span>
        </div>

        {/* Products */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Products Catalogue</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block">
            {stats?.totalProducts || 0}
          </span>
          <span className="text-[11px] text-gray-500">
            {stats?.activeProducts || 0} in stock • {stats?.outOfStockProducts || 0} out of stock
          </span>
        </div>

        {/* Customers */}
        <div className="p-5 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Registered Clients</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 block">
            {stats?.totalCustomers || 0}
          </span>
          <span className="text-[11px] text-gray-500">
            Active farm accounts
          </span>
        </div>

      </div>

      {/* Visual Analytics Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Category Distribution */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900">
            Category Distribution
          </h3>
          <div className="space-y-3">
            {(stats?.categoryDistribution || []).map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-700">{cat.name}</span>
                  <span className="text-gray-900">{cat.count} product(s)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-forest-700 rounded-full"
                    style={{ width: `${Math.min(100, (cat.count / (stats?.totalProducts || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top-Selling Products */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-gray-900">
            Best-Selling Products
          </h3>
          <div className="divide-y divide-gray-100">
            {(stats?.topSellingProducts || []).length > 0 ? (
              stats.topSellingProducts.map((p, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900 block">{p.name}</span>
                    <span className="text-gray-500">{p.quantity} units sold</span>
                  </div>
                  <span className="font-extrabold text-forest-900">{formatNaira(p.totalRevenue)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 py-4">No completed orders yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-gray-900">
              Recent Incoming Orders
            </h3>
            <p className="text-xs text-gray-500">Live feed of orders awaiting confirmation or dispatch</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-100 overflow-x-auto">
          {(stats?.recentOrders || []).map((order) => (
            <div key={order.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                  <span className="text-xs text-gray-400">• {formatDate(order.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-600">
                  Customer: <strong>{order.customerName}</strong> ({order.customerPhone}) • {order.deliveryMethod === 'delivery' ? `Delivery to ${order.deliveryLocationName}` : 'Farm Gate Pickup'}
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <div className="text-right">
                  <span className="block font-extrabold text-forest-900 text-sm">
                    {formatNaira(order.totalAmount)}
                  </span>
                  <span className="text-[10px] text-gray-400 capitalize">{order.paymentStatus}</span>
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="px-3 py-1.5 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-900 transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Process
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

