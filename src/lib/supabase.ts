import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://rjgzvsuhjxpppvjzzrpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ3p2c3VoanhwcHB2anp6cnBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjA5MDksImV4cCI6MjA3NDQ5NjkwOX0.gQqMo4aXC53m3tLgIo4TIxBIOdcVWYSjOtV5JrmqNe8';

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
