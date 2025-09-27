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

-- 3. TORNAR O ÚLTIMO USUÁRIO REGISTRADO COMO ADMIN
-- (presumindo que seja você testando)
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE id = (
    SELECT au.id 
    FROM auth.users au 
    ORDER BY au.created_at DESC 
    LIMIT 1
);

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

-- ALTERNATIVA: Se quiser tornar um usuário específico admin,
-- descomente e ajuste o email abaixo:
/*
UPDATE profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'seu-email@exemplo.com';
*/
