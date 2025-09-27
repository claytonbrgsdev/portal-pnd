-- Script para diagnosticar problemas com a tabela profiles
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Verificar se a tabela profiles existe e tem dados
SELECT 'Verificando tabela profiles' as status;
SELECT COUNT(*) as total_profiles FROM profiles;

-- 2. Verificar se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- 3. Listar todas as políticas atuais
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 4. Verificar os triggers
SELECT trigger_name, event_manipulation, event_object_table, action_statement, action_timing
FROM information_schema.triggers
WHERE event_object_table IN ('users', 'profiles')
ORDER BY event_object_table, trigger_name;

-- 5. Verificar se existem usuários sem perfil
SELECT 'Usuários sem perfil' as status;
SELECT au.id, au.email, au.created_at 
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- 6. CORRIGIR: Recriar políticas RLS mais permissivas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;  
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Política para permitir que usuários vejam seu próprio perfil
CREATE POLICY "Enable read access for own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Enable update for own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserção de perfil (necessário para auto-criação)
CREATE POLICY "Enable insert for authenticated users" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Política para admins verem todos os perfis
CREATE POLICY "Enable read for admin users" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 7. Recriar a função de criação automática de perfil (caso tenha problemas)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    'user',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Criar perfis para usuários existentes que não têm perfil
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', ''),
    'user',
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 10. Verificar resultado final
SELECT 'Verificação final' as status;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_users FROM auth.users;

-- 11. Mostrar perfis criados
SELECT id, email, name, role, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;
