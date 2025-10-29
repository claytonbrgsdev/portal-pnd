import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { query as pgQuery } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table

    // Use server client with authentication context
    const supabase = await createServerClient()

    // Check if user is authenticated and is admin
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userRole = user.user_metadata?.user_role
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized: admin access required' },
        { status: 403 }
      )
    }

    console.log('Structure API - User authenticated:', {
      userId: user.id,
      role: userRole,
      tableName
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

    // Get table structure using the database function
    const { data: columns, error } = await supabaseAdmin
      .rpc('get_table_columns', { table_name_param: tableName })

    if (error) {
      console.error('Error fetching table structure from database:', error)
      // Fallback to direct SQL via pg
      try {
        const result = await pgQuery(
          `SELECT column_name::text, data_type::text, is_nullable::text, column_default::text
           FROM information_schema.columns
           WHERE table_schema = 'public' AND table_name = $1
           ORDER BY ordinal_position`, [tableName])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows = (result as any).rows || []
        return NextResponse.json({
          success: true,
          columns: rows,
          note: 'Using direct SQL fallback - RPC not available'
        })
      } catch (e) {
        console.error('SQL columns fallback failed:', e)
        return NextResponse.json({ error: 'Failed to fetch table structure' }, { status: 500 })
      }
    }

    console.log('Successfully fetched table structure from database:', columns?.length || 0, 'columns')

    return NextResponse.json({
      success: true,
      columns: columns || []
    })

  } catch (error) {
    console.error('Error in database structure API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
