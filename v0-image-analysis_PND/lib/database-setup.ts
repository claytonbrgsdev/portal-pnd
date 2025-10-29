"use server"

import { createSqlConnection, isDatabaseAvailable } from "./database-connection"

// Function to create all required tables
export async function createAllTables() {
  try {
    if (!isDatabaseAvailable()) {
      return {
        success: false,
        error: "Database not configured. Please set up your database connection first.",
        mockMode: true,
      }
    }

    console.log("🏗️ Creating database tables...")
    const sql = createSqlConnection()

    if (!sql) {
      return {
        success: false,
        error: "Cannot connect to database",
        mockMode: true,
      }
    }

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create simulados table
    await sql`
      CREATE TABLE IF NOT EXISTS simulados (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        total_questions INTEGER NOT NULL,
        duration_minutes INTEGER NOT NULL,
        difficulty_level VARCHAR(50) DEFAULT 'Médio',
        subject_area VARCHAR(100) NOT NULL,
        is_premium BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create questions table
    await sql`
      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        simulado_id INTEGER REFERENCES simulados(id) ON DELETE CASCADE,
        question_order INTEGER NOT NULL,
        question_text TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        option_e TEXT,
        correct_answer CHAR(1) NOT NULL,
        explanation TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create simulado_attempts table
    await sql`
      CREATE TABLE IF NOT EXISTS simulado_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        simulado_id INTEGER REFERENCES simulados(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        correct_answers INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        time_spent_minutes INTEGER,
        answers_json JSONB,
        completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create blog_posts table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT[],
        featured_image VARCHAR(500),
        published BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create duvidas table
    await sql`
      CREATE TABLE IF NOT EXISTS duvidas (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pendente',
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create respostas table
    await sql`
      CREATE TABLE IF NOT EXISTS respostas (
        id SERIAL PRIMARY KEY,
        duvida_id INTEGER REFERENCES duvidas(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        is_expert BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create indexes for better performance
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_simulado_attempts_user_id ON simulado_attempts(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_simulado_attempts_simulado_id ON simulado_attempts(simulado_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_questions_simulado_id ON questions(simulado_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)`
    await sql`CREATE INDEX IF NOT EXISTS idx_duvidas_user_id ON duvidas(user_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_respostas_duvida_id ON respostas(duvida_id)`

    console.log("✅ All tables created successfully!")
    return { success: true, message: "Tables created successfully", mockMode: false }
  } catch (error) {
    console.error("❌ Error creating tables:", error)
    return { success: false, error: error.message, mockMode: false }
  }
}

// Function to seed initial data
export async function seedInitialData() {
  try {
    if (!isDatabaseAvailable()) {
      return {
        success: false,
        error: "Database not configured",
        mockMode: true,
      }
    }

    console.log("🌱 Seeding initial data...")
    const sql = createSqlConnection()

    if (!sql) {
      return {
        success: false,
        error: "Cannot connect to database",
        mockMode: true,
      }
    }

    // Check if data already exists
    const existingSimulados = await sql`SELECT COUNT(*) as count FROM simulados`
    if (Number(existingSimulados[0].count) > 0) {
      console.log("📊 Data already exists, skipping seed")
      return { success: true, message: "Data already exists", mockMode: false }
    }

    // Insert sample simulados
    await sql`
      INSERT INTO simulados (title, description, total_questions, duration_minutes, difficulty_level, subject_area, is_premium) VALUES
      ('Simulado Geral PND #1', 'Simulado completo com questões de Formação Geral e Conhecimentos Específicos', 80, 180, 'Médio', 'Geral', false),
      ('Simulado Formação Geral Docente', 'Foco em fundamentos pedagógicos, didática e legislação educacional', 30, 90, 'Fácil', 'Formação Geral', false),
      ('Simulado Matemática - Específico', 'Questões específicas para licenciatura em Matemática', 50, 120, 'Difícil', 'Matemática', true),
      ('Simulado Língua Portuguesa', 'Conteúdos específicos de Língua Portuguesa e Literatura', 50, 120, 'Médio', 'Português', false),
      ('Simulado Premium - História', 'Simulado exclusivo para licenciatura em História', 50, 120, 'Difícil', 'História', true)
    `

    // Insert sample questions for the first simulado
    await sql`
      INSERT INTO questions (simulado_id, question_order, question_text, option_a, option_b, option_c, option_d, option_e, correct_answer, explanation) VALUES
      (1, 1, 'Segundo a Lei de Diretrizes e Bases da Educação Nacional (LDB 9394/96), qual é a finalidade da educação básica?', 'Preparar exclusivamente para o ensino superior', 'Desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores', 'Formar mão de obra qualificada para o mercado de trabalho', 'Transmitir conhecimentos técnicos específicos', 'Preparar para concursos públicos', 'b', 'A LDB estabelece que a educação básica tem por finalidade desenvolver o educando, assegurar-lhe a formação comum indispensável para o exercício da cidadania e fornecer-lhe meios para progredir no trabalho e em estudos posteriores.'),
      (1, 2, 'Na perspectiva da pedagogia histórico-crítica, o papel do professor é:', 'Ser um facilitador neutro do processo de aprendizagem', 'Mediar a relação entre o conhecimento científico e o conhecimento espontâneo do aluno', 'Transmitir conteúdos de forma expositiva', 'Deixar que o aluno construa seu próprio conhecimento sem interferência', 'Focar apenas no desenvolvimento emocional do aluno', 'b', 'Na pedagogia histórico-crítica, o professor atua como mediador entre o conhecimento científico (elaborado) e o conhecimento espontâneo (cotidiano) do aluno, promovendo a apropriação crítica do saber.'),
      (1, 3, 'A Base Nacional Comum Curricular (BNCC) organiza as aprendizagens essenciais em:', 'Disciplinas tradicionais', 'Competências e habilidades', 'Conteúdos programáticos', 'Objetivos comportamentais', 'Temas transversais', 'b', 'A BNCC está estruturada em competências gerais e específicas, que se desdobram em habilidades que devem ser desenvolvidas pelos estudantes ao longo da educação básica.')
    `

    // Insert sample blog posts
    await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, author, category, tags, featured_image, published) VALUES
      ('Como se preparar para a PND 2025', 'como-se-preparar-pnd-2025', 'Dicas essenciais para uma preparação eficiente para a Prova Nacional Docente', 'A Prova Nacional Docente representa uma oportunidade única para professores ingressarem na carreira pública...', 'Equipe Portal PND', 'Preparação', ARRAY['PND', 'Preparação', 'Concurso'], '/placeholder.svg?height=400&width=600', true),
      ('Cronograma oficial da PND 2025', 'cronograma-pnd-2025', 'Todas as datas importantes da Prova Nacional Docente', 'Confira o cronograma completo da PND 2025 com todas as datas que você precisa saber...', 'Equipe Portal PND', 'Notícias', ARRAY['PND', 'Cronograma', 'Datas'], '/placeholder.svg?height=400&width=600', true),
      ('Estrutura da prova PND: o que esperar', 'estrutura-prova-pnd', 'Entenda como será organizada a Prova Nacional Docente', 'A PND será composta por questões de formação geral e conhecimentos específicos...', 'Prof. Maria Silva', 'Preparação', ARRAY['PND', 'Estrutura', 'Prova'], '/placeholder.svg?height=400&width=600', true)
    `

    console.log("✅ Initial data seeded successfully!")
    return { success: true, message: "Data seeded successfully", mockMode: false }
  } catch (error) {
    console.error("❌ Error seeding data:", error)
    return { success: false, error: error.message, mockMode: false }
  }
}

// Function to check if tables exist
export async function checkTablesExist() {
  try {
    if (!isDatabaseAvailable()) {
      return {
        success: true,
        existingTables: [],
        missingTables: ["users", "simulados", "questions", "simulado_attempts", "blog_posts", "duvidas", "respostas"],
        allTablesExist: false,
        mockMode: true,
      }
    }

    const sql = createSqlConnection()

    if (!sql) {
      return {
        success: false,
        error: "Cannot connect to database",
        existingTables: [],
        missingTables: [],
        allTablesExist: false,
        mockMode: true,
      }
    }

    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    const tableNames = tables.map((t) => t.table_name)
    const requiredTables = [
      "users",
      "simulados",
      "questions",
      "simulado_attempts",
      "blog_posts",
      "duvidas",
      "respostas",
    ]
    const missingTables = requiredTables.filter((table) => !tableNames.includes(table))

    return {
      success: true,
      existingTables: tableNames,
      missingTables,
      allTablesExist: missingTables.length === 0,
      mockMode: false,
    }
  } catch (error) {
    console.error("❌ Error checking tables:", error)
    return {
      success: false,
      error: error.message,
      existingTables: [],
      missingTables: [],
      allTablesExist: false,
      mockMode: true,
    }
  }
}
