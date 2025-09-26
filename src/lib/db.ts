import { Pool } from 'pg';
import { DATABASE_CONFIG } from './database';

/**
 * Database connection pool for Supabase Transaction Pooler
 * Optimized for stateless applications like serverless functions
 */
class DatabasePool {
  private pool: Pool | null = null;

  getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        connectionString: DATABASE_CONFIG.url,
        min: DATABASE_CONFIG.pool.min,
        max: DATABASE_CONFIG.pool.max,
        idleTimeoutMillis: DATABASE_CONFIG.pool.idleTimeoutMillis,
        connectionTimeoutMillis: DATABASE_CONFIG.pool.connectionTimeoutMillis,
      });

      // Handle pool events
      this.pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
      });

      this.pool.on('connect', () => {
        console.log('New client connected to Supabase pooler');
      });

      this.pool.on('remove', () => {
        console.log('Client removed from Supabase pooler');
      });
    }

    return this.pool;
  }

  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Database pool closed');
    }
  }
}

// Export singleton instance
export const dbPool = new DatabasePool();

/**
 * Execute a query with transaction pooler
 * @param text SQL query text
 * @param params Query parameters
 * @returns Query result
 */
export async function query(text: string, params?: unknown[]): Promise<unknown> {
  const pool = dbPool.getPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed successfully:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('Query failed:', { text, duration, error });
    throw error;
  }
}

/**
 * Execute a transaction with multiple queries
 * @param callback Function that receives a client and executes queries
 * @returns Transaction result
 */
export async function transaction<T>(
  callback: (client: import('pg').PoolClient) => Promise<T>
): Promise<T> {
  const pool = dbPool.getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Test database connection
 * @returns Connection status
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW() as current_time') as { rows: unknown[] };
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
