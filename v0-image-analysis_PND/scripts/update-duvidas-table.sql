-- Update the duvidas table structure to match the expected schema
-- First, let's check if the table exists and add missing columns

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'title') THEN
        ALTER TABLE duvidas ADD COLUMN title VARCHAR(255);
        -- Copy subject to title if subject exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'subject') THEN
            UPDATE duvidas SET title = subject WHERE title IS NULL;
        END IF;
    END IF;

    -- Add content column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'content') THEN
        ALTER TABLE duvidas ADD COLUMN content TEXT;
        -- Copy question to content if question exists
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'question') THEN
            UPDATE duvidas SET content = question WHERE content IS NULL;
        END IF;
    END IF;

    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'status') THEN
        ALTER TABLE duvidas ADD COLUMN status VARCHAR(50) DEFAULT 'pending';
    END IF;

    -- Add is_public column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'is_public') THEN
        ALTER TABLE duvidas ADD COLUMN is_public BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add views column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'views') THEN
        ALTER TABLE duvidas ADD COLUMN views INTEGER DEFAULT 0;
    END IF;

    -- Add answered_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'answered_at') THEN
        ALTER TABLE duvidas ADD COLUMN answered_at TIMESTAMP;
    END IF;

    -- Add answer column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'duvidas' AND column_name = 'answer') THEN
        ALTER TABLE duvidas ADD COLUMN answer TEXT;
    END IF;

END $$;

-- Insert some sample data if the table is empty
INSERT INTO duvidas (user_id, title, content, category, status, is_public, views, answer, created_at, answered_at)
SELECT 1, 'Qual é a estrutura da PND?', 'Como é organizada a Prova Nacional Docente? Quantas questões tem?', 'Estrutura da Prova', 'answered', true, 1250, 'A PND é composta por questões de conhecimentos gerais, específicos da área e conhecimentos pedagógicos. São 60 questões objetivas no total, sendo 20 de cada área.', NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'
WHERE NOT EXISTS (SELECT 1 FROM duvidas WHERE title = 'Qual é a estrutura da PND?');

INSERT INTO duvidas (user_id, title, content, category, status, is_public, views, answer, created_at, answered_at)
SELECT 1, 'Como funciona a inscrição?', 'Onde e quando posso me inscrever para a PND?', 'Inscrição', 'answered', true, 980, 'As inscrições são feitas online no portal oficial do INEP. O período de inscrição geralmente ocorre entre julho e agosto, com taxa de R$ 85,00.', NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'
WHERE NOT EXISTS (SELECT 1 FROM duvidas WHERE title = 'Como funciona a inscrição?');

INSERT INTO duvidas (user_id, title, content, category, status, is_public, views, answer, created_at, answered_at)
SELECT 1, 'Quais documentos preciso levar no dia da prova?', 'O que devo levar no dia da aplicação da PND?', 'Dia da Prova', 'answered', true, 756, 'É obrigatório levar documento oficial com foto (RG, CNH, passaporte) e o cartão de confirmação de inscrição. Caneta esferográfica azul ou preta também é necessária.', NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'
WHERE NOT EXISTS (SELECT 1 FROM duvidas WHERE title = 'Quais documentos preciso levar no dia da prova?');
