# Supabase Transaction Pooler Setup

This project is configured to use Supabase's Transaction Pooler for optimal performance with serverless applications.

## Configuration

### Database Connection
The project uses the following Supabase connection string:
```
postgresql://postgres.rjgzvsuhjxpppvjzzrpq:password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
```

### Key Features

#### Transaction Pooler Benefits
- **Optimized for serverless**: Ideal for stateless applications where each interaction with Postgres is brief and isolated
- **Automatic connection pooling**: Manages database connections efficiently
- **No PREPARE statements**: By design, optimized for short-lived connections

#### Configuration Details
```typescript
// Database configuration in src/lib/database.ts
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
}
```

## Project Structure

```
src/
├── lib/
│   ├── database.ts      # Database configuration
│   ├── db.ts           # Database utilities and connection pool
│   └── supabase.ts     # Supabase client configuration
├── app/
│   ├── api/
│   │   └── test-db/    # API route to test database connection
│   └── test-db/        # Frontend page to test database
```

## Usage

### Environment Variables
Create a `.env.local` file with:
```env
DATABASE_URL=postgresql://postgres.rjgzvsuhjxpppvjzzrpq:your-actual-password@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
NEXT_PUBLIC_SUPABASE_URL=https://rjgzvsuhjxpppvjzzrpq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Testing the Connection

1. **API Test**: Visit `/api/test-db` to test the database connection
2. **Frontend Test**: Visit `/test-db` to test from the browser

### Database Operations

```typescript
import { query, transaction } from '@/lib/db';

// Simple query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

// Transaction with multiple operations
const user = await transaction(async (client) => {
  await client.query('INSERT INTO users (name) VALUES ($1)', ['John']);
  const result = await client.query('SELECT LASTVAL()');
  return result.rows[0];
});
```

## Deployment Notes

- The transaction pooler is optimized for serverless environments
- Connection pooling is handled automatically
- Perfect for Next.js API routes and serverless functions
- The pooler uses port 6543 (different from the standard 5432)

## Troubleshooting

1. **Connection Issues**: Verify the DATABASE_URL is correct
2. **Permission Errors**: Ensure your Supabase credentials are valid
3. **Pool Exhaustion**: Monitor connection pool usage in production

## Resources

- [Supabase Transaction Pooler Documentation](https://supabase.com/docs/guides/database/pooling)
- [Next.js Database Integration](https://nextjs.org/docs/pages/building-your-application/data-fetching)
- [PostgreSQL Client for Node.js](https://node-postgres.com/)
