import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rjgzvsuhjxpppvjzzrpq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

/**
 * Supabase client for client-side usage
 * Uses the anon public key for RLS (Row Level Security) policies
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Supabase admin client for server-side operations
 * Note: This should only be used in API routes with proper authentication
 */
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseAnonKey, // In production, use service role key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Database types for type safety
 */
export interface Database {
  public: {
    Tables: Record<string, {
      Row: Record<string, unknown>
      Insert: Record<string, unknown>
      Update: Record<string, unknown>
    }>
    Views: Record<string, Record<string, unknown>>
    Functions: Record<string, Record<string, unknown>>
    Enums: Record<string, Record<string, unknown>>
  }
}
