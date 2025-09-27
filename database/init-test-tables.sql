-- Script para inicializar tabelas de teste no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- Tabela de usuários de teste
CREATE TABLE IF NOT EXISTS test_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de posts de teste
CREATE TABLE IF NOT EXISTS test_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    author_id INTEGER REFERENCES test_users(id),
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias de teste
CREATE TABLE IF NOT EXISTS test_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados de teste
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

-- Verificar se as tabelas foram criadas
SELECT
    schemaname,
    tablename,
    tableowner
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
