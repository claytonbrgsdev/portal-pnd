-- Script para configurar usuário como administrador
-- IMPORTANTE: Execute este script no SQL Editor do Supabase Dashboard

-- 1. Primeiro, vamos ver todos os usuários registrados
SELECT 'Usuários registrados:' as info;
SELECT 
    au.id, 
    au.email, 
    au.created_at,
    CASE 
        WHEN p.id IS NOT NULL THEN 'Tem perfil'
        ELSE 'SEM perfil'
    END as status_perfil,
    p.role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 2. Criar perfil para usuários que não têm (caso o trigger tenha falhado)
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'name', au.email),
    'user',
    au.created_at,
    NOW()
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- 3. TORNAR O USUÁRIO admin@admin.com COMO ADMINISTRADOR
-- Primeiro, garantir que o perfil existe para este usuário específico
INSERT INTO profiles (id, email, name, role, created_at, updated_at)
VALUES (
    '0653420c-1517-4ddc-8ae2-5eade4cc3ec6',
    'admin@admin.com',
    'Administrador',
    'admin',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    name = 'Administrador',
    updated_at = NOW();

-- Confirmar que o usuário existe na tabela auth.users
SELECT 'Verificando usuário admin@admin.com:' as info;
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at,
    CASE WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmado' ELSE '❌ Email não confirmado' END as status_email
FROM auth.users 
WHERE email = 'admin@admin.com' OR id = '0653420c-1517-4ddc-8ae2-5eade4cc3ec6';

-- 4. Verificar o resultado
SELECT 'Resultado final:' as info;
SELECT 
    au.id, 
    au.email, 
    p.role,
    p.name,
    CASE 
        WHEN p.role = 'admin' THEN '👑 ADMINISTRADOR'
        ELSE '👤 Usuário'
    END as tipo_usuario
FROM auth.users au
JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;

-- 5. Mostrar políticas RLS ativas
SELECT 'Políticas RLS ativas:' as info;
SELECT policyname, cmd, permissive 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 6. Verificação específica do usuário admin
SELECT '👑 Status do Administrador:' as info;
SELECT 
    au.id,
    au.email,
    p.name,
    p.role,
    p.created_at as profile_created,
    CASE 
        WHEN p.role = 'admin' THEN '👑 ADMINISTRADOR CONFIGURADO'
        ELSE '❌ NÃO É ADMIN'
    END as status_final
FROM auth.users au
JOIN profiles p ON au.id = p.id
WHERE au.email = 'admin@admin.com';

-- ALTERNATIVA: Para tornar outros usuários admin no futuro,
-- descomente e ajuste o email abaixo:
/*
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'outro-email@exemplo.com';
*/
