-- Insert sample simulados
INSERT INTO simulados (title, description, total_questions, duration_minutes, difficulty_level, subject_area, is_premium) VALUES
('Simulado Geral PND #1', 'Simulado completo com questões de Formação Geral e Conhecimentos Específicos', 80, 180, 'Médio', 'Geral', false),
('Simulado Formação Geral Docente', 'Foco em fundamentos pedagógicos, didática e legislação educacional', 30, 90, 'Fácil', 'Formação Geral', false),
('Simulado Matemática - Específico', 'Questões específicas para licenciatura em Matemática', 50, 120, 'Difícil', 'Matemática', true),
('Simulado Língua Portuguesa', 'Conteúdos específicos de Língua Portuguesa e Literatura', 50, 120, 'Médio', 'Português', false),
('Simulado Premium - História', 'Simulado exclusivo para licenciatura em História', 50, 120, 'Difícil', 'História', true);

-- Insert sample questions for the first simulado
INSERT INTO questions (simulado_id, question_order, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES
(1, 1, 'Segundo a Lei de Diretrizes e Bases da Educação Nacional (LDB 9394/96), qual é a finalidade da educação básica?', 'Preparar exclusivamente para o ensino superior', 'Desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores', 'Formar mão de obra qualificada para o mercado de trabalho', 'Transmitir conhecimentos técnicos específicos', 'Preparar para concursos públicos', 'b', 'A LDB estabelece que a educação básica tem por finalidade desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores.'),

(1, 2, 'Na perspectiva da pedagogia histórico-crítica, o papel do professor é:', 'Ser um facilitador neutro do processo de aprendizagem', 'Mediar a relação entre o conhecimento científico e o conhecimento espontâneo do aluno', 'Transmitir conteúdos de forma expositiva', 'Deixar que o aluno construa seu próprio conhecimento sem interferência', 'Focar apenas no desenvolvimento emocional do aluno', 'b', 'Na pedagogia histórico-crítica, o professor atua como mediador entre o conhecimento científico (elaborado) e o conhecimento espontâneo (cotidiano) do aluno, promovendo a apropriação crítica do saber.'),

(1, 3, 'A Base Nacional Comum Curricular (BNCC) organiza as aprendizagens essenciais em:', 'Disciplinas tradicionais', 'Competências e habilidades', 'Conteúdos programáticos', 'Objetivos comportamentais', 'Temas transversais', 'b', 'A BNCC está estruturada em competências gerais e específicas, que se desdobram em habilidades que devem ser desenvolvidas pelos estudantes ao longo da educação básica.');

-- Insert a sample user
INSERT INTO users (email, name, password_hash, is_premium) VALUES
('usuario@exemplo.com', 'Usuário Exemplo', 'senha123', false);

-- Insert sample simulado attempt
INSERT INTO simulado_attempts (user_id, simulado_id, score, correct_answers, total_questions, time_spent_minutes, answers_json, completed, completed_at) VALUES
(1, 1, 75, 60, 80, 165, '{"1": "b", "2": "b", "3": "b"}', true, NOW() - INTERVAL '2 days'),
(1, 2, 82, 25, 30, 85, '{"1": "b", "2": "a", "3": "b"}', true, NOW() - INTERVAL '1 day');
