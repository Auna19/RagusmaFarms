'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  ClipboardList, 
  Search, 
  Eye, 
  Truck, 
  MapPin, 
  Check, 
  Filter,
  SlidersHorizontal
} from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName?.toLowerCase().includes(q) ||
        o.customerPhone?.toLowerCase().includes(q) ||
        o.customerEmail?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statuses = ['all', 'Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Customer Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Review incoming orders, verify payments, advance dispatch stages, and assign farm couriers.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading customer orders...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Fulfillment</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{order.id}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(order.createdAt)}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{order.customerName}</span>
                      <a href={`tel:${order.customerPhone}`} className="text-[11px] text-forest-700 hover:underline block">
                        {order.customerPhone}
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      {order.deliveryMethod === 'delivery' ? (
                        <div className="text-forest-900">
                          <span className="font-semibold flex items-center gap-1">
                            <Truck className="w-3 h-3 text-forest-700" /> {order.deliveryLocationName}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate max-w-xs block">
                            Fee: {formatNaira(order.deliveryFee)}
                          </span>
                        </div>
                      ) : (
                        <div className="text-amber-800">
                          <span className="font-semibold flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-amber-700" /> Farm Gate Pickup
                          </span>
                          <span className="text-[10px] text-gray-400">Fee: FREE (₦0)</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-gray-900 block">
                        {formatNaira(order.totalAmount)}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {order.itemsCount || order.items?.length || 1} item(s)
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        order.paymentStatus === 'successful'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 capitalize">{order.paymentMethod}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs shadow-sm transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-400" /> Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <ClipboardList className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No orders matching filter</h3>
          </div>
        )}
      </div>

    </div>
  );
}

