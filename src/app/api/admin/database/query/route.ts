import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const tableName = 'query' // For logging purposes
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

    console.log('Query API - User authenticated:', {
      userId: session.user.id,
      role: userRole
    })

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

    const queryToCheck = query.toUpperCase()
    const isDangerous = dangerousKeywords.some(keyword =>
      queryToCheck.includes(keyword.toUpperCase())
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

    // For security, only allow SELECT queries and basic DML operations
    const trimmedQuery = queryToCheck.trim()
    if (!trimmedQuery.startsWith('SELECT') &&
        !trimmedQuery.startsWith('INSERT') &&
        !trimmedQuery.startsWith('UPDATE') &&
        !trimmedQuery.startsWith('DELETE')) {
      return NextResponse.json(
        { error: 'Only SELECT, INSERT, UPDATE, and DELETE queries are allowed' },
        { status: 403 }
      )
    }

    // For now, only allow simple SELECT queries and use direct SQL execution
    // TODO: Implement proper SQL execution with security once database functions are working
    if (!query.toUpperCase().trim().startsWith('SELECT')) {
      return NextResponse.json(
        { error: 'Only SELECT queries are allowed for now' },
        { status: 403 }
      )
    }

    // Execute the query using the database function
    const { data, error } = await supabaseAdmin
      .rpc('exec_sql', { sql_query: query })

    if (error) {
      console.error('Error executing SQL query:', error)
      return NextResponse.json(
        {
          error: 'Failed to execute query',
          details: error.message,
          query: query.substring(0, 100) + (query.length > 100 ? '...' : '')
        },
        { status: 500 }
      )
    }

    console.log('Successfully executed SQL query, result type:', typeof data)

    // For demo purposes, return a mock result if data is null
    // TODO: Replace with actual SQL execution
    const resultData = data || [
      { message: 'SQL query execution is temporarily disabled' },
      { query: query.substring(0, 50) + (query.length > 50 ? '...' : '') },
      { note: 'This is a demo - implement actual SQL execution' }
    ]

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

    // Return result for demo
    return NextResponse.json({
      success: true,
      data: resultData,
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      note: data ? 'Query executed successfully' : 'SQL execution is temporarily mocked for demo purposes'
    })

  } catch (error) {
    console.error('Error in database query API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
