'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { formatNaira, formatDate, getStatusBadgeClass } from '@/lib/utils';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  AlertCircle, 
  Package, 
  Check, 
  CreditCard,
  XCircle,
  Sparkles,
  Printer
} from 'lucide-react';

function OrderTrackingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { id } = params;
  const isNew = searchParams.get('new') === 'true';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading order tracking information...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-3" />
        <h2 className="text-xl font-serif font-bold text-gray-900">Order Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">We couldn&apos;t locate this order in your account.</p>
        <Link href="/dashboard/orders" className="inline-block mt-4 px-4 py-2 bg-forest-800 text-white rounded-xl text-xs font-semibold">
          Return to Orders
        </Link>
      </div>
    );
  }

  // Stepper tracking logic
  const isPickup = order.deliveryMethod === 'pickup';
  const steps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Order received by farm' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Reviewed & verified' },
    { key: 'Processing', label: 'Processing', desc: 'Harvest & packaging' },
    isPickup 
      ? { key: 'Ready for Pickup', label: 'Ready for Pickup', desc: 'Awaiting farm collection' }
      : { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Dispatched with courier' },
    { key: 'Delivered', label: 'Completed', desc: 'Delivered / Collected' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  // Can cancel rule: pending or confirmed only
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel', note: cancelReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionFeedback('Order has been successfully cancelled.');
      toast.info('Your order has been cancelled.', 'Order Cancelled');
      setCancelModal(false);
      fetchOrder();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order', 'Error');
    } finally {
      setCancelling(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_payment', paymentStatus: 'successful' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActionFeedback('Payment verified successfully!');
      toast.success('Payment simulation successful! Order marked as paid.', 'Payment Verified');
      fetchOrder();
    } catch (err) {
      toast.error(err.message, 'Payment Error');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner if Just Placed */}
      {isNew && (
        <div className="p-5 rounded-3xl bg-emerald-500 text-forest-950 font-medium flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h4 className="font-extrabold text-white text-base">Congratulations! Your Order is Placed!</h4>
              <p className="text-xs text-emerald-950">
                Order #{order.id} has been submitted to Ragusma Farms dispatch team. Track status below.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/dashboard/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Order #{order.id}
            </h1>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusBadgeClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>
          <span className="text-xs text-gray-400">Placed on {formatDate(order.createdAt)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-forest-200 text-forest-800 hover:bg-forest-50 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print Receipt
          </button>

          {canCancel && (
            <button
              onClick={() => setCancelModal(true)}
              className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Visual Tracking Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-base text-gray-900">
          Live Order Status Progress
        </h3>

        {isCancelled ? (
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">This Order Has Been Cancelled</h4>
              <p className="text-[11px] mt-0.5">
                Reserved livestock/produce has been restored to inventory. If you had made payment, contact farm support for refund processing.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {steps.map((st, idx) => {
              const isPast = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div key={st.key} className="flex sm:flex-col items-center sm:text-center gap-3 relative">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    isPast
                      ? 'bg-forest-800 text-white shadow-md'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  } ${isCurrent ? 'ring-4 ring-gold-400/40 bg-gold-500 text-forest-950 font-extrabold' : ''}`}>
                    {isPast && !isCurrent ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div>
                    <h5 className={`text-xs font-bold ${isCurrent ? 'text-forest-900 font-extrabold' : isPast ? 'text-gray-900' : 'text-gray-400'}`}>
                      {st.label}
                    </h5>
                    <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-forest-100">
            Order Items Snapshot
          </h3>

          <div className="divide-y divide-forest-50">
            {(order.items || []).map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-forest-50 shrink-0 border border-forest-100">
                    <Image
                      src={item.productImage || '/assets/live-chicken-pasture.webp'}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug">{item.productName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.quantity} x {formatNaira(item.unitPrice)} ({item.productUnit})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-forest-900 text-sm">
                    {formatNaira(item.subtotal)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-forest-100 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-gray-900">{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee ({order.deliveryMethod === 'pickup' ? 'Farm Gate Pickup' : order.deliveryLocationName})</span>
              <span className={`font-semibold ${order.deliveryFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                {order.deliveryFee === 0 ? 'FREE (₦0)' : formatNaira(order.deliveryFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-forest-100 flex justify-between text-base">
              <span className="font-bold text-gray-900">Total Order Amount</span>
              <span className="font-extrabold text-xl text-forest-900">
                {formatNaira(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Fulfillment & Payment Details */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Fulfillment Info */}
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-forest-100">
              Fulfillment Method
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                {order.deliveryMethod === 'delivery' ? (
                  <Truck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                ) : (
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-gray-900 block">
                    {order.deliveryMethod === 'delivery' ? 'Home / Office Delivery' : 'Farm Gate Collection'}
                  </span>
                  <p className="text-gray-600 mt-0.5">{order.deliveryAddress}</p>
                </div>
              </div>

              {order.customerNotes && (
                <div className="p-3 rounded-xl bg-forest-50/70 border border-forest-100">
                  <span className="font-bold text-gray-700 block mb-0.5">Special Instructions:</span>
                  <p className="text-gray-600 italic">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-forest-100">
              Payment Status
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold capitalize text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status:</span>
                <span className={`font-bold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                  order.paymentStatus === 'successful' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reference:</span>
                <span className="font-mono text-gray-600 text-[10px]">{order.paymentReference}</span>
              </div>

              {order.paymentStatus === 'pending' && (
                <button
                  onClick={handleSimulatePayment}
                  className="w-full mt-3 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition"
                >
                  Verify Payment Simulation
                </button>
              )}
            </div>
          </div>

          {/* Status Timeline History */}
          {order.history && order.history.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 pb-2 border-b border-forest-100">
                Order Activity Log
              </h3>
              <div className="space-y-3">
                {order.history.map((h, i) => (
                  <div key={h.id || i} className="text-xs space-y-0.5 border-l-2 border-forest-600 pl-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{h.newStatus}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(h.createdAt)}</span>
                    </div>
                    <p className="text-gray-600">{h.note}</p>
                    <span className="text-[10px] text-gray-400 block">By {h.changedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Cancellation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-gray-900">
              Confirm Order Cancellation
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to cancel Order <strong>#{order.id}</strong>? Reserved livestock stock will be returned to inventory.
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for cancellation (optional):</label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Changed delivery date / Ordered wrong product quantity"
                className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                Keep Order
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleCancelOrder}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense fallback={
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading order tracking...</p>
      </div>
    }>
      <OrderTrackingContent />
    </React.Suspense>
  );
}


