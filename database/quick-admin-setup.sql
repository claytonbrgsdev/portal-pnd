-- Quick Admin Setup for Development
-- Execute this in Supabase SQL Editor to quickly set up admin access during development

-- 1. Update your user metadata (replace with your email)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"user_role": "admin"}'
WHERE email = 'claytonborgesdev@gmail.com';

-- 2. Update your profile role
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'claytonborgesdev@gmail.com';

-- 3. Verify the setup worked
SELECT
    au.email,
    au.raw_user_meta_data ->> 'user_role' as jwt_role,
    p.role as profile_role,
    CASE
        WHEN (au.raw_user_meta_data ->> 'user_role') = 'admin' OR p.role = 'admin'
        THEN '✅ READY FOR ADMIN ACCESS'
        ELSE '❌ NEEDS FIXING'
    END as status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'claytonborgesdev@gmail.com';
