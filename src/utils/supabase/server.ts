import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
}

type CookieStore = ReturnType<typeof cookies>;
type WritableCookieStore = {
  set?: (name: string, value: string, options?: CookieOptions) => void;
};

type ExtendedCookieStore = CookieStore & WritableCookieStore;

export const createClient = (cookieStore: CookieStore) =>
  createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          const writableStore = cookieStore as ExtendedCookieStore;
          cookiesToSet.forEach(({ name, value, options }) => {
            writableStore.set?.(name, value, options);
          });
        } catch {
          // Ignore write attempts during render of Server Components
        }
      },
    },
  });
