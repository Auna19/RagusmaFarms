'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  ArrowLeft, 
  Check, 
  Truck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Save, 
  AlertCircle,
  CreditCard,
  MessageSquare,
  Clock,
  Printer
} from 'lucide-react';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const toast = useToast();
  const { id } = params;

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus);
        setPaymentStatus(data.order.paymentStatus);
        setAdminNotes(data.order.adminNotes || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setFeedback('');

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote,
          paymentStatus,
          adminNotes
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback('Order status and fulfillment notes updated successfully!');
      toast.success(
        `Order status updated to "${selectedStatus}" successfully!`,
        'Order Updated'
      );
      setStatusNote('');
      fetchOrder();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to update order', 'Error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading order processing details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <Link href="/admin/orders" className="mt-4 inline-block px-4 py-2 bg-forest-800 text-white rounded-xl text-xs">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-forest-800 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Manage Order #{order.id}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
          <span className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</span>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" /> Print Order Manifest
        </button>
      </div>

      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items & Customer Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Customer & Fulfillment Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100 flex items-center gap-2">
              <User className="w-4 h-4 text-forest-700" /> Customer & Fulfillment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Customer Name:</span>
                <span className="font-bold text-gray-900 text-sm">{order.customerName}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Phone Number:</span>
                <a href={`tel:${order.customerPhone}`} className="font-bold text-forest-700 hover:underline text-sm">
                  {order.customerPhone}
                </a>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Email Address:</span>
                <span className="font-medium text-gray-800">{order.customerEmail}</span>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Fulfillment Method:</span>
                <span className="font-bold text-gray-900 uppercase">
                  {order.deliveryMethod === 'delivery' ? 'Doorstep Delivery' : 'Farm Gate Pickup'}
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-gray-100">
                <span className="text-gray-400 block mb-0.5">Delivery Address / Destination:</span>
                <p className="font-medium text-gray-800 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {order.deliveryAddress} ({order.deliveryLocationName})
                </p>
              </div>

              {order.customerNotes && (
                <div className="sm:col-span-2">
                  <span className="text-amber-800 font-bold block mb-0.5">Customer Special Requests:</span>
                  <p className="text-gray-700 italic bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
                    &quot;{order.customerNotes}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Products Snapshot */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
              Ordered Products
            </h3>

            <div className="divide-y divide-gray-100">
              {(order.items || []).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-forest-50 shrink-0 border border-gray-200">
                      <Image
                        src={item.productImage || '/assets/live-chicken-pasture.webp'}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.productName}</h4>
                      <p className="text-xs text-gray-500">
                        {item.quantity} x {formatNaira(item.unitPrice)} ({item.productUnit})
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-gray-900 text-sm">
                    {formatNaira(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Products Subtotal:</span>
                <span className="font-semibold text-gray-900">{formatNaira(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span className="font-semibold text-gray-900">{formatNaira(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount:</span>
                <span className="text-xl font-extrabold text-forest-900">{formatNaira(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 pb-2 border-b border-gray-100">
                Order Activity & Status Audit Trail
              </h3>
              <div className="space-y-3">
                {order.history.map((h, i) => (
                  <div key={h.id || i} className="text-xs space-y-0.5 border-l-2 border-forest-600 pl-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{h.newStatus}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(h.createdAt)}</span>
                    </div>
                    <p className="text-gray-600">{h.note}</p>
                    <span className="text-[10px] text-gray-400 block">By: {h.changedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Admin Order Controls */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 sticky top-24">
            <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
              Update Order Status
            </h3>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Change Order Stage *
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  {statuses.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Status Note / Courier Assignment
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Birds harvested from pen 2, assigned to Courier Batch #4"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Payment Verification Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-gray-50 focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="successful">Successful (Verified Paid)</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Internal Administrative Notes (Private)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal farm notes, payment transaction reference confirmation..."
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-gold-400" />
                {updating ? 'Saving...' : 'Apply Status Update'}
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

