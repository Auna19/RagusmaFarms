'use client';

import React, { useState, useEffect } from 'react';
import { formatNaira, formatDate } from '@/lib/utils';
import { 
  Users, 
  Search, 
  Check, 
  X, 
  Mail, 
  Phone, 
  ShoppingBag,
  ShieldCheck
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');

  const loadCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.customers) setCustomers(data.customers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (customer) => {
    try {
      const res = await fetch('/api/admin/customers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: customer.id, isActive: !customer.isActive })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setFeedback(`Customer account status updated.`);
      loadCustomers();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const filtered = customers.filter(c => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.fullName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Registered Customers & Client Profiles
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Directory of all registered farm customers, purchase metrics, and account statuses.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
          />
        </div>
        <span className="text-xs text-gray-500 font-medium">Total Clients: {customers.length}</span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-gray-400">Loading customers...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Phone Number</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filtered.map((cust) => (
                  <tr key={cust.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-forest-100 text-forest-800 font-bold flex items-center justify-center shrink-0">
                          {cust.fullName ? cust.fullName[0].toUpperCase() : 'C'}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{cust.fullName}</span>
                          <span className="text-[10px] text-gray-400">{cust.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <a href={`tel:${cust.phone}`} className="font-medium text-forest-700 hover:underline">
                        {cust.phone || '—'}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500">
                      {formatDate(cust.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900">{cust.totalOrders} order(s)</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-forest-900">{formatNaira(cust.totalSpent)}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cust.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {cust.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(cust)}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition ${
                          cust.isActive
                            ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {cust.isActive ? 'Deactivate' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Users className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 text-sm">No customers matching search</h3>
          </div>
        )}
      </div>

    </div>
  );
}

