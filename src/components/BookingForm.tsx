'use client';

import { useState } from 'react';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';

export interface Service {
  id: string;
  merchant_id: string;
  title: string;
  price_zar: number;
  duration_mins: number;
}

interface BookingFormProps {
  merchantId: string;
  whatsappNumber: string;
  services: Service[];
}

export default function BookingForm({
  merchantId,
  whatsappNumber,
  services,
}: BookingFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('09:00');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Modal & redirect state
  const [showModal, setShowModal] = useState<boolean>(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedService = services.find((s) => s.id === selectedServiceId);
    if (!selectedService) return;

    const bookingTime = new Date(`${bookingDate}T${timeSlot}:00`).toISOString();

    // 1. Insert into Supabase
    const { error } = await supabase.from('bookings').insert([
      {
        merchant_id: merchantId,
        client_name: clientName,
        client_phone: clientPhone,
        booking_time: bookingTime,
        status: 'pending',
      },
    ]);

    if (error) {
      console.error('Error inserting booking:', error.message);
      setLoading(false);
      return;
    }

    // 2. Generate WhatsApp link
    const url = generateWhatsAppLink({
      phone: whatsappNumber,
      serviceTitle: selectedService.title,
      priceZar: selectedService.price_zar,
      date: bookingDate,
      time: timeSlot,
      clientName: clientName,
    });

    setWhatsappUrl(url);
    setLoading(false);
    setShowModal(true);

    // 3. Auto-redirect after 2 seconds
    setTimeout(() => {
      window.location.href = url;
    }, 2000);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Select Service
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Select a service...</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title} - R{service.price_zar} ({service.duration_mins} mins)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Time Slot
            </label>
            <input
              type="time"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            placeholder="John Doe"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            WhatsApp Phone Number
          </label>
          <input
            type="tel"
            placeholder="0821234567"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            required
            className="w-full p-2.5 rounded-lg border dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading || showModal}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Book via WhatsApp'}
        </button>
      </form>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-gray-800 border dark:border-gray-700">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Booking Saved!
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Your request is logged. Redirecting you to WhatsApp to notify the merchant...
            </p>
            <div className="mt-6">
              <a
                href={whatsappUrl}
                className="inline-block w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-green-700"
              >
                Open WhatsApp Now
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}