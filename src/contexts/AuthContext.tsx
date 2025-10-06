'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

type UserProfile = any;

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  // Check if current user is admin (works even if profile not loaded)
  const checkIsAdmin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // First check profile table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profileError && (profileData as any)?.role === 'admin') {
        return true;
      }

      // Fallback to JWT metadata
      return user.user_metadata?.user_role === 'admin';
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  }, [user, supabase]);

  const isAdmin = profile?.role === 'admin' || user?.user_metadata?.user_role === 'admin' || false;

  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log('Fetching profile for user ID:', userId);

  const createUserProfile = async (userId: string) => {
      try {
        console.log('Creating profile for user:', userId);

        // Add timeout to prevent hanging (resolve instead of throwing)
        const timeoutPromise = new Promise<void>((resolve) => {
          setTimeout(() => resolve(), 5000);
        });

        const createPromise = async () => {
          // Get user info from auth
          const { data: authUser, error: authError } = await supabase.auth.getUser();
          if (authError) {
            console.error('Error getting auth user:', authError);
            return;
          }
          if (!authUser.user) {
            console.error('No auth user found');
            return;
          }

          console.log('Auth user found:', authUser.user.email);

          const { data, error } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                email: authUser.user.email || '',
                name: authUser.user.user_metadata?.name || '',
                role: 'user',
                created_at: new Date().toISOString(),
              }
            ])
            .select()
            .single();

          if (error) {
            console.error('Error creating profile:', {
              code: error.code,
              message: error.message,
              details: error.details,
              fullError: error
            });
            return;
          }

          if (data) {
            console.log('Profile created successfully:', data);
            setProfile(data);
          }
        };

        await Promise.race([createPromise(), timeoutPromise]);
      } catch (error) {
        console.error('Unexpected error creating profile:', error);
      }
    };

    try {
      console.log('Attempting to fetch profile from database...');

      // Add timeout to prevent hanging (resolve to a result-shaped timeout)
      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      const timeoutPromise: Promise<{ data: null; error: { code: 'TIMEOUT'; message: string; details: null; hint: null } }> = new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve({
          data: null,
          error: { code: 'TIMEOUT', message: 'Profile fetch timeout', details: null, hint: null }
        }), 5000);
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const raced = await Promise.race([fetchPromise, timeoutPromise]);
      if (timeoutId) clearTimeout(timeoutId);
      const { data, error } = raced as { data: unknown; error: { code?: string; message?: string; details?: unknown; hint?: unknown } | null };

      console.log('Profile fetch result:', { data: !!data, error: !!error });

      if (error) {
        console.log('Error in profile fetch:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          fullError: error
        });

        if (error.code === 'TIMEOUT') {
          console.warn('Profile fetch timed out. Skipping for now.');
          return;
        }

        // PGRST116 = table/row not found, which might be expected for new users
        if (error.code === 'PGRST116') {
          console.warn('Profile not found, creating new profile for user:', userId);
          // Try to create profile for this user
          await createUserProfile(userId);
        } else {
          console.error('Error fetching profile - not PGRST116:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            fullError: error
          });
        }
        return;
      }

      if (data) {
        console.log('Profile loaded successfully:', data);
        setProfile(data);
      } else {
        console.log('No profile data returned');
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
    } finally {
      // Ensure loading is always reset
      console.log('Ensuring loading is reset after profile fetch');
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('User found in session:', session.user.email);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          console.log('No user in session');
        }

        // Set loading to false after a short delay to ensure everything is processed
        setTimeout(() => {
          if (isMounted) {
            console.log('Setting loading to false');
            setLoading(false);
          }
        }, 1000);
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);

        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, supabase]);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) {
        return { error };
      }

      // Create profile if user was created
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: name,
              role: 'user',
              created_at: new Date().toISOString(),
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setProfile(null);
      }
      
      return { error };
    } catch (error) {
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
    checkIsAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
