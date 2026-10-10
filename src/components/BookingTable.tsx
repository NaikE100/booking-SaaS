// src/components/BookingTable.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Booking {
  id: string;
  client_name: string;
  client_phone: string;
  booking_time: string;
  status: string;
  services?: {
    name: string;
    price: number;
  };
}

export default function BookingTable({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    setLoadingId(null);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="p-10 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500">
        No bookings found for your business yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-800 text-xs text-zinc-400 uppercase tracking-wider">
            <th className="py-3 px-4">Client Name</th>
            <th className="py-3 px-4">WhatsApp Contact</th>
            <th className="py-3 px-4">Date & Time</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 text-sm">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-zinc-900/50 transition">
              <td className="py-4 px-4 font-medium text-zinc-100">{booking.client_name}</td>
              <td className="py-4 px-4 text-zinc-400">
                <a
                  href={`https://wa.me/${booking.client_phone?.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {booking.client_phone || "N/A"}
                </a>
              </td>
              <td className="py-4 px-4 text-zinc-300">
                {new Date(booking.booking_time).toLocaleString()}
              </td>
              <td className="py-4 px-4">
                <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                  booking.status === 'confirmed' 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : booking.status === 'cancelled'
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-zinc-500/10 text-zinc-400'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="py-4 px-4 text-right space-x-2">
                <button
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  disabled={loadingId === booking.id || booking.status === "confirmed"}
                  className="px-3 py-1 rounded bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-medium transition disabled:opacity-40"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(booking.id, "cancelled")}
                  disabled={loadingId === booking.id || booking.status === "cancelled"}
                  className="px-3 py-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/30 text-xs font-medium transition disabled:opacity-40"
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}