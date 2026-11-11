'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Bell, CheckCheck, ExternalLink, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.notifications) setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      });
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchNotifs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">
            Notifications Center
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time farm alerts, order confirmations, and dispatch tracking.
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-forest-50 text-forest-800 hover:bg-forest-100 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-3.5 h-3.5 text-forest-700" /> Mark All as Read
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading notifications...</div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-forest-50">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`py-4 px-4 rounded-2xl transition flex items-start justify-between gap-4 ${
                  !n.isRead ? 'bg-forest-50/50' : 'hover:bg-cream-50/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    !n.isRead ? 'bg-forest-800 text-gold-400' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-gray-400 block">{formatDate(n.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link && (
                    <Link
                      href={n.link}
                      onClick={() => handleMarkOne(n.id)}
                      className="p-1.5 rounded-lg border border-forest-200 text-forest-700 hover:bg-forest-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500">
            <Bell className="w-10 h-10 text-forest-600 mx-auto mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-gray-900">No Notifications</h3>
            <p className="text-xs text-gray-400 mt-1">You are all caught up with your orders!</p>
          </div>
        )}
      </div>
    </div>
  );
}

