import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Checks whether Supabase environment variables are provided
 */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
}

/**
 * Client for browser / public requests (uses anon key)
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
}

/**
 * Admin client for secure backend API routes (uses service role key)
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    // Fallback to anon key if service role is not yet supplied
    if (supabaseUrl && supabaseAnonKey) {
      return createClient(supabaseUrl, supabaseAnonKey);
    }
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

