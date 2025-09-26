/**
 * Database configuration for Supabase Transaction Pooler
 *
 * Environment Variables Required:
 * - DATABASE_URL: Your Supabase connection string
 *
 * Example:
 * DATABASE_URL=postgresql://postgres.rjgzvsuhjxpppvjzzrpq:password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
 */

export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL || 'postgresql://postgres.rjgzvsuhjxpppvjzzrpq:password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  },
  transaction: {
    mode: 'transaction' as const,
  }
} as const;

export type DatabaseConfig = typeof DATABASE_CONFIG;
