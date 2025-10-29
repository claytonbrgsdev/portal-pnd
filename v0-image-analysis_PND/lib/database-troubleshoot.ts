"use server"

import { neon } from "@neondatabase/serverless"

// Comprehensive database troubleshooting utility
export async function comprehensiveDatabaseDiagnostics() {
  const report = {
    timestamp: new Date().toISOString(),
    environmentCheck: {},
    connectionTests: [],
    recommendations: [],
    criticalIssues: [],
    solutions: [],
  }

  // 1. Environment Variables Analysis
  const envVars = [
    "NEON_NEON_DATABASE_URL",
    "DATABASE_URL",
    "POSTGRES_URL",
    "NEON_POSTGRES_URL",
    "NEON_NEON_DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL_NON_POOLING",
  ]

  report.environmentCheck = envVars.reduce((acc, varName) => {
    const value = process.env[varName]
    acc[varName] = {
      exists: !!value,
      preview: value ? `${value.substring(0, 25)}...` : "Not set",
      format: value ? analyzeConnectionStringFormat(value) : "N/A",
      length: value ? value.length : 0,
    }
    return acc
  }, {})

  // 2. Test each available connection string
  for (const varName of envVars) {
    const connectionString = process.env[varName]
    if (connectionString) {
      const testResult = await testDatabaseConnection(connectionString, varName)
      report.connectionTests.push(testResult)
    }
  }

  // 3. Generate recommendations based on findings
  report.recommendations = generateRecommendations(report)
  report.criticalIssues = identifyCriticalIssues(report)
  report.solutions = generateSolutions(report)

  return report
}

function analyzeConnectionStringFormat(connectionString: string) {
  const analysis = {
    protocol: "unknown",
    hasCredentials: false,
    hasHost: false,
    hasDatabase: false,
    hasSSL: false,
    format: "invalid",
  }

  try {
    if (connectionString.startsWith("postgresql://") || connectionString.startsWith("postgres://")) {
      analysis.protocol = connectionString.split("://")[0]
      analysis.hasCredentials = connectionString.includes("@")
      analysis.hasHost = connectionString.includes("@") && connectionString.split("@")[1]?.includes("/")
      analysis.hasDatabase = connectionString.split("/").length > 3
      analysis.hasSSL = connectionString.includes("sslmode=require") || connectionString.includes("ssl=true")
      analysis.format = "valid"
    }
  } catch (error) {
    analysis.format = "parsing_error"
  }

  return analysis
}

async function testDatabaseConnection(connectionString: string, varName: string) {
  const test = {
    variable: varName,
    success: false,
    error: null,
    details: null,
    timing: 0,
  }

  const startTime = Date.now()

  try {
    const sql = neon(connectionString)

    // Test basic connection
    const result = await sql`SELECT 
      current_user as user_name,
      current_database() as database_name,
      version() as pg_version,
      now() as current_time
    `

    test.success = true
    test.details = result[0]
    test.timing = Date.now() - startTime
  } catch (error) {
    test.success = false
    test.error = {
      message: error.message,
      code: error.code || "UNKNOWN",
      name: error.name,
    }
    test.timing = Date.now() - startTime
  }

  return test
}

function generateRecommendations(report: any) {
  const recommendations = []

  // Check if any connection succeeded
  const successfulConnections = report.connectionTests.filter((test) => test.success)

  if (successfulConnections.length === 0) {
    recommendations.push({
      priority: "HIGH",
      type: "NO_WORKING_CONNECTION",
      message: "No database connections are working. This needs immediate attention.",
      action: "Verify your database credentials and connection strings.",
    })
  }

  // Check for missing environment variables
  const hasAnyEnvVar = Object.values(report.environmentCheck).some((env: any) => env.exists)

  if (!hasAnyEnvVar) {
    recommendations.push({
      priority: "CRITICAL",
      type: "NO_ENV_VARS",
      message: "No database environment variables found.",
      action: "Set up your database connection string in environment variables.",
    })
  }

  // Check for malformed connection strings
  Object.entries(report.environmentCheck).forEach(([varName, details]: [string, any]) => {
    if (details.exists && details.format.format === "invalid") {
      recommendations.push({
        priority: "HIGH",
        type: "INVALID_FORMAT",
        message: `${varName} has an invalid connection string format.`,
        action: "Verify the connection string follows PostgreSQL URL format.",
      })
    }
  })

  return recommendations
}

function identifyCriticalIssues(report: any) {
  const issues = []

  // Look for "Tenant or user not found" specifically
  const tenantErrors = report.connectionTests.filter(
    (test) =>
      test.error?.message?.toLowerCase().includes("tenant") ||
      test.error?.message?.toLowerCase().includes("user not found"),
  )

  if (tenantErrors.length > 0) {
    issues.push({
      type: "TENANT_USER_ERROR",
      message: "Tenant or user not found errors detected",
      affectedConnections: tenantErrors.map((t) => t.variable),
      description: "This typically indicates incorrect project ID or database credentials in Neon.",
    })
  }

  // Check for SSL issues
  const sslErrors = report.connectionTests.filter(
    (test) =>
      test.error?.message?.toLowerCase().includes("ssl") || test.error?.message?.toLowerCase().includes("certificate"),
  )

  if (sslErrors.length > 0) {
    issues.push({
      type: "SSL_ERROR",
      message: "SSL/TLS connection issues detected",
      affectedConnections: sslErrors.map((t) => t.variable),
    })
  }

  return issues
}

function generateSolutions(report: any) {
  const solutions = []

  // Solution for tenant/user errors
  const hasTenantError = report.criticalIssues.some((issue) => issue.type === "TENANT_USER_ERROR")

  if (hasTenantError) {
    solutions.push({
      title: "Fix Tenant/User Not Found Error",
      steps: [
        "1. Log into your Neon dashboard (https://console.neon.tech/)",
        "2. Verify your project is active and not suspended",
        "3. Go to your project's Connection Details",
        "4. Copy the connection string exactly as shown",
        "5. Ensure you're using the correct database name and user",
        "6. Check that the project ID in the URL matches your actual project",
      ],
      priority: "HIGH",
    })
  }

  // Solution for missing environment variables
  const hasNoEnvVars = report.recommendations.some((rec) => rec.type === "NO_ENV_VARS")

  if (hasNoEnvVars) {
    solutions.push({
      title: "Set Up Environment Variables",
      steps: [
        "1. Create a .env.local file in your project root",
        "2. Add your database connection string:",
        "   NEON_DATABASE_URL=postgresql://username:password@host/database?sslmode=require",
        "3. Restart your development server",
        "4. Verify the environment variable is loaded",
      ],
      priority: "CRITICAL",
    })
  }

  return solutions
}

// Function to create tables with enhanced error handling and diagnostics
export async function createTablesWithEnhancedDiagnostics() {
  const result = {
    success: false,
    connectionUsed: null,
    tablesCreated: [],
    errors: [],
    diagnostics: null,
  }

  try {
    // First, run diagnostics
    result.diagnostics = await comprehensiveDatabaseDiagnostics()

    // Find a working connection
    const workingConnection = result.diagnostics.connectionTests.find((test) => test.success)

    if (!workingConnection) {
      throw new Error(
        "No working database connection found. Please check your environment variables and connection strings.",
      )
    }

    result.connectionUsed = workingConnection.variable

    // Get the connection string
    const connectionString = process.env[workingConnection.variable]
    const sql = neon(connectionString)

    // Define tables to create
    const tables = [
      {
        name: "blog_posts",
        sql: `
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
          )
        `,
      },
      {
        name: "duvidas",
        sql: `
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
          )
        `,
      },
      {
        name: "user_subscriptions",
        sql: `
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
          )
        `,
      },
      {
        name: "notifications",
        sql: `
          CREATE TABLE IF NOT EXISTS notifications (
              id SERIAL PRIMARY KEY,
              user_id INTEGER,
              title VARCHAR(255) NOT NULL,
              message TEXT NOT NULL,
              type VARCHAR(50) NOT NULL,
              read BOOLEAN DEFAULT FALSE,
              action_url VARCHAR(500),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `,
      },
    ]

    // Create tables one by one
    for (const table of tables) {
      try {
        await sql(table.sql)
        result.tablesCreated.push({
          name: table.name,
          status: "success",
          message: "Table created successfully",
        })
      } catch (error) {
        result.errors.push({
          table: table.name,
          error: error.message,
          sql: table.sql,
        })
      }
    }

    result.success = result.errors.length === 0
  } catch (error) {
    result.errors.push({
      type: "GENERAL_ERROR",
      error: error.message,
    })
  }

  return result
}

// Seed sample data with better error handling
export async function seedSampleDataSafely() {
  const result = {
    success: false,
    connectionUsed: null,
    dataSeeded: [],
    errors: [],
  }

  try {
    // Run diagnostics first
    const diagnostics = await comprehensiveDatabaseDiagnostics()
    const workingConnection = diagnostics.connectionTests.find((test) => test.success)

    if (!workingConnection) {
      throw new Error("No working database connection found")
    }

    result.connectionUsed = workingConnection.variable
    const connectionString = process.env[workingConnection.variable]
    const sql = neon(connectionString)

    // Seed blog posts
    try {
      await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published) VALUES
        ('Edital da PND 2025: Principais Pontos', 'edital-pnd-2025-principais-pontos', 'Resumo completo do edital da Prova Nacional Docente 2025', 'Conteúdo completo do artigo sobre o edital...', 'Equipe Portal PND', 'Notícias PND', true),
        ('10 Dicas para Estudar para a PND', '10-dicas-estudar-pnd', 'Estratégias eficazes para sua preparação', 'Conteúdo com dicas de estudo...', 'Prof. Maria Silva', 'Dicas de Estudo', true),
        ('O Papel Transformador do Professor', 'papel-transformador-professor', 'Reflexão sobre a importância da docência', 'Artigo inspirador sobre a profissão docente...', 'Prof. João Santos', 'Carreira Docente', true)
        ON CONFLICT (slug) DO NOTHING
      `
      result.dataSeeded.push({ type: "blog_posts", status: "success" })
    } catch (error) {
      result.errors.push({ type: "blog_posts", error: error.message })
    }

    // Seed sample duvidas
    try {
      await sql`
        INSERT INTO duvidas (user_id, subject, question, answer, category, status, is_public) VALUES
        (1, 'Como será calculada minha nota da PND?', 'Gostaria de saber como funciona o cálculo da nota final da PND.', 'A nota da PND é calculada considerando as questões objetivas e discursivas, com pesos específicos para cada componente...', 'Edital e Inscrição', 'answered', true),
        (1, 'A PND substitui o concurso público tradicional?', 'A PND vai substituir completamente os concursos para professor?', 'A PND não substitui os concursos, mas serve como uma avaliação padronizada que pode ser utilizada pelos entes federativos...', 'Edital e Inscrição', 'answered', true)
      `
      result.dataSeeded.push({ type: "duvidas", status: "success" })
    } catch (error) {
      result.errors.push({ type: "duvidas", error: error.message })
    }

    result.success = result.errors.length === 0
  } catch (error) {
    result.errors.push({
      type: "GENERAL_ERROR",
      error: error.message,
    })
  }

  return result
}
