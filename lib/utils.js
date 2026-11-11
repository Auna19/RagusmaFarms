import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNaira(amount) {
  const num = Number(amount) || 0;
  return '₦' + num.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
}

export function getStatusBadgeClass(status) {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Processing':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Ready for Pickup':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Out for Delivery':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

