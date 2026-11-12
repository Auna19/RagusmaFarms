'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/lib/utils';
import { 
  Boxes, 
  AlertTriangle, 
  Check, 
  ArrowUpDown, 
  PlusCircle, 
  History,
  X,
  Save
} from 'lucide-react';

export default function AdminInventoryPage() {
  const toast = useToast();
  const [inventory, setInventory] = useState([]);
  const [logs, setLogs] = useState([]);
  const [threshold, setThreshold] = useState(10);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [adjustReason, setAdjustReason] = useState('Farm restock batch');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInventory = async () => {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.inventoryStatus) setInventory(data.inventoryStatus);
      if (data.logs) setLogs(data.logs);
      if (data.threshold) setThreshold(data.threshold);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const openAdjust = (prod) => {
    setSelectedProduct(prod);
    setNewStock(prod.stock.toString());
    setAdjustReason('Farm restock batch');
    setAdjustModal(true);
  };

  const handleStockUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          newStock: Number(newStock),
          reason: adjustReason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAdjustModal(false);
      setFeedback(`Stock updated for ${selectedProduct.name} to ${newStock} units.`);
      toast.success(
        `Stock updated for "${selectedProduct.name}" to ${newStock} units.`,
        'Inventory Restocked'
      );
      loadInventory();
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      toast.error(err.message || 'Failed to update stock', 'Error');
    } finally {
      setSaving(false);
    }
  };

  const lowStockItems = inventory.filter(i => i.stock > 0 && i.stock <= threshold);
  const outOfStockItems = inventory.filter(i => i.stock <= 0);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Inventory & Livestock Stock Control
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor real-time flock, pond, and warehouse counts with automated audit trails.
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Total Monitored Items</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">{inventory.length}</span>
          <span className="block text-[11px] text-gray-400 mt-1">Live active SKUs</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 bg-amber-50/30 shadow-sm">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">Low Stock Alerts</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-700">{lowStockItems.length}</span>
          <span className="block text-[11px] text-amber-700/80 mt-1">Threshold: ≤ {threshold} units</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-1">Out of Stock</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-700">{outOfStockItems.length}</span>
          <span className="block text-[11px] text-rose-700/80 mt-1">Requires immediate farm restock</span>
        </div>
      </div>

      {/* Stock Levels Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-gray-900">Current Stock Levels</h3>
          <span className="text-xs text-gray-500">Auto-deducted on checkout confirmation</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4">Stock Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{item.name}</td>
                  <td className="py-3.5 px-4 text-gray-600">{item.unit}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-gray-900">{item.stock}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.stock === 0
                        ? 'bg-rose-100 text-rose-800'
                        : item.stock <= threshold
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => openAdjust(item)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-forest-800 hover:bg-forest-50 font-semibold text-xs transition"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Audit Logs */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
          <History className="w-4 h-4 text-forest-700" /> Recent Inventory Audit Logs
        </h3>

        <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">
                  {log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount} units
                </span>
                <span className="text-gray-500 ml-2">Reason: {log.reason}</span>
                {log.referenceId && (
                  <span className="text-[10px] text-gray-400 ml-2">Ref: {log.referenceId}</span>
                )}
              </div>
              <span className="text-gray-400 text-[10px]">{formatDate(log.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-gray-900">
                Adjust Stock: {selectedProduct.name}
              </h3>
              <button onClick={() => setAdjustModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  New Available Stock Level ({selectedProduct.unit}) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reason for Adjustment *
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  <option value="Farm restock batch">Farm restock batch (New birds/harvest)</option>
                  <option value="Veterinary audit adjustment">Veterinary audit adjustment</option>
                  <option value="Physical count reconciliation">Physical count reconciliation</option>
                  <option value="Loss / mortality write-off">Loss / mortality write-off</option>
                  <option value="Manual admin correction">Manual admin correction</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAdjustModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  {saving ? 'Updating...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

