'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  ClipboardList, 
  Eye, 
  Truck, 
  MapPin, 
  AlertCircle, 
  Search 
} from 'lucide-react';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.deliveryLocationName?.toLowerCase().includes(q) ||
        o.deliveryAddress?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statuses = ['all', 'Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            My Order History & Tracking
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor livestock preparation, courier dispatch, and pickup readiness.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statuses.map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
              statusFilter === st
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-forest-100 hover:bg-forest-50'
            }`}
          >
            {st === 'all' ? `All Orders (${orders.length})` : st}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading your orders...</div>
        ) : filteredOrders.length > 0 ? (
          <div className="divide-y divide-forest-50">
            {filteredOrders.map(order => (
              <div key={order.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <span className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</span>
                  </div>

                  <p className="text-xs text-gray-600">
                    {order.deliveryMethod === 'delivery' ? (
                      <span className="inline-flex items-center gap-1 text-forest-800 font-medium">
                        <Truck className="w-3.5 h-3.5" /> Doorstep Delivery: {order.deliveryLocationName} ({order.deliveryAddress})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> Farm Gate Collection
                      </span>
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.itemsCount || order.items?.length || 1} item(s) • Payment: <strong className="capitalize text-gray-800">{order.paymentStatus}</strong> ({order.paymentMethod})
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="block font-extrabold text-forest-900 text-base">
                      {formatNaira(order.totalAmount)}
                    </span>
                    <span className="text-[10px] text-gray-400">Total payable</span>
                  </div>

                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-gold-400" /> View & Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 text-forest-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1">There are no orders matching your selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

