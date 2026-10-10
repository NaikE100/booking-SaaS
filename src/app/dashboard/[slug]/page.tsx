import { supabase } from '@/lib/supabase';
import DashboardClient from './DashboardClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: merchant } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!merchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Merchant Not Found
        </h1>
      </div>
    );
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('merchant_id', merchant.id)
    .order('booking_time', { ascending: true });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b dark:border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {merchant.business_name} Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage client appointments and update booking statuses.
            </p>
          </div>
        </div>

        <DashboardClient
          merchantId={merchant.id}
          initialBookings={bookings || []}
        />
      </div>
    </main>
  );
}