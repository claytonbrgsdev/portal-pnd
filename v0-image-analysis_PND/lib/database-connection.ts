let cachedConnection: any = null
let connectionAttempted = false

export function createSqlConnection() {
  try {
    // If we already attempted and failed, return null immediately
    if (connectionAttempted && !cachedConnection) {
      return null
    }

    // Return cached connection if available
    if (cachedConnection) {
      return cachedConnection
    }

    // Mark that we're attempting connection
    connectionAttempted = true

    // List of possible environment variables in order of preference
    const possibleConnectionStrings = [
      process.env.NEON_DATABASE_URL,
      process.env.POSTGRES_URL,
      process.env.POSTGRES_PRISMA_URL,
      process.env.DATABASE_URL_UNPOOLED,
      process.env.POSTGRES_URL_NON_POOLING,
      process.env.NEON_DATABASE_URL,
    ]

    let connectionString = null

    console.log("🔍 Checking for database connection...")

    // Find the first valid connection string
    for (const envVar of possibleConnectionStrings) {
      if (envVar && typeof envVar === "string" && envVar.trim()) {
        // Check if it's a proper PostgreSQL URL
        if (envVar.startsWith("postgresql://") || envVar.startsWith("postgres://")) {
          connectionString = envVar
          console.log(`✅ Found valid connection string: ${envVar.substring(0, 30)}...`)
          break
        }
      }
    }

    if (!connectionString) {
      console.log("⚠️ No valid database connection found - using mock mode")
      return null
    }

    // Try to dynamically import and create connection
    const { neon } = require("@neondatabase/serverless")
    cachedConnection = neon(connectionString)
    console.log("✅ Database connection established successfully")
    return cachedConnection
  } catch (error) {
    console.error("❌ Failed to create database connection:", error)
    cachedConnection = null
    return null
  }
}

export async function testDatabaseConnection() {
  try {
    console.log("🧪 Testing database connection...")
    const sql = createSqlConnection()

    if (!sql) {
      return {
        success: false,
        error: "No database connection available",
        connectionString: "Not configured",
        mockMode: true,
      }
    }

    const result = await sql`SELECT 
      current_user as user_name,
      current_database() as database_name,
      version() as pg_version,
      now() as current_time
    `

    console.log("✅ Database connection test successful")
    return {
      success: true,
      data: result[0],
      connectionString: process.env.DATABASE_URL?.substring(0, 30) + "...",
      mockMode: false,
    }
  } catch (error) {
    console.error("❌ Database connection test failed:", error)
    return {
      success: false,
      error: error.message,
      connectionString: "Failed to connect",
      mockMode: true,
    }
  }
}

export function isDatabaseAvailable(): boolean {
  try {
    const connection = createSqlConnection()
    return connection !== null
  } catch {
    return false
  }
}

export function resetConnection() {
  cachedConnection = null
  connectionAttempted = false
}
