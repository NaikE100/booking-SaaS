// src/app/book/[slug]/page.tsx
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch tenant info by slug
  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !tenant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-1">Book with {tenant.business_name}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Select an available date and time for your appointment.
        </p>

        <BookingForm tenantId={tenant.id} />
      </div>
    </main>
  );
}