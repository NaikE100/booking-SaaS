import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black text-zinc-900 dark:text-zinc-50 p-6">
      <main className="flex flex-col w-full max-w-2xl items-center text-center py-16 px-8 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Booking SaaS Platform
        </h1>
        
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
          Streamline appointments, manage schedules, and scale your client bookings effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/book/demo"
            className="flex h-12 items-center justify-center rounded-full bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 px-6 font-medium transition-transform hover:scale-[1.02]"
          >
            View Demo Booking Page
          </Link>
          
          <Link
            href="/dashboard"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-6 font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Go to Dashboard
          </Link>
        </div>

      </main>
    </div>
  );
}