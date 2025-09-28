-- Script para limpar e recriar tabelas de teste com permissões corretas
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Remover tabelas de teste existentes (exceto auth e profiles)
DROP TABLE IF EXISTS test_posts CASCADE;
DROP TABLE IF EXISTS test_categories CASCADE;
DROP TABLE IF EXISTS test_users CASCADE;

-- 2. Verificar tabelas restantes
SELECT 'Tabelas após limpeza:' as status;
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. Recriar tabelas de teste com owner correto
-- Tabela de usuários de teste
CREATE TABLE test_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de posts de teste
CREATE TABLE test_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES test_users(id),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias de teste
CREATE TABLE test_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Inserir dados de teste
INSERT INTO test_users (name, email) VALUES
    ('João Silva', 'joao.silva@teste.com'),
    ('Maria Santos', 'maria.santos@teste.com'),
    ('Pedro Oliveira', 'pedro.oliveira@teste.com'),
    ('Ana Costa', 'ana.costa@teste.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO test_categories (name, description) VALUES
    ('Matemática', 'Conteúdo relacionado à matemática'),
    ('Português', 'Conteúdo relacionado à língua portuguesa'),
    ('História', 'Conteúdo relacionado à história'),
    ('Geografia', 'Conteúdo relacionado à geografia')
ON CONFLICT (name) DO NOTHING;

INSERT INTO test_posts (title, content, author_id, published) VALUES
    ('Introdução à Álgebra', 'Conteúdo sobre operações algébricas básicas', 1, true),
    ('Gramática Portuguesa', 'Regras gramaticais da língua portuguesa', 2, true),
    ('História do Brasil Colonial', 'Período colonial brasileiro', 3, false),
    ('Geografia Física', 'Conceitos básicos de geografia física', 4, true)
ON CONFLICT DO NOTHING;

-- 5. Verificar dados inseridos
SELECT 'Dados inseridos nas tabelas de teste:' as status;
SELECT 'test_users:' as table_name, COUNT(*) as count FROM test_users
UNION ALL
SELECT 'test_categories:', COUNT(*) FROM test_categories
UNION ALL
SELECT 'test_posts:', COUNT(*) FROM test_posts;

-- 6. Verificar owner das tabelas
SELECT 'Owner das tabelas de teste:' as status;
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'test_%'
ORDER BY tablename;

-- 7. Verificar se o usuário autenticado consegue acessar as tabelas
SELECT 'Teste de acesso às tabelas de teste:' as status;

-- Teste 1: Verificar se consegue ver a tabela information_schema.tables
SELECT COUNT(*) as information_schema_tables_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'test_%';

-- Teste 2: Tentar contar registros em cada tabela
SELECT
    'test_users' as table_name,
    COUNT(*) as record_count
FROM test_users
UNION ALL
SELECT
    'test_categories',
    COUNT(*)
FROM test_categories
UNION ALL
SELECT
    'test_posts',
    COUNT(*)
FROM test_posts;

-- 8. Verificar políticas RLS das tabelas de teste
SELECT 'Políticas RLS das tabelas de teste:' as status;
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename LIKE 'test_%'
ORDER BY tablename, policyname;

-- 9. Adicionar políticas RLS básicas para permitir leitura (se necessário)
-- Nota: Para tabelas criadas manualmente, pode ser necessário ajustar RLS

-- 10. Verificação final
SELECT 'Verificação final - todas as tabelas:' as status;
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
