-- Script para verificar a conexão com o banco e diagnosticar problemas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela profiles existe
SELECT 'Checking if profiles table exists...' as status;
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
) as profiles_table_exists;

-- 2. Verificar se a tabela auth.users existe
SELECT 'Checking if auth.users table exists...' as status;
SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'auth'
    AND table_name = 'users'
) as auth_users_table_exists;

-- 3. Verificar usuários existentes
SELECT 'Current users in auth.users:' as status;
SELECT
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed' ELSE '❌ Not Confirmed' END as email_status
FROM auth.users
ORDER BY created_at DESC;

-- 4. Verificar perfis existentes
SELECT 'Current profiles:' as status;
SELECT
    id,
    email,
    name,
    role,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- 5. Verificar triggers
SELECT 'Checking triggers...' as status;
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('users', 'profiles')
ORDER BY trigger_name;

-- 6. Verificar RLS policies
SELECT 'Checking RLS policies...' as status;
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 7. Teste de permissão (simulando o que o app faz)
SELECT 'Testing profile access...' as status;
-- Este teste simula o que o AuthContext faz
SELECT
    id,
    email,
    name,
    role
FROM profiles
WHERE id = auth.uid()
LIMIT 1;







