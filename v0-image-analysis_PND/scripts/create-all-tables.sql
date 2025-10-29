-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create simulados table
CREATE TABLE IF NOT EXISTS simulados (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50) DEFAULT 'medium',
  duration INTEGER DEFAULT 120,
  total_questions INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  simulado_id INTEGER REFERENCES simulados(id),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  correct_answer CHAR(1) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create simulado_attempts table
CREATE TABLE IF NOT EXISTS simulado_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  simulado_id INTEGER REFERENCES simulados(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  time_taken INTEGER
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  tags TEXT,
  featured_image VARCHAR(500),
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create duvidas table
CREATE TABLE IF NOT EXISTS duvidas (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create respostas table
CREATE TABLE IF NOT EXISTS respostas (
  id SERIAL PRIMARY KEY,
  duvida_id INTEGER REFERENCES duvidas(id),
  user_id INTEGER REFERENCES users(id),
  content TEXT NOT NULL,
  is_expert BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO simulados (title, description, difficulty, duration, total_questions) VALUES
('Simulado PND - Conhecimentos Gerais', 'Teste seus conhecimentos gerais sobre educação e legislação educacional', 'medium', 120, 30),
('Simulado PND - Português', 'Avalie seus conhecimentos em língua portuguesa', 'medium', 90, 25),
('Simulado PND - Matemática', 'Teste seus conhecimentos matemáticos', 'hard', 100, 20),
('Simulado PND - Conhecimentos Pedagógicos', 'Avalie seus conhecimentos em pedagogia e didática', 'medium', 120, 30),
('Simulado PND - Legislação Educacional', 'Teste seus conhecimentos sobre leis e normas educacionais', 'hard', 90, 25)
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO blog_posts (title, excerpt, content, author, category, tags, featured_image, published) VALUES
('Como se preparar para a Prova Nacional Docente', 'Dicas essenciais para uma preparação eficaz', 'A Prova Nacional Docente representa uma oportunidade única para professores ingressarem na carreira pública...', 'Prof. Maria Silva', 'Preparação', 'pnd,preparação,dicas', '/placeholder.svg?height=300&width=600', true),
('Cronograma oficial da PND 2025', 'Todas as datas importantes que você precisa saber', 'O cronograma oficial da Prova Nacional Docente 2025 foi divulgado...', 'Equipe Portal PND', 'Notícias', 'pnd,cronograma,2025', '/placeholder.svg?height=300&width=600', true),
('Estrutura da Prova Nacional Docente', 'Entenda como será organizada a prova', 'A PND será composta por diferentes áreas de conhecimento...', 'Prof. João Santos', 'Estrutura', 'pnd,estrutura,conhecimento', '/placeholder.svg?height=300&width=600', true)
ON CONFLICT DO NOTHING;

-- Insert sample questions for the first simulado
INSERT INTO questions (simulado_id, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES
(1, 'Qual é o principal objetivo da Lei de Diretrizes e Bases da Educação Nacional (LDB)?', 'Estabelecer diretrizes para o ensino superior', 'Regular a educação escolar no Brasil', 'Definir o currículo nacional', 'Criar o sistema de avaliação', 'Organizar a carreira docente', 'B', 'A LDB tem como principal objetivo regular a educação escolar brasileira em todos os níveis e modalidades.'),
(1, 'Segundo a Constituição Federal, a educação é:', 'Direito de todos e dever do Estado', 'Responsabilidade exclusiva da família', 'Obrigação apenas do ensino fundamental', 'Direito apenas das crianças', 'Dever exclusivo dos municípios', 'A', 'A Constituição Federal estabelece que a educação é direito de todos e dever do Estado e da família.')
ON CONFLICT DO NOTHING;

COMMIT;
