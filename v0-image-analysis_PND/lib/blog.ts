"use server"

import { neon } from "@neondatabase/serverless"

// Mock data - always available
const MOCK_BLOG_POSTS = [
  {
    id: 1,
    title: "Como se preparar para a PND 2025",
    excerpt:
      "Dicas essenciais para uma preparação eficiente para a Prova Nacional Docente. Descubra estratégias de estudo, cronograma ideal e materiais recomendados.",
    content: `
      <h2>Introdução</h2>
      <p>A Prova Nacional Docente (PND) representa uma oportunidade única para professores ingressarem na carreira pública. Com a aplicação prevista para 2025, é fundamental começar a preparação desde já.</p>
      
      <h2>Estratégias de Estudo</h2>
      <ul>
        <li><strong>Organize seu tempo:</strong> Crie um cronograma de estudos realista e consistente.</li>
        <li><strong>Conheça o edital:</strong> Estude detalhadamente todos os tópicos que serão cobrados.</li>
        <li><strong>Pratique com simulados:</strong> Faça simulados regularmente para testar seus conhecimentos.</li>
        <li><strong>Forme grupos de estudo:</strong> Compartilhe conhecimentos e tire dúvidas com outros candidatos.</li>
      </ul>
      
      <h2>Materiais Recomendados</h2>
      <p>Utilize materiais atualizados e específicos para a PND. Nosso portal oferece diversos recursos gratuitos e premium para sua preparação, incluindo:</p>
      <ul>
        <li>Simulados online com correção automática</li>
        <li>Apostilas atualizadas por área de conhecimento</li>
        <li>Videoaulas com professores especialistas</li>
        <li>Fórum de discussão com outros candidatos</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>A preparação adequada é a chave para o sucesso na PND. Dedique-se aos estudos, utilize todas as ferramentas disponíveis e mantenha-se motivado. Lembre-se: sua vocação para ensinar pode transformar vidas!</p>
    `,
    author: "Equipe Portal PND",
    created_at: new Date().toISOString(),
    category: "Preparação",
    tags: ["PND", "Estudo", "Dicas"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 1250,
    read_time: 8,
  },
  {
    id: 2,
    title: "Cronograma oficial da PND 2025",
    excerpt:
      "Confira todas as datas importantes da Prova Nacional Docente e não perca nenhum prazo crucial para sua inscrição e preparação.",
    content: `
      <h2>Datas Importantes da PND 2025</h2>
      <p>O INEP divulgou o cronograma oficial da PND 2025. Confira todas as datas importantes e organize-se para não perder nenhum prazo:</p>
      
      <h3>Inscrições</h3>
      <ul>
        <li><strong>Período de inscrições:</strong> 15 de março a 28 de março de 2025</li>
        <li><strong>Pagamento da taxa:</strong> Até 31 de março de 2025</li>
        <li><strong>Solicitação de isenção:</strong> 1º a 14 de março de 2025</li>
      </ul>
      
      <h3>Aplicação da Prova</h3>
      <ul>
        <li><strong>Data da prova:</strong> 26 de outubro de 2025</li>
        <li><strong>Horário:</strong> 13h30 às 18h30 (horário de Brasília)</li>
        <li><strong>Portões:</strong> Abertura às 12h, fechamento às 13h</li>
      </ul>
      
      <h3>Resultados</h3>
      <ul>
        <li><strong>Gabarito preliminar:</strong> 27 de outubro de 2025</li>
        <li><strong>Resultado final:</strong> 23 de dezembro de 2025</li>
      </ul>
      
      <p><strong>Importante:</strong> Fique atento às atualizações no site oficial do INEP e em nosso portal!</p>
    `,
    author: "Redação Portal PND",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    category: "Notícias",
    tags: ["PND", "Cronograma", "INEP"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 890,
    read_time: 6,
  },
  {
    id: 3,
    title: "Estrutura da Prova Nacional Docente",
    excerpt:
      "Entenda como será organizada a PND, quais disciplinas serão cobradas e como se preparar para cada área de conhecimento.",
    content: `
      <h2>Como será a PND 2025</h2>
      <p>A Prova Nacional Docente será composta por questões objetivas que avaliarão conhecimentos gerais e específicos da área de atuação docente.</p>
      
      <h3>Estrutura da Prova</h3>
      <ul>
        <li><strong>Total de questões:</strong> 120 questões objetivas</li>
        <li><strong>Duração:</strong> 5 horas</li>
        <li><strong>Tipo:</strong> Múltipla escolha (A, B, C, D, E)</li>
      </ul>
      
      <h3>Áreas de Conhecimento</h3>
      <h4>Conhecimentos Gerais (60 questões)</h4>
      <ul>
        <li>Legislação Educacional (15 questões)</li>
        <li>Fundamentos da Educação (15 questões)</li>
        <li>Didática e Metodologia (15 questões)</li>
        <li>Avaliação Educacional (15 questões)</li>
      </ul>
      
      <h4>Conhecimentos Específicos (60 questões)</h4>
      <p>Variam conforme a área de atuação escolhida pelo candidato:</p>
      <ul>
        <li>Educação Infantil</li>
        <li>Anos Iniciais do Ensino Fundamental</li>
        <li>Língua Portuguesa</li>
        <li>Matemática</li>
        <li>Ciências da Natureza</li>
        <li>Ciências Humanas</li>
        <li>E outras áreas específicas</li>
      </ul>
    `,
    author: "Prof. Maria Silva",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    category: "Educação",
    tags: ["PND", "Estrutura", "Disciplinas"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 675,
    read_time: 10,
  },
  {
    id: 4,
    title: "Dicas de estudo para professores iniciantes",
    excerpt: "Estratégias específicas para quem está começando a carreira docente e quer se destacar na PND.",
    content: `
      <h2>Guia para Professores Iniciantes</h2>
      <p>Se você está iniciando na carreira docente, este guia é especialmente para você. A PND pode ser sua porta de entrada para a rede pública de ensino.</p>
      
      <h3>Por onde começar?</h3>
      <ol>
        <li><strong>Conheça o edital:</strong> Leia atentamente todos os tópicos que serão cobrados</li>
        <li><strong>Avalie seus conhecimentos:</strong> Faça um simulado diagnóstico</li>
        <li><strong>Monte um cronograma:</strong> Distribua o conteúdo ao longo do tempo disponível</li>
        <li><strong>Escolha bons materiais:</strong> Invista em fontes confiáveis e atualizadas</li>
      </ol>
      
      <h3>Estratégias de Estudo</h3>
      <ul>
        <li><strong>Técnica Pomodoro:</strong> Estude em blocos de 25 minutos com pausas de 5 minutos</li>
        <li><strong>Mapas mentais:</strong> Organize o conteúdo visualmente</li>
        <li><strong>Resumos:</strong> Faça sínteses dos principais tópicos</li>
        <li><strong>Questões comentadas:</strong> Pratique com exercícios similares à prova</li>
      </ul>
      
      <h3>Cuidados Importantes</h3>
      <ul>
        <li>Mantenha uma rotina de estudos consistente</li>
        <li>Reserve tempo para descanso e lazer</li>
        <li>Cuide da alimentação e do sono</li>
        <li>Busque apoio de outros candidatos e professores</li>
      </ul>
    `,
    author: "Prof. João Santos",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    category: "Carreira",
    tags: ["Iniciantes", "Carreira", "Estudo"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 432,
    read_time: 7,
  },
  {
    id: 5,
    title: "Simulados: a chave para o sucesso na PND",
    excerpt:
      "Por que fazer simulados é fundamental para sua aprovação e como aproveitar ao máximo essa ferramenta de estudo.",
    content: `
      <h2>A Importância dos Simulados</h2>
      <p>Os simulados são uma das ferramentas mais importantes na preparação para concursos. Eles não apenas testam seus conhecimentos, mas também preparam você para o formato e o tempo da prova real.</p>
      
      <h3>Benefícios dos Simulados</h3>
      <ul>
        <li><strong>Familiarização com o formato:</strong> Conhecer o estilo das questões</li>
        <li><strong>Gestão do tempo:</strong> Aprender a distribuir o tempo entre as questões</li>
        <li><strong>Identificação de lacunas:</strong> Descobrir pontos fracos no conhecimento</li>
        <li><strong>Redução da ansiedade:</strong> Diminuir o nervosismo no dia da prova</li>
        <li><strong>Aumento da confiança:</strong> Ganhar segurança através da prática</li>
      </ul>
      
      <h3>Como Usar os Simulados Estrategicamente</h3>
      <ol>
        <li><strong>Simulado diagnóstico:</strong> Faça um no início dos estudos</li>
        <li><strong>Simulados temáticos:</strong> Foque em áreas específicas</li>
        <li><strong>Simulados cronometrados:</strong> Pratique o controle do tempo</li>
        <li><strong>Simulados finais:</strong> Teste completo antes da prova</li>
      </ol>
      
      <h3>Análise dos Resultados</h3>
      <p>Após cada simulado:</p>
      <ul>
        <li>Revise todas as questões, inclusive as que acertou</li>
        <li>Anote os tópicos que precisa estudar mais</li>
        <li>Identifique padrões nos seus erros</li>
        <li>Ajuste seu plano de estudos conforme necessário</li>
      </ul>
      
      <p><strong>Dica importante:</strong> Use nossos simulados gratuitos para praticar regularmente!</p>
    `,
    author: "Equipe Pedagógica",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    category: "Preparação",
    tags: ["Simulados", "Estratégia", "Preparação"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 1100,
    read_time: 9,
  },
  {
    id: 6,
    title: "Legislação educacional na PND",
    excerpt: "Principais leis e diretrizes que você precisa conhecer para a Prova Nacional Docente.",
    content: `
      <h2>Legislação Educacional Essencial</h2>
      <p>A legislação educacional é um dos pilares da PND. Conheça as principais leis, decretos e diretrizes que são cobrados na prova.</p>
      
      <h3>Documentos Fundamentais</h3>
      <ul>
        <li><strong>Constituição Federal de 1988</strong> - Artigos 205 a 214</li>
        <li><strong>Lei de Diretrizes e Bases (LDB)</strong> - Lei nº 9.394/1996</li>
        <li><strong>Estatuto da Criança e do Adolescente (ECA)</strong> - Lei nº 8.069/1990</li>
        <li><strong>Plano Nacional de Educação (PNE)</strong> - Lei nº 13.005/2014</li>
      </ul>
      
      <h3>Diretrizes Curriculares</h3>
      <ul>
        <li>Base Nacional Comum Curricular (BNCC)</li>
        <li>Diretrizes Curriculares Nacionais para a Educação Básica</li>
        <li>Diretrizes para a Educação Infantil</li>
        <li>Diretrizes para o Ensino Fundamental</li>
        <li>Diretrizes para o Ensino Médio</li>
      </ul>
      
      <h3>Temas Importantes</h3>
      <ul>
        <li>Direito à educação</li>
        <li>Princípios da educação nacional</li>
        <li>Organização da educação nacional</li>
        <li>Níveis e modalidades de ensino</li>
        <li>Profissionais da educação</li>
        <li>Recursos financeiros</li>
        <li>Gestão democrática</li>
        <li>Avaliação educacional</li>
      </ul>
      
      <h3>Dicas de Estudo</h3>
      <ul>
        <li>Leia os textos originais das leis</li>
        <li>Faça resumos dos artigos principais</li>
        <li>Pratique com questões comentadas</li>
        <li>Relacione a teoria com a prática educacional</li>
      </ul>
    `,
    author: "Prof. Ana Costa",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    category: "Legislação",
    tags: ["Legislação", "LDB", "Diretrizes"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 567,
    read_time: 12,
  },
]

const MOCK_CATEGORIES = [
  { category: "Preparação", count: 15 },
  { category: "Notícias", count: 12 },
  { category: "Educação", count: 8 },
  { category: "Carreira", count: 6 },
  { category: "Legislação", count: 5 },
  { category: "Dicas", count: 10 },
]

// Helper function to get database connection
function getConnectionString() {
  const possibleVars = [
    "NEON_DATABASE_URL",
    "DATABASE_URL_UNPOOLED",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "NEON_DATABASE_URL",
    "NEON_POSTGRES_URL",
  ]

  for (const varName of possibleVars) {
    const value = process.env[varName]
    if (value && (value.startsWith("postgresql://") || value.startsWith("postgres://"))) {
      console.log(`✅ Using ${varName} for database connection`)
      return value
    }
  }

  return null
}

export async function getBlogPosts() {
  console.log("🎯 Fetching blog posts...")

  try {
    const connectionString = getConnectionString()

    if (!connectionString) {
      console.log("📱 No database connection - returning mock data")
      return MOCK_BLOG_POSTS
    }

    const sql = neon(connectionString)

    const result = await sql`
      SELECT 
        id,
        title,
        excerpt,
        content,
        author,
        created_at,
        category,
        tags,
        featured_image
      FROM blog_posts 
      WHERE published = true
      ORDER BY created_at DESC
    `

    const postsWithDefaults = result.map((post: any) => ({
      ...post,
      views: Math.floor(Math.random() * 1000) + 100,
      read_time: Math.ceil((post.content?.length || 500) / 200),
    }))

    console.log(`✅ Found ${postsWithDefaults.length} blog posts from database`)
    return postsWithDefaults
  } catch (error) {
    console.error("❌ Erro ao buscar posts do blog:", error)
    console.log("🔄 Falling back to mock blog data")
    return MOCK_BLOG_POSTS
  }
}

export async function getBlogPostById(id: number) {
  console.log(`🎯 Fetching blog post with ID: ${id}`)

  try {
    const connectionString = getConnectionString()

    if (!connectionString) {
      console.log("📱 No database connection - returning mock data")
      return MOCK_BLOG_POSTS.find((post) => post.id === id) || null
    }

    const sql = neon(connectionString)

    const result = await sql`
      SELECT 
        id,
        title,
        excerpt,
        content,
        author,
        created_at,
        category,
        tags,
        featured_image
      FROM blog_posts 
      WHERE id = ${id} AND published = true
    `

    if (result.length === 0) {
      return null
    }

    const post = {
      ...result[0],
      views: Math.floor(Math.random() * 1000) + 100,
      read_time: Math.ceil((result[0].content?.length || 500) / 200),
    }

    console.log(`✅ Found blog post: ${post.title}`)
    return post
  } catch (error) {
    console.error("❌ Erro ao buscar post do blog:", error)
    return MOCK_BLOG_POSTS.find((post) => post.id === id) || null
  }
}

export async function getBlogCategories() {
  console.log("🎯 Fetching blog categories...")

  try {
    const connectionString = getConnectionString()

    if (!connectionString) {
      return MOCK_CATEGORIES
    }

    const sql = neon(connectionString)

    const result = await sql`
      SELECT DISTINCT category, COUNT(*) as count
      FROM blog_posts 
      WHERE published = true AND category IS NOT NULL
      GROUP BY category
      ORDER BY count DESC
    `

    console.log(`✅ Found ${result.length} categories from database`)
    return result
  } catch (error) {
    console.error("❌ Erro ao buscar categorias:", error)
    return MOCK_CATEGORIES
  }
}
