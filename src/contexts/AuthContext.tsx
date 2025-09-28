'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role?: 'user' | 'admin';
  created_at: string;
};

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
  const supabase = createClient();

  // Check if current user is admin (works even if profile not loaded)
  const checkIsAdmin = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return data?.role === 'admin';
    } catch (error) {
      console.error('Unexpected error checking admin status:', error);
      return false;
    }
  }, [user, supabase]);

  const isAdmin = profile?.role === 'admin' || false; // Fallback to false if profile not loaded

  const fetchUserProfile = useCallback(async (userId: string) => {
    console.log('Fetching profile for user ID:', userId);

  const createUserProfile = async (userId: string) => {
      try {
        console.log('Creating profile for user:', userId);

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Profile creation timeout')), 5000);
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

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timeout')), 10000);
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      console.log('Profile fetch result:', { data: !!data, error: !!error });

      if (error) {
        console.log('Error in profile fetch:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
          fullError: error
        });

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
  }, [fetchUserProfile, supabase.auth]);

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
