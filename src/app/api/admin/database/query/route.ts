import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { query } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Basic security: prevent dangerous operations
    const dangerousKeywords = [
      'DROP DATABASE',
      'DROP SCHEMA',
      'ALTER DATABASE',
      'CREATE DATABASE',
      'TRUNCATE',
      'DELETE FROM',
      'UPDATE',
      'INSERT INTO',
      'ALTER TABLE.*DROP',
      'DROP TABLE'
    ]

    const upperQuery = query.toUpperCase()
    const isDangerous = dangerousKeywords.some(keyword =>
      upperQuery.includes(keyword.toUpperCase())
    )

    if (isDangerous) {
      return NextResponse.json(
        { error: 'Dangerous SQL operations are not allowed' },
        { status: 403 }
      )
    }

    // Create Supabase admin client using service role key
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

    // Execute the query
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: query })

    if (error) {
      console.error('Error executing SQL query:', error)
      return NextResponse.json(
        {
          error: 'Failed to execute query',
          details: error.message
        },
        { status: 500 }
      )
    }

    // Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: session.user.id,
      action: 'database_query_execute',
      payload: {
        query_length: query.length,
        has_results: !!data,
        // Don't log the actual query for security
      }
    })

    return NextResponse.json({
      success: true,
      data: data,
      query: query.substring(0, 100) + (query.length > 100 ? '...' : '')
    })

  } catch (error) {
    console.error('Error in database query API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
