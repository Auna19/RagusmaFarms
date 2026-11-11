import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Checks whether Supabase environment variables are provided
 */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
}

/**
 * Client for browser / public requests (uses publishable/anon key via @supabase/ssr)
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Admin client for secure backend API routes (uses service role key, falling back to publishable key)
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) return null;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

