-- Complete data seeding for Portal PND
-- This script populates all tables with realistic sample data

-- First, ensure we have a test user
INSERT INTO users (email, name, password_hash, is_premium, created_at) VALUES
('usuario@teste.com', 'João Silva', 'senha123', false, NOW() - INTERVAL '30 days'),
('premium@teste.com', 'Maria Santos', 'senha123', true, NOW() - INTERVAL '60 days')
ON CONFLICT (email) DO NOTHING;

-- Insert comprehensive simulados
INSERT INTO simulados (title, description, total_questions, duration_minutes, difficulty_level, subject_area, is_premium, created_at) VALUES
('Simulado Geral PND 2025 #1', 'Simulado completo com questões de Formação Geral e Conhecimentos Específicos', 80, 300, 'Médio', 'Geral', false, NOW() - INTERVAL '10 days'),
('Simulado Formação Geral Docente', 'Foco em fundamentos pedagógicos, didática e legislação educacional', 30, 90, 'Fácil', 'Formação Geral', false, NOW() - INTERVAL '8 days'),
('Simulado Matemática - Avançado', 'Questões específicas para licenciatura em Matemática - nível avançado', 50, 120, 'Difícil', 'Matemática', true, NOW() - INTERVAL '5 days'),
('Simulado Língua Portuguesa', 'Conteúdos específicos de Língua Portuguesa e Literatura', 50, 120, 'Médio', 'Português', false, NOW() - INTERVAL '3 days'),
('Simulado Premium - História', 'Simulado exclusivo para licenciatura em História', 50, 120, 'Difícil', 'História', true, NOW() - INTERVAL '1 day'),
('Simulado Biologia Básico', 'Questões fundamentais de Biologia para licenciatura', 40, 100, 'Fácil', 'Biologia', false, NOW()),
('Simulado Geografia Completo', 'Aborda todos os temas de Geografia para PND', 45, 110, 'Médio', 'Geografia', false, NOW()),
('Simulado Física - Mecânica', 'Foco em mecânica clássica e moderna', 35, 90, 'Difícil', 'Física', true, NOW())
ON CONFLICT DO NOTHING;

-- Insert sample questions for simulados
INSERT INTO questions (simulado_id, question_order, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES
-- Questions for Simulado 1 (General PND)
(1, 1, 'Segundo a Lei de Diretrizes e Bases da Educação Nacional (LDB 9394/96), qual é a finalidade da educação básica?', 'Preparar exclusivamente para o ensino superior', 'Desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores', 'Formar mão de obra qualificada para o mercado de trabalho', 'Transmitir conhecimentos técnicos específicos', 'Preparar para concursos públicos', 'b', 'A LDB estabelece que a educação básica tem por finalidade desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores.'),

(1, 2, 'Na perspectiva da pedagogia histórico-crítica, o papel do professor é:', 'Ser um facilitador neutro do processo de aprendizagem', 'Mediar a relação entre o conhecimento científico e o conhecimento espontâneo do aluno', 'Transmitir conteúdos de forma expositiva', 'Deixar que o aluno construa seu próprio conhecimento sem interferência', 'Focar apenas no desenvolvimento emocional do aluno', 'b', 'Na pedagogia histórico-crítica, o professor atua como mediador entre o conhecimento científico (elaborado) e o conhecimento espontâneo (cotidiano) do aluno, promovendo a apropriação crítica do saber.'),

(1, 3, 'A Base Nacional Comum Curricular (BNCC) organiza as aprendizagens essenciais em:', 'Disciplinas tradicionais', 'Competências e habilidades', 'Conteúdos programáticos', 'Objetivos comportamentais', 'Temas transversais', 'b', 'A BNCC está estruturada em competências gerais e específicas, que se desdobram em habilidades que devem ser desenvolvidas pelos estudantes ao longo da educação básica.'),

-- Questions for Simulado 2 (Formação Geral)
(2, 1, 'O conceito de "zona de desenvolvimento proximal" foi desenvolvido por:', 'Jean Piaget', 'Lev Vygotsky', 'Paulo Freire', 'Maria Montessori', 'John Dewey', 'b', 'A zona de desenvolvimento proximal é um conceito central na teoria de Vygotsky, referindo-se à distância entre o desenvolvimento real e o desenvolvimento potencial do aluno.'),

(2, 2, 'Segundo Paulo Freire, a educação bancária se caracteriza por:', 'Valorizar o diálogo entre educador e educando', 'Considerar o educando como depositário de conhecimentos', 'Promover a consciência crítica', 'Estimular a criatividade dos alunos', 'Desenvolver a autonomia intelectual', 'b', 'Paulo Freire critica a educação bancária, onde o educador deposita conhecimentos no educando, que os recebe passivamente, sem reflexão crítica.');

-- Insert blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published, views, read_time, created_at) VALUES
('Edital da PND 2025: Principais Pontos', 'edital-pnd-2025-principais-pontos', 'Resumo completo do edital da Prova Nacional Docente 2025 com todas as informações importantes para os candidatos.', 'A Prova Nacional Docente (PND) 2025 representa um marco na educação brasileira. Neste artigo, analisamos detalhadamente o Edital nº 72/2025, destacando os pontos mais relevantes para os futuros docentes...', 'Equipe Portal PND', 'Notícias PND', true, 1250, 8, NOW() - INTERVAL '5 days'),

('10 Dicas Essenciais para Estudar para a PND', '10-dicas-estudar-pnd', 'Estratégias comprovadas para otimizar seus estudos e aumentar suas chances de aprovação na Prova Nacional Docente.', 'Preparar-se para a PND requer estratégia e dedicação. Aqui estão 10 dicas fundamentais que podem fazer a diferença na sua preparação: 1. Organize um cronograma de estudos realista...', 'Prof. Maria Silva', 'Dicas de Estudo', true, 890, 6, NOW() - INTERVAL '3 days'),

('O Papel Transformador do Professor na Sociedade', 'papel-transformador-professor', 'Reflexão sobre a importância da docência e como os professores podem impactar positivamente a sociedade.', 'Ser professor é muito mais do que transmitir conhecimento. É ser um agente de transformação social, capaz de moldar o futuro através da educação...', 'Prof. João Santos', 'Carreira Docente', true, 567, 5, NOW() - INTERVAL '2 days'),

('Como Funciona a Correção da PND: TRI Explicada', 'correcao-pnd-tri-explicada', 'Entenda como funciona a Teoria de Resposta ao Item (TRI) utilizada na correção da Prova Nacional Docente.', 'A PND utiliza a metodologia TRI para correção, similar ao ENEM. Neste artigo, explicamos de forma simples como funciona esse sistema...', 'Dr. Carlos Lima', 'Metodologia', true, 423, 7, NOW() - INTERVAL '1 day'),

('Legislação Educacional: O que Estudar para a PND', 'legislacao-educacional-pnd', 'Guia completo sobre os principais marcos legais da educação brasileira que podem ser cobrados na PND.', 'A legislação educacional é um dos pilares da Formação Geral Docente. Conheça as principais leis e documentos que você deve dominar...', 'Profa. Ana Costa', 'Legislação', true, 678, 9, NOW());

-- Insert duvidas (Q&A)
INSERT INTO duvidas (user_id, subject, question, answer, category, status, is_public, views, answered_by, created_at, answered_at) VALUES
(1, 'Como será calculada minha nota da PND?', 'Gostaria de saber detalhadamente como funciona o cálculo da nota final da PND. É similar ao ENEM?', 'Sim, a PND utiliza a Teoria de Resposta ao Item (TRI), similar ao ENEM. A nota é calculada considerando não apenas o número de acertos, mas também a dificuldade das questões e a coerência das respostas. As questões objetivas e discursivas têm pesos específicos no cálculo final.', 'Edital e Inscrição', 'answered', true, 156, 'Prof. Maria Silva', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),

(1, 'A PND substitui completamente os concursos públicos?', 'Estou confuso sobre o papel da PND. Ela vai substituir todos os concursos para professor ou é apenas complementar?', 'A PND não substitui os concursos públicos tradicionais. Ela serve como uma avaliação padronizada que pode ser utilizada pelos entes federativos (estados, municípios) como critério principal ou complementar em suas seleções. Cada órgão decidirá como usar os resultados da PND.', 'Edital e Inscrição', 'answered', true, 234, 'Dr. João Santos', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

(2, 'Qual a diferença entre Formação Geral e Conhecimentos Específicos?', 'Não entendi bem a divisão da prova. Podem explicar a diferença entre essas duas partes?', 'A Formação Geral Docente (30 questões objetivas + 1 discursiva) aborda fundamentos pedagógicos, didática, legislação educacional e temas transversais à docência. Já os Conhecimentos Específicos (50 questões objetivas) focam no conteúdo da sua área de licenciatura (Matemática, História, etc.).', 'Conteúdo da Prova', 'answered', true, 189, 'Profa. Ana Costa', NOW() - INTERVAL '1 day', NOW()),

(1, 'Posso usar calculadora na prova de Matemática?', 'Vou fazer a prova de Matemática. É permitido usar calculadora ou outros materiais de apoio?', 'Não, calculadoras não são permitidas na PND. A prova é elaborada considerando que os cálculos podem ser feitos mentalmente ou no papel. Apenas materiais básicos como lápis, caneta e borracha são permitidos, além de materiais específicos para candidatos com necessidades especiais.', 'Conhecimentos Específicos', 'answered', true, 98, 'Prof. Carlos Lima', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '2 hours');

-- Insert user subscriptions
INSERT INTO user_subscriptions (user_id, plan_type, status, started_at, expires_at, amount_paid) VALUES
(2, 'premium', 'active', NOW() - INTERVAL '30 days', NOW() + INTERVAL '330 days', 29.90),
(1, 'free', 'active', NOW() - INTERVAL '30 days', NULL, 0.00);

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type, read, action_url, created_at) VALUES
(1, 'Novo simulado disponível!', 'O Simulado Geral PND 2025 #2 já está disponível. Teste seus conhecimentos agora!', 'info', false, '/simulados', NOW() - INTERVAL '2 hours'),
(1, 'Sua dúvida foi respondida', 'A dúvida "Como será calculada minha nota da PND?" foi respondida por um especialista.', 'success', false, '/duvidas', NOW() - INTERVAL '1 day'),
(2, 'Bem-vindo ao Premium!', 'Parabéns! Agora você tem acesso a todos os recursos premium do Portal PND.', 'success', true, '/premium', NOW() - INTERVAL '30 days'),
(1, 'Lembrete: Inscrições PND', 'As inscrições para a PND 2025 terminam em 25/07/2025. Não perca o prazo!', 'warning', false, '/sobre', NOW() - INTERVAL '3 days');

-- Insert simulado attempts (user performance data)
INSERT INTO simulado_attempts (user_id, simulado_id, score, correct_answers, total_questions, time_spent_minutes, answers_json, completed, completed_at) VALUES
(1, 1, 75, 60, 80, 280, '{"1": "b", "2": "b", "3": "b"}', true, NOW() - INTERVAL '5 days'),
(1, 2, 82, 25, 30, 85, '{"1": "b", "2": "a"}', true, NOW() - INTERVAL '3 days'),
(2, 1, 88, 70, 80, 275, '{"1": "b", "2": "b", "3": "b"}', true, NOW() - INTERVAL '2 days'),
(2, 3, 91, 46, 50, 115, '{"1": "a", "2": "b"}', true, NOW() - INTERVAL '1 day'),
(1, 4, 67, 34, 50, 118, '{"1": "c", "2": "b"}', true, NOW() - INTERVAL '6 hours');

-- Verify data insertion
SELECT 'Data seeding completed successfully' as status;
SELECT 'Users: ' || COUNT(*) as users_count FROM users;
SELECT 'Simulados: ' || COUNT(*) as simulados_count FROM simulados;
SELECT 'Questions: ' || COUNT(*) as questions_count FROM questions;
SELECT 'Blog posts: ' || COUNT(*) as blog_posts_count FROM blog_posts;
SELECT 'Duvidas: ' || COUNT(*) as duvidas_count FROM duvidas;
SELECT 'Attempts: ' || COUNT(*) as attempts_count FROM simulado_attempts;
