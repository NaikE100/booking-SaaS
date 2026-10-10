'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Booking {
  id: string;
  merchant_id: string;
  client_name: string;
  client_phone: string;
  booking_time: string;
  status: string;
  created_at: string;
}

interface DashboardClientProps {
  merchantId: string;
  initialBookings: Booking[];
}

export default function DashboardClient({
  merchantId,
  initialBookings,
}: DashboardClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);

    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (error) {
      console.error('Failed to update status:', error.message);
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
    }

    setUpdatingId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-900/50 text-xs uppercase text-gray-700 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">WhatsApp Contact</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No bookings found for this merchant yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const formattedDate = new Date(booking.booking_time).toLocaleString('en-ZA', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <tr key={booking.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {booking.client_name}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://wa.me/${booking.client_phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 dark:text-green-400 hover:underline font-medium"
                      >
                        {booking.client_phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">{formattedDate}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        disabled={updatingId === booking.id || booking.status === 'confirmed'}
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 transition"
                      >
                        Confirm
                      </button>
                      <button
                        disabled={updatingId === booking.id || booking.status === 'cancelled'}
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-40 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}