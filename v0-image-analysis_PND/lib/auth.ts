"use server"

import { createSqlConnection, isDatabaseAvailable } from "./database-connection"

// Mock user data for when database is not available
const mockUsers = [
  { id: 1, email: "demo@portalpnd.com", name: "Usuário Demo", is_premium: false, created_at: new Date() },
  { id: 2, email: "premium@portalpnd.com", name: "Usuário Premium", is_premium: true, created_at: new Date() },
]

export async function createUser(email: string, name: string, password: string) {
  try {
    console.log(`🎯 Creating user: ${email}`)

    if (!isDatabaseAvailable()) {
      console.log("⚠️ Database not available, using mock mode")
      // In mock mode, simulate user creation
      const mockUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        email,
        name,
        is_premium: false,
        created_at: new Date(),
      }
      return { success: true, user: mockUser, mockMode: true }
    }

    const sql = createSqlConnection()
    if (!sql) {
      return { success: false, error: "Erro de conexão com banco de dados" }
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return { success: false, error: "Usuário já existe" }
    }

    // Create new user (in production, hash the password!)
    const result = await sql`
      INSERT INTO users (email, name, password_hash, created_at)
      VALUES (${email}, ${name}, ${password}, NOW())
      RETURNING id, email, name, is_premium, created_at
    `

    console.log(`✅ User created successfully: ${email}`)
    return { success: true, user: result[0], mockMode: false }
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    console.log(`🎯 Authenticating user: ${email}`)

    if (!isDatabaseAvailable()) {
      console.log("⚠️ Database not available, using mock mode")
      // In mock mode, allow demo logins
      const mockUser = mockUsers.find((u) => u.email === email)
      if (mockUser && password === "demo123") {
        return { success: true, user: mockUser, mockMode: true }
      }
      return { success: false, error: "Use email: demo@portalpnd.com, senha: demo123" }
    }

    const sql = createSqlConnection()
    if (!sql) {
      return { success: false, error: "Erro de conexão com banco de dados" }
    }

    const result = await sql`
      SELECT id, email, name, is_premium, created_at 
      FROM users 
      WHERE email = ${email} AND password_hash = ${password}
    `

    if (result.length === 0) {
      return { success: false, error: "Email ou senha incorretos" }
    }

    console.log(`✅ User authenticated successfully: ${email}`)
    return { success: true, user: result[0], mockMode: false }
  } catch (error) {
    console.error("❌ Erro ao autenticar usuário:", error)
    return { success: false, error: "Erro interno do servidor" }
  }
}

export async function getUserStats(userId: number) {
  try {
    console.log(`🎯 Getting user stats for ID: ${userId}`)

    if (!isDatabaseAvailable()) {
      console.log("⚠️ Database not available, returning mock stats")
      return {
        simuladosCompletos: 8,
        mediaNotas: 78,
        ranking: 142,
        mockMode: true,
      }
    }

    const sql = createSqlConnection()
    if (!sql) {
      return {
        simuladosCompletos: 0,
        mediaNotas: 0,
        ranking: 0,
        mockMode: true,
      }
    }

    const simuladosCompletos = await sql`
      SELECT COUNT(*) as count FROM simulado_attempts 
      WHERE user_id = ${userId} AND completed = true
    `

    const mediaNotas = await sql`
      SELECT AVG(score) as average FROM simulado_attempts 
      WHERE user_id = ${userId} AND completed = true
    `

    const ranking = await sql`
      SELECT COUNT(*) + 1 as position FROM (
        SELECT user_id, AVG(score) as avg_score 
        FROM simulado_attempts 
        WHERE completed = true 
        GROUP BY user_id
      ) rankings
      WHERE avg_score > (
        SELECT AVG(score) FROM simulado_attempts 
        WHERE user_id = ${userId} AND completed = true
      )
    `

    const stats = {
      simuladosCompletos: Number(simuladosCompletos[0]?.count || 0),
      mediaNotas: Math.round(Number(mediaNotas[0]?.average || 0)),
      ranking: Number(ranking[0]?.position || 0),
      mockMode: false,
    }

    console.log(`✅ User stats retrieved:`, stats)
    return stats
  } catch (error) {
    console.error("❌ Erro ao buscar estatísticas:", error)
    // Return mock data if database fails
    return {
      simuladosCompletos: 5,
      mediaNotas: 75,
      ranking: 150,
      mockMode: true,
    }
  }
}

export async function getUserById(id: number) {
  try {
    console.log(`🎯 Fetching user by ID: ${id}`)

    if (!isDatabaseAvailable()) {
      console.log("⚠️ Database not available, using mock user")
      return mockUsers.find((u) => u.id === id) || mockUsers[0]
    }

    const sql = createSqlConnection()
    if (!sql) {
      return mockUsers[0]
    }

    const result = await sql`
      SELECT id, email, name, is_premium, created_at 
      FROM users 
      WHERE id = ${id}
    `

    if (result.length === 0) {
      return null
    }

    console.log(`✅ User found: ${result[0].email}`)
    return result[0]
  } catch (error) {
    console.error("❌ Erro ao buscar usuário:", error)
    return mockUsers[0]
  }
}
