import { supabase } from '@/lib/supabase';
import BookingForm from '@/components/BookingForm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: merchant } = await supabase
    .from('merchants')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!merchant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          Merchant Not Found
        </h1>
      </div>
    );
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('merchant_id', merchant.id);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {merchant.business_name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Select a service and pick a slot to complete your booking.
          </p>
        </div>
        <BookingForm
          merchantId={merchant.id}
          whatsappNumber={merchant.whatsapp_number}
          services={services || []}
        />
      </div>
    </main>
  );
}