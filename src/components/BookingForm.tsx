// src/components/BookingForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface Service {
  id: string;
  name: string;
  price: number;
  duration_mins: number;
}

interface BookingFormProps {
  merchantId: string;
  whatsappNumber?: string;
  services: Service[];
}

export default function BookingForm({ merchantId, whatsappNumber, services }: BookingFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("09:00");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combine date and time slot into a valid ISO timestamp
    const bookingDateTime = new Date(`${date}T${timeSlot}:00`).toISOString();

    const { error } = await supabase.from("bookings").insert([
      {
        merchant_id: merchantId,
        service_id: selectedServiceId,
        client_name: name,
        client_email: email || `${phone.replace(/\D/g, "")}@placeholder.com`,
        client_phone: phone,
        booking_time: bookingDateTime,
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error saving booking: " + error.message);
    } else {
      setSuccess(true);

      // Trigger WhatsApp redirect using your robust utility
      if (whatsappNumber) {
        const selectedService = services.find((s) => s.id === selectedServiceId);
        
        const whatsappUrl = generateWhatsAppLink({
          phone: whatsappNumber,
          serviceTitle: selectedService?.name || "General Service",
          priceZar: selectedService?.price || 0,
          date,
          time: timeSlot,
          clientName: name,
        });

        window.open(whatsappUrl, "_blank");
      }
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold text-emerald-500 mb-2">Booking Confirmed!</h2>
        <p className="text-sm text-zinc-400">
          Your appointment has been saved and WhatsApp has been opened to send your confirmation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
          Select Service
        </label>
        <select
          value={selectedServiceId}
          onChange={(e) => setSelectedServiceId(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          required
        >
          <option value="" disabled>Select a service...</option>
          {services.map((service) => (
            <option key={service.id} value={service.id} className="bg-zinc-900">
              {service.name} — R{service.price} ({service.duration_mins} mins)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Date
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
            Time Slot
          </label>
          <input
            type="time"
            required
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
          Your Name
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
          WhatsApp Phone Number
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-600"
          placeholder="0821234567"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3 font-medium text-sm transition disabled:opacity-50"
      >
        {loading ? "Confirming..." : "Book via WhatsApp"}
      </button>
    </form>
  );
}