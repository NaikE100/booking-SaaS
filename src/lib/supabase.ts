import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.trim().replace(/\/$/, '');

// This checks both possible names so it never fails
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabaseAnonKey = rawKey.trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);