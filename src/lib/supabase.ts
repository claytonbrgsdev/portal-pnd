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
  const bucket = 'questions-images';
  // Path solicitado: questions/<timestamp>-<file.name>
  const safeName = file.name?.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '') || 'image.bin';
  const path = `questions/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: false,
      cacheControl: '3600',
      contentType: file.type || undefined,
    });

  if (uploadError) {
    throw new Error(uploadError.message || 'Falha ao fazer upload da imagem');
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new Error('Não foi possível obter a URL pública da imagem');
  }
  return data.publicUrl;
}
