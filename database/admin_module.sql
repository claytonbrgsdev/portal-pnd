-- Admin Module Database Schema
-- Execute this file in your Supabase SQL editor

-- Ensure profiles table exists (if not already created)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) PRIMARY KEY,
    email text,
    full_name text,
    role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create admin_actions table
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    admin_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    target_user_id uuid,
    payload jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON public.admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON public.admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON public.admin_actions(created_at);

-- Enable RLS on admin_actions
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_actions
-- Only admins can perform all operations on admin_actions
DROP POLICY IF EXISTS "Admins manage actions" ON public.admin_actions;
CREATE POLICY "Admins manage actions" ON public.admin_actions
    FOR ALL TO authenticated
    USING ((auth.jwt() ->> 'user_role') = 'admin')
    WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');

-- RLS Policies for profiles
-- Users can view/edit their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT TO authenticated
    USING ((auth.jwt() ->> 'user_role') = 'admin');

-- Enable RLS on profiles if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'full_name',
        COALESCE((new.raw_user_meta_data ->> 'user_role')::text, 'user')
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Instructions for setting user roles:
-- To promote a user to admin, run this SQL in Supabase SQL editor:
UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"user_role": "admin"}' WHERE id = 'bb6615e5-7641-4764-8b47-895605931896';
--
-- To demote an admin back to regular user:
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'user_role' WHERE id = 'user-id-here';
--
-- Or use Supabase Admin API with service_role key to update user metadata
--
-- DEVELOPMENT ONLY: Quick update for your current user (replace with your email)
-- UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"user_role": "admin"}' WHERE email = 'claytonborgesdev@gmail.com';
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'claytonborgesdev@gmail.com';

-- Migration: Add role column to existing profiles table
-- Run this if you have existing profiles without the role column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update existing profiles to sync with JWT metadata
-- This ensures existing admin users get the admin role in the profiles table
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users
    WHERE raw_user_meta_data ->> 'user_role' = 'admin'
);

-- Specific update for current user (adjust the email as needed)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'claytonborgesdev@gmail.com';

-- Function to get all public tables
CREATE OR REPLACE FUNCTION get_public_tables()
RETURNS TABLE(table_name text, table_schema text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    t.table_name::text,
    t.table_schema::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
$$;

-- Simulation (Simulado) tables
-- Ensure required extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.simulado_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  total_questions int NOT NULL DEFAULT 0,
  correct_answers int NOT NULL DEFAULT 0,
  score numeric(5,2) GENERATED ALWAYS AS (
    CASE WHEN total_questions > 0 THEN (correct_answers::numeric * 100) / total_questions ELSE 0 END
  ) STORED
);

CREATE TABLE IF NOT EXISTS public.simulado_answers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  attempt_id uuid NOT NULL REFERENCES public.simulado_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL,
  selected_letter text NOT NULL CHECK (selected_letter IN ('A','B','C','D')),
  correct_letter text NOT NULL CHECK (correct_letter IN ('A','B','C','D')),
  is_correct boolean NOT NULL,
  answered_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.simulado_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulado_answers ENABLE ROW LEVEL SECURITY;

-- RLS: users can manage their own attempts and answers
DROP POLICY IF EXISTS "own attempts" ON public.simulado_attempts;
CREATE POLICY "own attempts" ON public.simulado_attempts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "answers via own attempts" ON public.simulado_answers;
CREATE POLICY "answers via own attempts" ON public.simulado_answers
  FOR ALL TO authenticated
  USING (attempt_id IN (SELECT id FROM public.simulado_attempts WHERE user_id = auth.uid()))
  WITH CHECK (attempt_id IN (SELECT id FROM public.simulado_attempts WHERE user_id = auth.uid()));

-- Function to get table columns
CREATE OR REPLACE FUNCTION get_table_columns(table_name_param text)
RETURNS TABLE(column_name text, data_type text, is_nullable text, column_default text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_name = table_name_param
    AND c.table_schema = 'public'
  ORDER BY c.ordinal_position;
$$;

-- Function to execute custom SQL queries (admin only)
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Execute the SQL query and return results as JSON
  EXECUTE sql_query INTO result;
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    -- Return error information as JSON
    RETURN jsonb_build_object(
      'error', SQLERRM,
      'sqlstate', SQLSTATE,
      'query', sql_query
    );
END;
$$;
