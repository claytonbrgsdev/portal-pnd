-- Manual table creation script with enhanced error handling
-- Run this if automated creation fails

-- First, test the connection
SELECT 'Connection test successful' as status, current_user, current_database(), now();

-- Create tables with IF NOT EXISTS to avoid conflicts
BEGIN;

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    featured_image VARCHAR(500),
    published BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Duvidas table (without foreign key constraints initially)
CREATE TABLE IF NOT EXISTS duvidas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    subject VARCHAR(255) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    is_public BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    answered_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    answered_at TIMESTAMP
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    payment_method VARCHAR(100),
    amount_paid DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;

-- Verify tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('blog_posts', 'duvidas', 'user_subscriptions', 'notifications')
ORDER BY table_name;

-- Insert some sample data
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published) VALUES
('Edital da PND 2025: Principais Pontos', 'edital-pnd-2025-principais-pontos', 'Resumo completo do edital da Prova Nacional Docente 2025', 'Conteúdo completo do artigo sobre o edital da PND 2025...', 'Equipe Portal PND', 'Notícias PND', true),
('10 Dicas para Estudar para a PND', '10-dicas-estudar-pnd', 'Estratégias eficazes para sua preparação na PND', 'Conteúdo com dicas práticas de estudo...', 'Prof. Maria Silva', 'Dicas de Estudo', true)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Setup completed successfully' as final_status;
