import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

/**
 * Supabase client for client-side usage
 * Uses the anon public key for RLS (Row Level Security) policies
 * Now with full TypeScript support
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

/**
 * Supabase admin client for server-side operations
 * Note: This should only be used in API routes with proper authentication
 * Now with full TypeScript support
 */
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey, // Use service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Upload a question image to Supabase Storage and return its public URL.
 * Requires a public bucket named `questions-images` configured in Supabase.
 * Note: call this from client-side code only.
 */
export async function uploadQuestionImage(file: File): Promise<string> {
  // Upload via server API to bypass Storage RLS using service role
  const form = new FormData();
  form.append('file', file);
  form.append('bucket', 'questions-images');
  form.append('prefix', 'questions');

  const res = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao fazer upload da imagem');
    } catch (e) {
      throw new Error((e as Error)?.message || 'Falha ao fazer upload da imagem');
    }
  }

  const json = await res.json();
  if (!json?.url) {
    throw new Error('Não foi possível obter a URL pública da imagem');
  }
  return json.url as string;
}
