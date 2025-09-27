-- Script para corrigir as políticas RLS que estão causando recursão infinita
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Remover todas as políticas RLS existentes para recriá-las
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read for admin users" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- 2. Verificar se RLS está habilitado
SELECT 'Status RLS da tabela profiles:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Desabilitar temporariamente RLS para teste
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Criar políticas mais simples sem recursão
-- Política básica: usuários podem ver seu próprio perfil
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- Política básica: usuários podem atualizar seu próprio perfil
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE 
    USING (auth.uid() = id);

-- Política básica: usuários autenticados podem inserir seu próprio perfil
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Política separada para service role (sem verificação recursiva)
CREATE POLICY "profiles_all_for_service_role" ON profiles
    FOR ALL 
    USING (auth.role() = 'service_role');

-- 5. Testar acesso direto sem RLS primeiro
SELECT 'Teste direto na tabela profiles (sem RLS):' as info;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verificar se o perfil do Clayton existe
SELECT 
    'Perfil do Clayton (sem RLS):' as info,
    p.id,
    p.email,
    p.name,
    p.role,
    CASE 
        WHEN p.role = 'admin' THEN '👑 É ADMIN'
        ELSE '👤 Usuário Normal'
    END as status
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'claytonborgesdev@gmail.com';

-- 6. Verificar todos os perfis
SELECT 'Todos os perfis (sem RLS):' as info;
SELECT 
    p.id,
    p.email,
    p.name,
    p.role,
    p.created_at
FROM profiles p
ORDER BY p.created_at DESC;

-- 7. Reabilitar RLS com políticas simples
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 8. Teste final com RLS habilitado
SELECT 'Status final da tabela:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 9. Listar políticas criadas
SELECT 'Políticas RLS ativas (sem recursão):' as info;
SELECT policyname, cmd, permissive, qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;
