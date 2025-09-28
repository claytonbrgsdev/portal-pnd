import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

// This endpoint requires SUPABASE_SERVICE_ROLE_KEY environment variable

export async function GET(request: NextRequest) {
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

    // Query to get all tables from information_schema
    const { data: tables, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name, table_schema')
      .eq('table_schema', 'public')
      .order('table_name')

    if (error) {
      console.error('Error fetching tables:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tables' },
        { status: 500 }
      )
    }

    // Log the admin action
    await supabase.from('admin_actions').insert({
      admin_id: session.user.id,
      action: 'database_tables_view',
      payload: { tables_count: tables?.length || 0 }
    })

    return NextResponse.json({
      success: true,
      tables: tables || []
    })

  } catch (error) {
    console.error('Error in database tables API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
