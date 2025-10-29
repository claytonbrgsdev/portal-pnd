"use server"

import { neon } from "@neondatabase/serverless"

// Debug function to test database connection and diagnose issues
export async function debugDatabaseConnection() {
  const diagnostics = {
    environmentVariables: {},
    connectionTest: null,
    userInfo: null,
    databaseInfo: null,
    error: null,
  }

  try {
    // Check environment variables
    diagnostics.environmentVariables = {
      NEON_NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? "✓ Set" : "✗ Missing",
      DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
      POSTGRES_URL: process.env.POSTGRES_URL ? "✓ Set" : "✗ Missing",
      // Mask the actual values for security
      NEON_DATABASE_URL_preview: process.env.NEON_DATABASE_URL
        ? process.env.NEON_DATABASE_URL.substring(0, 20) + "..."
        : "Not set",
      DATABASE_URL_preview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + "..." : "Not set",
    }

    // Try different connection strings
    let sql
    let connectionString = ""

    if (process.env.NEON_DATABASE_URL) {
      sql = neon(process.env.NEON_DATABASE_URL)
      connectionString = "NEON_DATABASE_URL"
    } else if (process.env.DATABASE_URL) {
      sql = neon(process.env.DATABASE_URL)
      connectionString = "DATABASE_URL"
    } else if (process.env.POSTGRES_URL) {
      sql = neon(process.env.POSTGRES_URL)
      connectionString = "POSTGRES_URL"
    } else {
      throw new Error("No database connection string found")
    }

    // Test basic connection
    const connectionResult = await sql`SELECT 1 as test`
    diagnostics.connectionTest = {
      status: "✓ Success",
      usedVariable: connectionString,
      result: connectionResult[0],
    }

    // Get current user info
    const userResult = await sql`SELECT current_user, current_database(), version()`
    diagnostics.userInfo = {
      currentUser: userResult[0].current_user,
      currentDatabase: userResult[0].current_database,
      version: userResult[0].version.split(" ")[0] + " " + userResult[0].version.split(" ")[1],
    }

    // Get database info
    const dbInfo = await sql`
      SELECT 
        schemaname, 
        tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `
    diagnostics.databaseInfo = {
      existingTables: dbInfo.map((t) => t.tablename),
      tableCount: dbInfo.length,
    }
  } catch (error) {
    diagnostics.error = {
      message: error.message,
      name: error.name,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    }
  }

  return diagnostics
}

// Function to test specific connection strings
export async function testConnectionString(connectionString: string) {
  try {
    const sql = neon(connectionString)
    const result = await sql`SELECT current_user, current_database(), now() as timestamp`
    return {
      success: true,
      data: result[0],
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Function to create tables with better error handling
export async function createTablesWithDiagnostics() {
  try {
    // Use the correct environment variable
    const connectionString = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!connectionString) {
      throw new Error("No database connection string found in environment variables")
    }

    const sql = neon(connectionString)

    // Create tables one by one with individual error handling
    const tables = [
      {
        name: "users",
        sql: `
          CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              name VARCHAR(255) NOT NULL,
              password_hash VARCHAR(255) NOT NULL,
              is_premium BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `,
      },
      {
        name: "simulados",
        sql: `
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
        `,
      },
      {
        name: "questions",
        sql: `
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
        `,
      },
      {
        name: "simulado_attempts",
        sql: `
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
        `,
      },
    ]

    const results = []

    for (const table of tables) {
      try {
        await sql(table.sql)
        results.push({ table: table.name, status: "✓ Created/Verified" })
      } catch (error) {
        results.push({
          table: table.name,
          status: "✗ Failed",
          error: error.message,
        })
      }
    }

    return {
      success: true,
      results,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    }
  }
}
