// src/app/dashboard/[slug]/page.tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import BookingTable from "@/components/BookingTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch merchant details
  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (merchantError || !merchant) {
    notFound();
  }

  // 2. Fetch bookings for this merchant
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(`
      *,
      services (
        name,
        price
      )
    `)
    .eq("merchant_id", merchant.id)
    .order("booking_time", { ascending: true });

  return (
    <main className="min-h-screen bg-black text-zinc-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-zinc-800 pb-4 gap-4">
          <div>
            <h1 className="text-3xl font-bold">{merchant.business_name} Dashboard</h1>
            <p className="text-sm text-zinc-400">Manage client appointments and update booking statuses.</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-zinc-400">
            Slug: {merchant.slug}
          </span>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          
          {bookingsError ? (
            <p className="text-red-500 text-sm">Failed to load appointments.</p>
          ) : (
            <BookingTable initialBookings={bookings || []} />
          )}
        </section>
      </div>
    </main>
  );
}