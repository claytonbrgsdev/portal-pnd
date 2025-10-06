import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { query as pgQuery } from '@/lib/db'

// Get all tables from the database
export async function GET() {
  try {
    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = session.user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Tables API - User authenticated:', {
      userId: session.user.id,
      role: userRole
    })

    // Create admin client with service role for data access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get tables using the database function
    const { data: tables, error } = await supabaseAdmin
      .rpc('get_public_tables')

    if (error) {
      console.error('Error fetching tables from database:', error)
      // Fallback to direct SQL via pg pool (does not depend on PostgREST)
      try {
        const result = await pgQuery(
          `SELECT table_name::text, table_schema::text
           FROM information_schema.tables
           WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
           ORDER BY table_name`)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = (result as any).rows || []
        return NextResponse.json({
          success: true,
          tables: rows,
          count: rows.length,
          note: 'Using direct SQL fallback - RPC not available'
        })
      } catch (e) {
        console.error('SQL fallback failed:', e)
        return NextResponse.json(
          { error: 'Failed to fetch tables' },
          { status: 500 }
        )
      }
    }

    console.log('Successfully fetched tables from database:', tables?.length || 0, 'tables')

    return NextResponse.json({
      success: true,
      tables: tables || [],
      count: tables?.length || 0
    })

  } catch (error) {
    console.error('Error in database tables API:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
