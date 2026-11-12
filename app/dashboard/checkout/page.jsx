'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatNaira } from '@/lib/utils';
import { 
  Truck, 
  MapPin, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  User
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, cartSubtotal, clearCart } = useCart();
  const toast = useToast();

  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // 'delivery' or 'pickup'
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('test_mode'); // 'test_mode', 'bank_transfer', 'paystack'

  useEffect(() => {
    async function loadData() {
      try {
        const [locRes, setRes] = await Promise.all([
          fetch('/api/delivery-locations'),
          fetch('/api/settings')
        ]);
        const locData = await locRes.json();
        const setData = await setRes.json();

        if (locData.locations) {
          setDeliveryLocations(locData.locations);
          // Auto-select Tunga (free delivery) as recommended default
          const tunga = locData.locations.find(l => l.name.toLowerCase().includes('tunga'));
          if (tunga) setSelectedLocationId(tunga.id);
          else if (locData.locations.length > 0) setSelectedLocationId(locData.locations[0].id);
        }
        if (setData.settings) setSettings(setData.settings);
      } catch (err) {
        console.error('Failed to load checkout settings', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.fullName || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
    }
  }, [user, customerName, customerPhone, customerEmail]);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500">Please add products to your cart before proceeding to checkout.</p>
        <Link href="/dashboard/products" className="inline-block px-6 py-3 bg-forest-800 text-white rounded-xl text-sm font-bold">
          Browse Farm Catalogue
        </Link>
      </div>
    );
  }

  // Calculate current active delivery fee
  const activeLocation = deliveryLocations.find(l => l.id === selectedLocationId);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : (activeLocation ? Number(activeLocation.charge) : 0);
  const totalAmount = cartSubtotal + deliveryFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (deliveryMethod === 'delivery') {
      if (!selectedLocationId) {
        setError('Please select a delivery location.');
        return;
      }
      if (!deliveryAddress || deliveryAddress.trim().length < 5) {
        setError('Please enter a specific delivery address (street, house number or landmark).');
        return;
      }
    }

    if (!customerPhone || customerPhone.trim().length < 8) {
      setError('A valid phone number is required for dispatch communication.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items,
        deliveryMethod,
        deliveryLocationId: deliveryMethod === 'delivery' ? selectedLocationId : null,
        deliveryAddress: deliveryMethod === 'delivery' ? deliveryAddress : settings?.farmPickupAddress,
        customerNotes,
        paymentMethod,
        customerName,
        customerPhone,
        customerEmail
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order.');
      }

      // Success: clear cart and redirect to order tracking view
      clearCart(false);
      const orderRef = data.order?.orderNumber || (data.order?.id ? String(data.order.id).slice(0, 8) : '');
      toast.success(
        `Order ${orderRef ? '#' + orderRef + ' ' : ''}placed successfully! Farm dispatch team notified.`,
        'Order Confirmed'
      );
      router.push(`/dashboard/orders/${data.order.id}?new=true`);
    } catch (err) {
      setError(err.message || 'An error occurred during checkout.');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">
          Order Checkout & Fulfillment
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Select delivery method, verify your details, and confirm your order.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Customer & Delivery Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Contact */}
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-forest-700" /> 1. Customer Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ibrahim Sani"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-cream-50/40 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (For Courier) *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0802 345 6789"
                  className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-cream-50/40 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@gmail.com"
                className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-cream-50/40 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          {/* Delivery Method Choice */}
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-700" /> 2. Delivery or Farm Gate Pickup
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMethod('delivery')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  deliveryMethod === 'delivery'
                    ? 'border-forest-700 bg-forest-50/80 shadow-sm ring-2 ring-forest-600/20'
                    : 'border-forest-100 hover:bg-forest-50/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  deliveryMethod === 'delivery' ? 'bg-forest-800 text-gold-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Doorstep Delivery</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Free in Tunga, ₦1,000 for regional towns.</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMethod('pickup')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  deliveryMethod === 'pickup'
                    ? 'border-forest-700 bg-forest-50/80 shadow-sm ring-2 ring-forest-600/20'
                    : 'border-forest-100 hover:bg-forest-50/40'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  deliveryMethod === 'pickup' ? 'bg-forest-800 text-gold-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Farm Gate Pickup</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">100% Free (₦0 Delivery Fee)</p>
                </div>
              </button>
            </div>

            {/* Conditional Delivery Address Inputs */}
            {deliveryMethod === 'delivery' ? (
              <div className="space-y-4 pt-2 border-t border-forest-50">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Delivery Zone / Location *
                  </label>
                  <select
                    value={selectedLocationId}
                    onChange={(e) => setSelectedLocationId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 font-medium"
                  >
                    {deliveryLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} — {loc.charge === 0 ? 'FREE (₦0)' : formatNaira(loc.charge)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Specific Street Address / Landmark *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="e.g. House No. 24, Near Central Mosque, Bosu Road"
                    className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  <span className="font-bold">Not in Tunga, Bakungu, Bosu, Mokunkele or Shango?</span>
                  <p className="text-[11px] mt-0.5">
                    For other surrounding communities in Niger State, please contact our farm office at <strong>+234 814 000 8921</strong> for custom logistics arrangements.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 space-y-2">
                <span className="text-xs font-bold text-forest-800 uppercase tracking-wider block">
                  Farm Pickup Information
                </span>
                <p className="text-xs text-gray-800 font-medium">
                  <strong>Collection Address:</strong> {settings?.farmPickupAddress || 'Ragusma Farms Main Gate, Off Tunga Express Corridor, Minna'}
                </p>
                <p className="text-xs text-gray-600">
                  {settings?.pickupInstructions || 'Please present your order ID upon arrival at the customer collection point.'}
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order Notes / Special Requests (Optional)
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="e.g. Please dress the chicken and pack in ice; call before dispatch"
                className="w-full px-4 py-2.5 rounded-xl border border-forest-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          {/* Payment Method Choice */}
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-forest-700" /> 3. Select Payment Method
            </h3>

            <div className="space-y-3">
              
              {/* Test Mode Simulation */}
              <label className={`p-4 rounded-2xl border cursor-pointer block transition ${
                paymentMethod === 'test_mode' ? 'border-forest-700 bg-forest-50/70 ring-1 ring-forest-600' : 'border-forest-100 hover:bg-forest-50/30'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="test_mode"
                    checked={paymentMethod === 'test_mode'}
                    onChange={() => setPaymentMethod('test_mode')}
                    className="w-4 h-4 text-forest-700"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">Instant Test Mode (Demo Verification)</span>
                      <span className="bg-gold-100 text-gold-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Instant</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Simulate successful instant payment verification for testing the order workflow.</p>
                  </div>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label className={`p-4 rounded-2xl border cursor-pointer block transition ${
                paymentMethod === 'bank_transfer' ? 'border-forest-700 bg-forest-50/70 ring-1 ring-forest-600' : 'border-forest-100 hover:bg-forest-50/30'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="w-4 h-4 text-forest-700"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-gray-900">Direct Bank Transfer (Manual Payment)</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Transfer directly to Ragusma Farms bank account and upload/confirm payment.</p>
                  </div>
                </div>
              </label>

              {/* Bank Transfer Instructions Preview */}
              {paymentMethod === 'bank_transfer' && settings?.bankTransfer && (
                <div className="p-4 rounded-2xl bg-forest-900 text-white text-xs space-y-2 mt-2">
                  <span className="text-gold-400 font-bold uppercase tracking-wider block">Official Farm Bank Details:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-forest-300">Bank:</span>
                      <p className="font-bold">{settings.bankTransfer.bankName}</p>
                    </div>
                    <div>
                      <span className="text-forest-300">Account Number:</span>
                      <p className="font-bold text-gold-300">{settings.bankTransfer.accountNumber}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-forest-300">Account Name:</span>
                    <p className="font-bold">{settings.bankTransfer.accountName}</p>
                  </div>
                  <p className="text-[11px] text-forest-200 border-t border-forest-800 pt-2 italic">
                    {settings.bankTransfer.instructions}
                  </p>
                </div>
              )}

              {/* Paystack Online Payment */}
              <label className={`p-4 rounded-2xl border cursor-pointer block transition ${
                paymentMethod === 'paystack' ? 'border-forest-700 bg-forest-50/70 ring-1 ring-forest-600' : 'border-forest-100 hover:bg-forest-50/30'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={() => setPaymentMethod('paystack')}
                    className="w-4 h-4 text-forest-700"
                  />
                  <div className="flex-1">
                    <span className="font-bold text-sm text-gray-900">Paystack (Debit Card / USSD / Bank Transfer)</span>
                    <p className="text-[11px] text-gray-500 mt-0.5">Secure payment processing supported for Nigerian cards.</p>
                  </div>
                </div>
              </label>

            </div>
          </div>

        </div>

        {/* Right: Order Summary Confirmation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-sm space-y-6 sticky top-24">
            <h3 className="font-serif font-bold text-lg text-gray-900 pb-3 border-b border-forest-100">
              Order Confirmation Summary
            </h3>

            <div className="divide-y divide-forest-50 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gray-900">{item.productName}</span>
                    <span className="block text-gray-400">
                      {item.quantity} x {formatNaira(item.unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-forest-900">
                    {formatNaira(item.subtotal || item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-forest-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Products Subtotal</span>
                <span className="font-semibold text-gray-900">{formatNaira(cartSubtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>
                  Delivery Charge ({deliveryMethod === 'pickup' ? 'Farm Pickup' : activeLocation?.name || 'Standard'})
                </span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
                  {deliveryFee === 0 ? 'FREE (₦0)' : formatNaira(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-forest-100 flex items-baseline justify-between text-base">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="font-extrabold text-2xl text-forest-900">
                  {formatNaira(totalAmount)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Confirm & Place Order ({formatNaira(totalAmount)}) <ArrowRight className="w-4 h-4 text-gold-400" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              <span>Authentic livestock guaranteed by Ragusma Farms</span>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

